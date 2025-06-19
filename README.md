# URBANAURA - Premium Watch Ecommerce Website

A modern, responsive ecommerce website specifically designed for selling premium watches. Built with HTML, CSS, JavaScript, and PHP with integrated Razorpay payment gateway.

## 🌟 Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with beautiful UI/UX
- **Modern Interface**: Clean, professional design with smooth animations
- **Product Catalog**: Browse watches by category, brand, and price
- **Advanced Filtering**: Filter by category, brand, and price range
- **Search Functionality**: Real-time search across products
- **Shopping Cart**: Full cart management with quantity controls
- **Wishlist**: Save favorite watches for later
- **Product Modals**: Detailed product views with zoom functionality
- **Newsletter Subscription**: Email marketing integration
- **Secure Checkout**: Complete checkout process with WhatsApp order instructions

### Backend Features
- **PHP Backend**: Server-side processing and form handling
- **Database Integration**: MySQL database support (configurable)
- **Email System**: Newsletter subscription and notifications
- **Security**: Input sanitization and validation
- **Logging**: Activity logging for monitoring
- **Session Management**: User session handling
- **Payment Processing**: Order via WhatsApp screenshot

### Ecommerce Features
- **Product Management**: Add, edit, and manage watch inventory
- **Category System**: Organize watches by type (Luxury, Sports, Smart, Classic)
- **Brand Showcase**: Featured premium watch brands
- **Price Management**: Dynamic pricing with currency formatting
- **Inventory Tracking**: Stock management capabilities
- **Order Processing**: Complete checkout and order management
- **Promo Codes**: Discount and coupon system
- **Shipping Calculator**: Dynamic shipping costs
- **Payment Gateway**: Secure online payments via Razorpay
- **Order Confirmation**: Automated order confirmation and tracking

## 🚀 Quick Start

### Prerequisites
- Web server (Apache/Nginx)
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Composer (for PHP dependencies)
- Modern web browser
- Razorpay account (for payment processing)

### Installation

1. **Clone or Download the Project**
   ```bash
   git clone https://github.com/yourusername/urbanaura.git
   cd urbanaura
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Set Up Web Server**
   - Place the project files in your web server's document root
   - Ensure the web server can access the files

4. **Configure Database**
   ```sql
   -- Create database
   CREATE DATABASE urbanaura_db;
   ```

5. **Configure Razorpay**
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Get your API keys from Settings → API Keys
   - Update `php/razorpay-config.php` with your keys

6. **Update Configuration**
   - Edit `php/razorpay-config.php` to set your database credentials
   - Update site configuration as needed

7. **Access the Website**
   - Open your web browser
   - Navigate to `http://localhost/urbanaura` (or your server URL)

## 📁 Project Structure

```
urbanaura/
├── index.html              # Homepage
├── products.html           # Product catalog page
├── cart.html              # Shopping cart page
├── checkout.html          # Checkout page with Razorpay
├── order-success.html     # Order confirmation page
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js            # Main JavaScript functionality
│   ├── products.js        # Products page functionality
│   ├── cart.js            # Cart page functionality
│   ├── checkout.js        # Checkout functionality
│   └── order-success.js   # Order success page
├── php/
│   ├── config.php         # Configuration and utilities
│   ├── newsletter.php     # Newsletter subscription handler
│   ├── razorpay-config.php # Razorpay configuration
│   ├── create-order.php   # Order creation endpoint
│   └── verify-payment.php # Payment verification endpoint
├── images/                # Product images (create if needed)
├── logs/                  # Activity logs (auto-created)
├── composer.json          # PHP dependencies
├── RAZORPAY_SETUP.md      # Detailed Razorpay setup guide
└── README.md              # This file
```

## 💳 Payment Integration

URBANAURA now processes orders via WhatsApp. To place an order, take a screenshot of your cart and send it to Aquib on WhatsApp at +91 9451277330. No online payment is required.

## 🎨 Customization

### Styling
- Edit `css/style.css` to customize colors, fonts, and layout
- Main color scheme: Gold (#bfa14a), Dark (#181411), Secondary (#fff8e1)
- Font: Segoe UI (fallback to system fonts)

### Products
- Add new products by editing the `sampleProducts` array in `js/main.js`
- Each product should have: id, name, brand, price, category, image, description, badge

### Configuration
- Update site settings in `php/config.php`
- Modify database connection details
- Set admin email and site URL
- Configure Razorpay API keys

## 🔧 Features in Detail

### Homepage
- Hero section with call-to-action
- Featured product categories
- Brand showcase
- Newsletter subscription
- Responsive navigation

### Products Page
- Advanced filtering system
- Price range sliders
- Category and brand filters
- Sorting options (price, name, brand)
- Pagination
- Search functionality

### Shopping Cart
- Add/remove items
- Quantity controls
- Price calculations
- Promo code system
- Shipping calculator
- Related products

### Checkout Process
- Customer information form
- Order summary
- Secure payment gateway
- Payment verification
- Order confirmation

### Newsletter System
- Email validation
- Duplicate prevention
- Welcome emails
- Unsubscribe functionality
- Activity logging

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Security Features

- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF protection (recommended for production)
- Secure session handling
- Payment signature verification
- SSL/TLS encryption

## 🚀 Performance Optimizations

- Optimized images
- Minified CSS/JS (recommended for production)
- Lazy loading (can be implemented)
- CDN support for external resources
- Efficient database queries

## 📧 Email Integration

The newsletter system supports:
- Welcome emails
- Unsubscribe functionality
- Email validation
- Activity logging

## 🛠️ Development

### Adding New Features
1. Follow the existing code structure
2. Maintain responsive design principles
3. Test across different devices
4. Update documentation

### Code Style
- Use consistent indentation
- Follow JavaScript ES6+ standards
- Maintain CSS organization
- Comment complex logic

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the Razorpay setup guide

## 🔄 Updates

Stay updated with the latest features and security patches by regularly pulling from the repository.

---

**URBANAURA** - Your trusted destination for premium watches with secure online payments. 