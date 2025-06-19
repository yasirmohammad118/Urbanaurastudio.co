<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

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
    $requiredFields = ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }
    
    $paymentId = $input['razorpay_payment_id'];
    $orderId = $input['razorpay_order_id'];
    $signature = $input['razorpay_signature'];
    
    // Verify payment signature
    if (!verifyPaymentSignature($paymentId, $orderId, $signature)) {
        logPaymentAttempt($orderId, $paymentId, 'failed', 'Invalid signature');
        throw new Exception('Payment verification failed');
    }
    
    // Update order status in database
    $pdo = getDBConnection();
    if (!$pdo) {
        throw new Exception('Database connection failed');
    }
    
    $stmt = $pdo->prepare("UPDATE orders SET razorpay_payment_id = ?, status = 'paid' WHERE order_id = ?");
    $stmt->execute([$paymentId, $orderId]);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception('Order not found');
    }
    
    // Get order details for confirmation
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE order_id = ?");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Log successful payment
    logPaymentAttempt($orderId, $paymentId, 'success');
    
    // Send confirmation email (you can implement this later)
    // sendOrderConfirmationEmail($order);
    
    $response = [
        'success' => true,
        'message' => 'Payment verified successfully',
        'order_id' => $orderId,
        'payment_id' => $paymentId,
        'amount' => $order['total'],
        'status' => 'paid'
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Payment verification error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Payment verification failed',
        'message' => $e->getMessage()
    ]);
}

// Function to send order confirmation email (placeholder)
function sendOrderConfirmationEmail($order) {
    // Implement email sending logic here
    // You can use PHPMailer or other email libraries
    error_log("Order confirmation email would be sent for order: " . $order['order_id']);
}
?> 