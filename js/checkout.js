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

// Remove initiatePayment and payment logic, add orderViaWhatsapp
function orderViaWhatsapp() {
    const phone = '919451277330'; // WhatsApp number in international format
    let message = 'Hi Aquib, I would like to order these watches:';
    if (checkoutData && checkoutData.items && checkoutData.items.length > 0) {
        message += '\n';
        checkoutData.items.forEach(item => {
            message += `• ${item.name} (x${item.quantity})\n`;
        });
    }
    message += '\nPlease find my cart screenshot attached.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
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