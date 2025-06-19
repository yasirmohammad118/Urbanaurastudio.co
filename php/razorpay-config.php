<?php
// Razorpay Configuration
// Replace these with your actual Razorpay API keys
define('RAZORPAY_KEY_ID', 'rzp_test_YOUR_KEY_ID_HERE');
define('RAZORPAY_KEY_SECRET', 'YOUR_KEY_SECRET_HERE');

// Database configuration for storing orders
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'urbanaura_db');

// Create database connection
function getDBConnection() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

// Initialize database tables
function initializeDatabase() {
    $pdo = getDBConnection();
    if (!$pdo) return false;
    
    try {
        // Create orders table
        $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id VARCHAR(50) UNIQUE NOT NULL,
            razorpay_payment_id VARCHAR(100),
            customer_name VARCHAR(100) NOT NULL,
            customer_email VARCHAR(100) NOT NULL,
            customer_phone VARCHAR(20),
            shipping_address TEXT NOT NULL,
            items JSON NOT NULL,
            subtotal DECIMAL(10,2) NOT NULL,
            shipping DECIMAL(10,2) NOT NULL,
            discount DECIMAL(10,2) DEFAULT 0,
            total DECIMAL(10,2) NOT NULL,
            status ENUM('pending', 'paid', 'failed', 'cancelled') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");
        
        return true;
    } catch(PDOException $e) {
        error_log("Database initialization failed: " . $e->getMessage());
        return false;
    }
}

// Generate unique order ID
function generateOrderId() {
    return 'URBANAURA_' . date('Ymd') . '_' . uniqid();
}

// Validate payment signature
function verifyPaymentSignature($paymentId, $orderId, $signature) {
    $expectedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, RAZORPAY_KEY_SECRET);
    return hash_equals($expectedSignature, $signature);
}

// Log payment attempt
function logPaymentAttempt($orderId, $paymentId, $status, $error = null) {
    $logFile = 'logs/payment_' . date('Y-m-d') . '.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logEntry = date('Y-m-d H:i:s') . " | Order: $orderId | Payment: $paymentId | Status: $status";
    if ($error) {
        $logEntry .= " | Error: $error";
    }
    $logEntry .= "\n";
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Initialize database on first run
if (!function_exists('initializeDatabase')) {
    initializeDatabase();
}
?> 