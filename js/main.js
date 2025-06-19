// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Sample product data
const sampleProducts = [
    {
        id: 1,
        name: "Rolex Submariner",
        brand: "Rolex",
        price: 3000,
        category: "luxury",
        image: "images/rolex-submariner.jpg",
        description: "The iconic dive watch with exceptional water resistance and timeless design.",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "TAG HEUER AQUARACER",
        brand: "TAG Heuer",
        price: 7000,
        category: "luxury",
        image: "images/2.jpg",
        description: "The first watch worn on the moon, featuring chronograph functionality.",
        badge: "Limited"
    },
    {
        id: 3,
        name: "Audemars Piguet Royal Oak skeleton",
        brand: "Audemars Piguet",
        price: 4100,
        category: "luxury",
        image: "images/3.jpg",
        description: "Advanced health monitoring and seamless integration with Apple ecosystem.",
        badge: "New"
    },
    {
        id: 4,
        name: "Omega Seamaster",
        brand: "Omega",
        price: 4800,
        category: "luxury",
        image: "images/4.jpg",
        description: "Elegant rectangular design with sophisticated styling for formal occasions.",
        badge: "Classic"
    },
    {
        id: 5,
        name: "Tommy Hilfiger",
        brand: "Tommy Hilfiger",
        price: 2500,
        category: "Analogue",
        image: "images/5.jpg",
        description: "Professional diving watch with exceptional reliability and precision.",
        badge: "Popular"
    },
    {
        id: 6,
        name: "Patek Philippe Geneve",
        brand: "Patek Philippe",
        price: 5000,
        category: "luxury",
        image: "images/6.jpg",
        description: "Ultra-luxury timepiece with exceptional craftsmanship and heritage.",
        badge: "Premium"
    },
    {
        id: 7,
        name: "Hublot Big Bang Sang Bleu",
        brand: "Hublot",
        price: 2000,
        category: "luxury",
        image: "images/10.jpg",
        description: "Bold design and advanced materials, a fusion of art and watchmaking.",
        badge: "New Arrival"
    },
    {
        id: 8,
        name: "TISSOT PRX",
        brand: "TISSOT",
        price: 4500,
        category: "classic",
        image: "images/7.jpg",
        description: "Ultimate toughness and innovative features for the adventurous.",
        badge: "Durable"
    },
    {
        id: 9,
        name: "MICHAEL KORS Darci Mini",
        brand: "MICHAEL KORS",
        price: 2700,
        category: "classic",
        image: "images/8.jpg",
        description: "Elegant and timeless, reflecting traditional Swiss watchmaking.",
        badge: "Timeless"
    },
    {
        id: 10,
        name: "Citizen tsuyosa",
        brand: "Citizen",
        price: 3000,
        category: "smart",
        image: "images/9.jpg",
        description: "Expressive and vibrant, a fun statement for any wrist.",
        badge: "Fun"
    },
    {
        id: 11,
        name: "Daniel Wellington",
        brand: "Daniel Wellington",
        price: 3000,
        category: "smart",
        image: "images/12.jpg",
        description: "Expressive and vibrant, a fun statement for any wrist.",
        badge: "Fun"
    },
    {
        id: 12,
        name: "G-SHOCK GM-2100",
        brand: "G-SHOCK",
        price: 2000,
        category: "sports",
        image: "images/13.jpg",
        description: "Expressive and vibrant, a fun statement for any wrist.",
        badge: "Fun"
    },
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    products = sampleProducts;
    updateCartCount();
    loadFeaturedProducts();
    setupEventListeners();
    setupMobileMenu();
}

// Setup event listeners
function setupEventListeners() {
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => performSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }

    // Cart button
    const cartButton = document.querySelector('.btn-cart');
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
}

// Mobile menu functionality
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Load featured products
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;

    // Show loading
    featuredContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    // Simulate loading delay
    setTimeout(() => {
        const featuredProducts = products.slice(0, 4); // Show first 4 products
        displayProducts(featuredProducts, featuredContainer);
    }, 500);
}

// Display products in a container
function displayProducts(productsToShow, container) {
    if (!container) return;

    container.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
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

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showMessage('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showMessage('Product removed from cart!', 'success');
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Wishlist functionality
function addToWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    const existingItem = wishlist.find(item => item.id === productId);
    
    if (!existingItem) {
        wishlist.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showMessage('Added to wishlist!', 'success');
    } else {
        showMessage('Already in wishlist!', 'error');
    }
}

// Search functionality
function performSearch(query) {
    if (!query.trim()) return;

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    // Store search results and redirect to products page
    sessionStorage.setItem('searchResults', JSON.stringify(filteredProducts));
    sessionStorage.setItem('searchQuery', query);
    window.location.href = 'products.html';
}

// Newsletter subscription
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Here you would typically send this to your PHP backend
    console.log('Newsletter subscription:', email);
    
    // Simulate API call
    setTimeout(() => {
        showMessage('Thank you for subscribing to our newsletter!', 'success');
        e.target.reset();
    }, 1000);
}

// Utility functions
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

function formatPrice(price) {
    return `₹${price.toLocaleString()}`;
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Product modal functionality
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="product-modal-content">
            <span class="product-modal-close" onclick="closeProductModal()">&times;</span>
            <div class="product-modal-grid">
                <div class="product-modal-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-modal-info">
                    <h2>${product.name}</h2>
                    <p class="product-brand">${product.brand}</p>
                    <div class="product-modal-price">${formatPrice(product.price)}</div>
                    <p class="product-modal-description">${product.description}</p>
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <button onclick="updateModalQuantity(${product.id}, -1)">-</button>
                        <input type="number" value="1" min="1" id="modal-quantity-${product.id}">
                        <button onclick="updateModalQuantity(${product.id}, 1)">+</button>
                    </div>
                    <div class="product-modal-actions">
                        <button class="btn-add-cart" onclick="addToCartFromModal(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn-wishlist" onclick="addToWishlist(${product.id})">
                            <i class="fas fa-heart"></i> Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closeProductModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.remove();
    }
}

function updateModalQuantity(productId, change) {
    const input = document.getElementById(`modal-quantity-${productId}`);
    if (input) {
        const newValue = Math.max(1, parseInt(input.value) + change);
        input.value = newValue;
    }
}

function addToCartFromModal(productId) {
    const input = document.getElementById(`modal-quantity-${productId}`);
    const quantity = input ? parseInt(input.value) : 1;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart();
    updateCartCount();
    closeProductModal();
    showMessage('Product added to cart!', 'success');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.querySelector('.product-modal');
    if (modal && e.target === modal) {
        closeProductModal();
    }
});

// Export functions for use in other pages
window.TimeCraft = {
    addToCart,
    removeFromCart,
    updateQuantity,
    addToWishlist,
    showProductModal,
    closeProductModal,
    formatPrice,
    calculateTotal,
    cart,
    products
}; 