// Order success page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeOrderSuccess();
});

function initializeOrderSuccess() {
    // Get order ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    
    if (orderId) {
        displayOrderDetails(orderId);
    } else {
        // If no order ID, show generic success message
        document.getElementById('order-id').textContent = 'N/A';
        document.getElementById('order-date').textContent = new Date().toLocaleDateString();
        document.getElementById('order-amount').textContent = 'N/A';
    }
    
    updateCartCount();
}

function displayOrderDetails(orderId) {
    // Display order ID
    document.getElementById('order-id').textContent = orderId;
    
    // Display current date as order date
    document.getElementById('order-date').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Try to get order amount from session storage or localStorage
    const orderData = sessionStorage.getItem('orderData');
    if (orderData) {
        try {
            const order = JSON.parse(orderData);
            document.getElementById('order-amount').textContent = `₹${order.amount.toLocaleString()}`;
        } catch (e) {
            document.getElementById('order-amount').textContent = 'N/A';
        }
    } else {
        document.getElementById('order-amount').textContent = 'N/A';
    }
}

function downloadInvoice() {
    // This would typically generate and download an invoice PDF
    // For now, we'll show a message
    showMessage('Invoice download feature will be implemented soon.', 'info');
}

function showMessage(message, type = 'success') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
} 