// Checkout page functionality
let checkoutData = null;
let orderDetails = null;

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

function initializeCheckout() {
    // Load checkout data from sessionStorage
    const storedData = sessionStorage.getItem('checkoutData');
    if (!storedData) {
        showMessage('No checkout data found. Please return to cart.', 'error');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 2000);
        return;
    }
    
    checkoutData = JSON.parse(storedData);
    displayOrderSummary();
    updateCartCount();
    
    // Pre-fill form if user data exists
    prefillUserData();
}

// Display order summary
function displayOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const mobileSubtotal = document.getElementById('mobile-subtotal');
    const mobileShipping = document.getElementById('mobile-shipping');
    const mobileTotal = document.getElementById('mobile-total');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryTotal = document.getElementById('summary-total');
    
    if (!orderItemsContainer) return;
    
    // Display order items
    orderItemsContainer.innerHTML = checkoutData.items.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-details">
                <h4>${item.name}</h4>
                <p>${item.brand}</p>
                <span class="quantity">Qty: ${item.quantity}</span>
            </div>
            <div class="order-item-price">
                ₹${(item.price * item.quantity).toLocaleString()}
            </div>
        </div>
    `).join('');
    
    // Calculate and display totals
    const subtotal = checkoutData.totals.subtotal;
    const shipping = checkoutData.totals.shipping;
    let total = subtotal + shipping;
    
    // Apply promo discount if exists
    if (checkoutData.totals.promo) {
        const discount = subtotal * (checkoutData.totals.promo.discount / 100);
        total -= discount;
    }
    
    // Update all total displays
    [mobileSubtotal, summarySubtotal].forEach(el => {
        if (el) el.textContent = `₹${subtotal.toLocaleString()}`;
    });
    
    [mobileShipping, summaryShipping].forEach(el => {
        if (el) el.textContent = shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`;
    });
    
    [mobileTotal, summaryTotal].forEach(el => {
        if (el) el.textContent = `₹${total.toLocaleString()}`;
    });
}

// Pre-fill user data if available
function prefillUserData() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (userData.name) {
        document.getElementById('customer-name').value = userData.name;
    }
    if (userData.email) {
        document.getElementById('customer-email').value = userData.email;
    }
    if (userData.phone) {
        document.getElementById('customer-phone').value = userData.phone;
    }
    if (userData.address) {
        document.getElementById('shipping-address').value = userData.address;
    }
    if (userData.city) {
        document.getElementById('customer-city').value = userData.city;
    }
    if (userData.state) {
        document.getElementById('customer-state').value = userData.state;
    }
    if (userData.pincode) {
        document.getElementById('customer-pincode').value = userData.pincode;
    }
}

// Validate checkout form
function validateCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const requiredFields = [
        'customer-name', 'customer-email', 'customer-phone', 
        'customer-city', 'shipping-address', 'customer-pincode', 'customer-state'
    ];
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showMessage(`Please fill in ${field.placeholder || fieldId.replace('-', ' ')}`, 'error');
            field.focus();
            return false;
        }
    }
    
    // Validate email format
    const email = document.getElementById('customer-email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        document.getElementById('customer-email').focus();
        return false;
    }
    
    // Validate phone number
    const phone = document.getElementById('customer-phone').value;
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        showMessage('Please enter a valid 10-digit phone number', 'error');
        document.getElementById('customer-phone').focus();
        return false;
    }
    
    return true;
}

// Save user data for future use
function saveUserData() {
    const userData = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        city: document.getElementById('customer-city').value,
        state: document.getElementById('customer-state').value,
        pincode: document.getElementById('customer-pincode').value,
        address: document.getElementById('shipping-address').value
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Create order and initiate payment
async function initiatePayment() {
    if (!validateCheckoutForm()) {
        return;
    }
    
    // Save user data
    saveUserData();
    
    // Show payment processing modal
    document.getElementById('payment-modal').style.display = 'flex';
    
    try {
        // Prepare order data
        const orderData = {
            customer_name: document.getElementById('customer-name').value,
            customer_email: document.getElementById('customer-email').value,
            customer_phone: document.getElementById('customer-phone').value,
            shipping_address: `${document.getElementById('shipping-address').value}, ${document.getElementById('customer-city').value}, ${document.getElementById('customer-state').value} - ${document.getElementById('customer-pincode').value}`,
            items: checkoutData.items,
            totals: checkoutData.totals
        };
        
        // Create order on server
        const response = await fetch('php/create-order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || 'Failed to create order');
        }
        
        orderDetails = result;
        
        // Initialize Razorpay payment
        const options = {
            key: result.key_id,
            amount: result.amount * 100, // Convert to paise
            currency: result.currency,
            name: 'URBANAURA',
            description: 'Premium Watches Purchase',
            order_id: result.razorpay_order_id,
            handler: function(response) {
                handlePaymentSuccess(response);
            },
            prefill: {
                name: result.customer_details.name,
                email: result.customer_details.email,
                contact: result.customer_details.phone
            },
            theme: {
                color: '#1e40af'
            },
            modal: {
                ondismiss: function() {
                    document.getElementById('payment-modal').style.display = 'none';
                }
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
        
    } catch (error) {
        console.error('Payment initiation error:', error);
        document.getElementById('payment-modal').style.display = 'none';
        showMessage('Failed to initiate payment. Please try again.', 'error');
    }
}

// Handle successful payment
async function handlePaymentSuccess(response) {
    try {
        // Verify payment on server
        const verifyResponse = await fetch('php/verify-payment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
            })
        });
        
        const result = await verifyResponse.json();
        
        if (result.success) {
            // Clear cart and checkout data
            localStorage.removeItem('cart');
            sessionStorage.removeItem('checkoutData');
            
            // Show success message and redirect
            showMessage('Payment successful! Your order has been placed.', 'success');
            setTimeout(() => {
                window.location.href = 'order-success.html?order_id=' + result.order_id;
            }, 2000);
        } else {
            throw new Error(result.message || 'Payment verification failed');
        }
        
    } catch (error) {
        console.error('Payment verification error:', error);
        showMessage('Payment verification failed. Please contact support.', 'error');
    } finally {
        document.getElementById('payment-modal').style.display = 'none';
    }
}

// Show message
function showMessage(message, type = 'success') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    
    // Add to page
    document.body.appendChild(messageEl);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentElement) {
            messageEl.remove();
        }
    }, 5000);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
} 