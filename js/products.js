// Products page functionality
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 8;

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
});

function initializeProductsPage() {
    // Check for search results from homepage
    const searchResults = sessionStorage.getItem('searchResults');
    const searchQuery = sessionStorage.getItem('searchQuery');
    
    if (searchResults) {
        filteredProducts = JSON.parse(searchResults);
        sessionStorage.removeItem('searchResults');
        sessionStorage.removeItem('searchQuery');
        
        // Update search input if there was a search query
        if (searchQuery) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = searchQuery;
            }
        }
    } else {
        // Check for category filter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            filteredProducts = products.filter(p => p.category === category);
            // Check the appropriate category filter
            const categoryCheckbox = document.querySelector(`input[value="${category}"]`);
            if (categoryCheckbox) {
                categoryCheckbox.checked = true;
            }
        } else {
            filteredProducts = [...products];
        }
    }
    
    displayProducts();
    setupPriceRange();
    setupSearch();
}

// Display products with pagination
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.getElementById('products-count');
    
    if (!productsGrid) return;
    
    // Update products count
    if (productsCount) {
        productsCount.textContent = filteredProducts.length;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button class="btn-primary" onclick="clearFilters()">Clear All Filters</button>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    // Display products
    productsGrid.innerHTML = productsToShow.map(product => `
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
    
    // Generate pagination
    generatePagination();
}

// Generate pagination controls
function generatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination-controls">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Previous
        </button>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">
            Next <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    paginationHTML += '</div>';
    pagination.innerHTML = paginationHTML;
}

// Navigate to specific page
function goToPage(page) {
    currentPage = page;
    displayProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Apply filters
function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
    const selectedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(cb => cb.value);
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || 30000;
    
    filteredProducts = products.filter(product => {
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }
        
        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
            return false;
        }
        
        // Price filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    displayProducts();
}

// Clear all filters
function clearFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('.category-filter, .brand-filter').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset price range
    document.getElementById('price-min').value = 0;
    document.getElementById('price-max').value = 30000;
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    
    // Reset sort
    document.getElementById('sort-select').value = 'default';
    
    // Reset products
    filteredProducts = [...products];
    currentPage = 1;
    displayProducts();
}

// Sort products
function sortProducts() {
    const sortBy = document.getElementById('sort-select').value;
    
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'brand':
                return a.brand.localeCompare(b.brand);
            default:
                return 0;
        }
    });
    
    currentPage = 1;
    displayProducts();
}

// Setup price range functionality
function setupPriceRange() {
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    const minInput = document.getElementById('min-price');
    const maxInput = document.getElementById('max-price');
    
    if (!minSlider || !maxSlider || !minInput || !maxInput) return;
    
    // Update inputs when sliders change
    minSlider.addEventListener('input', function() {
        minInput.value = this.value;
        if (parseInt(this.value) > parseInt(maxSlider.value)) {
            maxSlider.value = this.value;
            maxInput.value = this.value;
        }
    });
    
    maxSlider.addEventListener('input', function() {
        maxInput.value = this.value;
        if (parseInt(this.value) < parseInt(minSlider.value)) {
            minSlider.value = this.value;
            minInput.value = this.value;
        }
    });
    
    // Update sliders when inputs change
    minInput.addEventListener('input', function() {
        minSlider.value = this.value || 0;
    });
    
    maxInput.addEventListener('input', function() {
        maxSlider.value = this.value || 30000;
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-box button');
    
    if (!searchInput || !searchButton) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });
    
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

// Perform search
function performSearch(query) {
    if (!query.trim()) {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    currentPage = 1;
    displayProducts();
}

// Update cart display (for cart page integration)
function updateCartDisplay() {
    // This function will be implemented in cart.js
    console.log('Cart updated');
}

// Export functions for use in other scripts
window.ProductsPage = {
    applyFilters,
    clearFilters,
    sortProducts,
    performSearch,
    goToPage,
    filteredProducts
}; 