<?php
require_once 'config.php';

// Handle newsletter subscription
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email'] ?? '');
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'message' => 'Please enter a valid email address'], 400);
    }
    
    try {
        $pdo = connectDB();
        
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(['success' => false, 'message' => 'This email is already subscribed'], 400);
        }
        
        // Insert new subscriber
        $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (?, NOW())");
        $stmt->execute([$email]);
        
        // Log activity
        logActivity('newsletter_subscription', "Email: $email");
        
        // Send welcome email
        $subject = "Welcome to " . SITE_NAME . " Newsletter!";
        $message = "Thank you for subscribing to our newsletter!\n\n";
        $message .= "You'll now receive updates about our latest watch collections, exclusive offers, and industry news.\n\n";
        $message .= "Best regards,\nThe " . SITE_NAME . " Team";
        
        sendEmail($email, $subject, $message);
        
        jsonResponse(['success' => true, 'message' => 'Thank you for subscribing to our newsletter!']);
        
    } catch (PDOException $e) {
        logActivity('newsletter_error', $e->getMessage());
        jsonResponse(['success' => false, 'message' => 'An error occurred. Please try again.'], 500);
    }
}

// Handle unsubscribe
if (isset($_GET['unsubscribe'])) {
    $email = sanitize($_GET['email'] ?? '');
    $token = sanitize($_GET['token'] ?? '');
    
    if (empty($email) || empty($token)) {
        jsonResponse(['success' => false, 'message' => 'Invalid unsubscribe link'], 400);
    }
    
    try {
        $pdo = connectDB();
        
        // Verify token and email
        $stmt = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = ? AND unsubscribe_token = ?");
        $stmt->execute([$email, $token]);
        
        if ($stmt->rowCount() === 0) {
            jsonResponse(['success' => false, 'message' => 'Invalid unsubscribe link'], 400);
        }
        
        // Remove subscriber
        $stmt = $pdo->prepare("DELETE FROM newsletter_subscribers WHERE email = ?");
        $stmt->execute([$email]);
        
        logActivity('newsletter_unsubscribe', "Email: $email");
        
        jsonResponse(['success' => true, 'message' => 'You have been successfully unsubscribed from our newsletter.']);
        
    } catch (PDOException $e) {
        logActivity('newsletter_unsubscribe_error', $e->getMessage());
        jsonResponse(['success' => false, 'message' => 'An error occurred. Please try again.'], 500);
    }
}

// If not POST or GET with unsubscribe, return 405 Method Not Allowed
http_response_code(405);
jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
?> 