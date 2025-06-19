// Cart page functionality
let cartItems = [];
let appliedPromo = null;

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});

function initializeCart() {
    // Load cart from localStorage
    cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItems.length === 0) {
        showEmptyCart();
    } else {
        displayCartItems();
        loadRelatedProducts();
    }
    
    updateCartCount();
    calculateTotals();
}

// Display cart items
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartItemsCount = document.getElementById('cart-items-count');
    
    if (!cartContainer) return;
    
    if (cartItems.length === 0) {
        showEmptyCart();
        return;
    }
    
    // Hide empty cart message
    if (cartEmpty) {
        cartEmpty.style.display = 'none';
    }
    
    // Update items count
    if (cartItemsCount) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartItemsCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    }
    
    // Display cart items
    cartContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-brand">${item.brand}</p>
                <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">
                ₹${(item.price * item.quantity).toLocaleString()}
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Show empty cart message
function showEmptyCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartItemsCount = document.getElementById('cart-items-count');
    
    if (cartContainer) {
        cartContainer.innerHTML = '';
    }
    
    if (cartEmpty) {
        cartEmpty.style.display = 'block';
    }
    
    if (cartItemsCount) {
        cartItemsCount.textContent = '0 items';
    }
}

// Update cart quantity
function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        displayCartItems();
        calculateTotals();
        updateCartCount();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    displayCartItems();
    calculateTotals();
    updateCartCount();
    
    showMessage('Item removed from cart', 'success');
}

// Calculate totals
function calculateTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 25; // Free shipping over ₹500
    let total = subtotal + shipping;
    
    // Apply promo code if exists
    if (appliedPromo) {
        const discount = subtotal * (appliedPromo.discount / 100);
        total -= discount;
    }
    
    // Update display
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`;
    document.getElementById('total').textContent = `₹${total.toLocaleString()}`;
}

// Apply promo code
function applyPromo() {
    const promoInput = document.getElementById('promo-input');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // Sample promo codes
    const validPromos = {
        'WELCOME10': { discount: 10, description: '10% off your first order' },
        'LUXURY20': { discount: 20, description: '20% off luxury watches' },
        'FREESHIP': { discount: 0, description: 'Free shipping on any order' }
    };
    
    if (validPromos[promoCode]) {
        appliedPromo = { code: promoCode, ...validPromos[promoCode] };
        calculateTotals();
        showMessage(`Promo code applied: ${appliedPromo.description}`, 'success');
        promoInput.value = '';
    } else {
        showMessage('Invalid promo code', 'error');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartItems.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    // Store checkout data
    const checkoutData = {
        items: cartItems,
        totals: {
            subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shipping: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 500 ? 0 : 25,
            promo: appliedPromo
        }
    };
    
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Load related products
function loadRelatedProducts() {
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;
    
    // Get categories from cart items
    const cartCategories = [...new Set(cartItems.map(item => item.category))];
    
    // Filter products that are not in cart and match categories
    const relatedProducts = products.filter(product => 
        !cartItems.find(item => item.id === product.id) &&
        cartCategories.includes(product.category)
    ).slice(0, 4);
    
    if (relatedProducts.length === 0) {
        // If no related products, show random products
        const randomProducts = products.filter(product => 
            !cartItems.find(item => item.id === product.id)
        ).slice(0, 4);
        
        displayRelatedProducts(randomProducts, relatedContainer);
    } else {
        displayRelatedProducts(relatedProducts, relatedContainer);
    }
}

// Display related products
function displayRelatedProducts(productsToShow, container) {
    if (productsToShow.length === 0) {
        container.innerHTML = '<p>No related products available</p>';
        return;
    }
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onclick="showProductModal(${product.id})">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title" onclick="showProductModal(${product.id})">${product.name}</h3>
                <p class="product-brand">${product.brand}</p>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-wishlist" onclick="addToWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show message
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Insert at the top of the body
    document.body.insertBefore(messageDiv, document.body.firstChild);

    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Export functions for use in other scripts
window.CartPage = {
    updateCartQuantity,
    removeFromCart,
    applyPromo,
    proceedToCheckout,
    cartItems
}; 