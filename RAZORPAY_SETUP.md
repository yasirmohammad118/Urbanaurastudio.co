# Razorpay Integration Setup Guide for URBANAURA

This guide will help you set up Razorpay payment gateway integration for your URBANAURA ecommerce website.

## Prerequisites

1. **PHP 7.4 or higher**
2. **MySQL/MariaDB database**
3. **Composer** (PHP package manager)
4. **Razorpay account** (test/live)

## Step 1: Install Dependencies

1. **Install Composer dependencies:**
   ```bash
   composer install
   ```

2. **Install Razorpay SDK:**
   ```bash
   composer require razorpay/razorpay
   ```

## Step 2: Database Setup

1. **Create database:**
   ```sql
   CREATE DATABASE urbanaura_db;
   ```

2. **Update database configuration in `php/razorpay-config.php`:**
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   define('DB_NAME', 'urbanaura_db');
   ```

3. **The database tables will be created automatically when you first run the application.**

## Step 3: Razorpay Account Setup

1. **Sign up for Razorpay:**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Create a new account or sign in

2. **Get API Keys:**
   - Navigate to Settings → API Keys
   - Generate a new key pair
   - Copy the Key ID and Key Secret

3. **Update API Keys in `php/razorpay-config.php`:**
   ```php
   define('RAZORPAY_KEY_ID', 'rzp_test_YOUR_KEY_ID_HERE');
   define('RAZORPAY_KEY_SECRET', 'YOUR_KEY_SECRET_HERE');
   ```

## Step 4: Webhook Setup (Optional but Recommended)

1. **Configure webhook URL in Razorpay Dashboard:**
   - Go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/php/webhook.php`
   - Select events: `payment.captured`, `payment.failed`

2. **Create webhook handler (optional):**
   ```php
   // php/webhook.php
   <?php
   require_once 'razorpay-config.php';
   
   $payload = file_get_contents('php://input');
   $signature = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'];
   
   try {
       $api = new Razorpay\Api\Api(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
       $api->utility->verifyWebhookSignature($payload, $signature, 'your_webhook_secret');
       
       $data = json_decode($payload, true);
       
       // Handle webhook events
       switch($data['event']) {
           case 'payment.captured':
               // Update order status
               break;
           case 'payment.failed':
               // Handle failed payment
               break;
       }
       
       http_response_code(200);
   } catch(Exception $e) {
       http_response_code(400);
   }
   ?>
   ```

## Step 5: Testing

1. **Test Mode:**
   - Use Razorpay test mode for development
   - Test card numbers:
     - Success: `4111 1111 1111 1111`
     - Failure: `4000 0000 0000 0002`

2. **Test the complete flow:**
   - Add items to cart
   - Proceed to checkout
   - Fill customer information
   - Complete payment with test card

## Step 6: Production Deployment

1. **Switch to Live Mode:**
   - Update API keys to live keys
   - Update webhook URLs to production domain
   - Test thoroughly with small amounts

2. **Security Considerations:**
   - Keep API keys secure
   - Use HTTPS in production
   - Implement proper error handling
   - Add logging for debugging

## File Structure

```
├── php/
│   ├── razorpay-config.php      # Configuration and utilities
│   ├── create-order.php         # Order creation endpoint
│   ├── verify-payment.php       # Payment verification endpoint
│   └── webhook.php              # Webhook handler (optional)
├── js/
│   ├── checkout.js              # Checkout functionality
│   └── order-success.js         # Order success page
├── checkout.html                # Checkout page
├── order-success.html           # Order success page
└── composer.json                # PHP dependencies
```

## API Endpoints

### 1. Create Order
- **URL:** `POST /php/create-order.php`
- **Purpose:** Creates order and Razorpay payment order
- **Response:** Order details with Razorpay order ID

### 2. Verify Payment
- **URL:** `POST /php/verify-payment.php`
- **Purpose:** Verifies payment signature and updates order status
- **Response:** Payment verification result

## Error Handling

The integration includes comprehensive error handling:

1. **Form validation** on frontend
2. **API validation** on backend
3. **Payment signature verification**
4. **Database error handling**
5. **User-friendly error messages**

## Troubleshooting

### Common Issues:

1. **"Failed to create order"**
   - Check database connection
   - Verify API keys
   - Check PHP error logs

2. **"Payment verification failed"**
   - Verify webhook signature
   - Check payment status in Razorpay dashboard
   - Review payment logs

3. **"Database connection failed"**
   - Verify database credentials
   - Check MySQL service status
   - Ensure database exists

### Debug Mode:

Enable debug logging by adding to `php/razorpay-config.php`:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## Support

For additional support:
- Razorpay Documentation: [docs.razorpay.com](https://docs.razorpay.com/)
- Razorpay Support: [support.razorpay.com](https://support.razorpay.com/)

## Security Notes

1. **Never expose API keys** in client-side code
2. **Always verify payment signatures** on server-side
3. **Use HTTPS** in production
4. **Implement rate limiting** for API endpoints
5. **Log all payment attempts** for audit trail 