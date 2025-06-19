<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Include Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

require_once 'razorpay-config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid input data');
    }
    
    // Validate required fields
    $requiredFields = ['customer_name', 'customer_email', 'customer_phone', 'shipping_address', 'items', 'totals'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }
    
    // Generate order ID
    $orderId = generateOrderId();
    
    // Calculate totals
    $subtotal = $input['totals']['subtotal'];
    $shipping = $input['totals']['shipping'];
    $discount = isset($input['totals']['promo']) ? ($subtotal * $input['totals']['promo']['discount'] / 100) : 0;
    $total = $subtotal + $shipping - $discount;
    
    // Store order in database
    $pdo = getDBConnection();
    if (!$pdo) {
        throw new Exception('Database connection failed');
    }
    
    $stmt = $pdo->prepare("INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, shipping, discount, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $orderId,
        $input['customer_name'],
        $input['customer_email'],
        $input['customer_phone'],
        $input['shipping_address'],
        json_encode($input['items']),
        $subtotal,
        $shipping,
        $discount,
        $total
    ]);
    
    // Create Razorpay order
    $razorpayOrderData = [
        'receipt' => $orderId,
        'amount' => $total * 100, // Razorpay expects amount in paise
        'currency' => 'INR',
        'notes' => [
            'customer_name' => $input['customer_name'],
            'customer_email' => $input['customer_email']
        ]
    ];
    
    // Initialize Razorpay
    $api = new Razorpay\Api\Api(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
    $razorpayOrder = $api->order->create($razorpayOrderData);
    
    // Return order details for frontend
    $response = [
        'success' => true,
        'order_id' => $orderId,
        'razorpay_order_id' => $razorpayOrder['id'],
        'amount' => $total,
        'currency' => 'INR',
        'key_id' => RAZORPAY_KEY_ID,
        'customer_details' => [
            'name' => $input['customer_name'],
            'email' => $input['customer_email'],
            'phone' => $input['customer_phone']
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Order creation error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to create order',
        'message' => $e->getMessage()
    ]);
}
?> 