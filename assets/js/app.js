// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initMobileMenu();
    initTabs();
    initProductGrids();
    initForms();
    initImageGalleries();
});

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                navLinks.style.gap = '15px';
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.style.display = '';
            }
        });
    }
}

// Tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.tabs-header');
            
            // Remove active class from all buttons and contents
            tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const tabContents = tabContainer.nextElementSibling || 
                               tabContainer.parentElement.querySelectorAll('.tab-content');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            
            if (typeof tabContents.forEach === 'function') {
                tabContents.forEach(content => {
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            } else if (tabContents.id === tabId) {
                tabContents.classList.add('active');
            }
        });
    });
}

// Initialize product grids
function initProductGrids() {
    // Load featured products on home page
    const featuredProductsGrid = document.getElementById('featured-products');
    if (featuredProductsGrid) {
        const featuredProducts = getFeaturedProducts(6);
        renderProducts(featuredProducts, featuredProductsGrid);
    }
    
    // Load products in store page
    const storeProductsGrid = document.getElementById('store-products');
    if (storeProductsGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const storeId = parseInt(urlParams.get('id')) || 1;
        const storeProducts = marketplaceData.products.filter(p => p.storeId === storeId);
        renderProducts(storeProducts, storeProductsGrid);
    }
    
    // Load related products
    const relatedProductsGrid = document.getElementById('related-products');
    if (relatedProductsGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id')) || 1;
        const relatedProducts = getRelatedProducts(productId, 4);
        renderProducts(relatedProducts, relatedProductsGrid);
    }
}

// Render products to a grid
function renderProducts(products, container) {
    if (!container || !products) return;
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description.substring(0, 60)}...</p>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-small add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Ku Dar Gaadhiga
                </button>
            </div>
        `;
        
        container.appendChild(productCard);
    });
    
    // Add event listeners to add-to-cart buttons
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId, 1);
            
            // Show feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> La Ku Daray';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 2000);
        });
    });
}

// Form handling
function initForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Simple validation
            if (email && password) {
                // In a real app, this would make an API call
                alert('Successfully logged in!');
                window.location.href = 'index.html';
            } else {
                alert('Please fill in all fields');
            }
        });
    }
    
    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // In a real app, this would make an API call
            alert('Registration successful!');
            window.location.href = 'index.html';
        });
    }
    
    // Show/hide password
    const showPasswordButtons = document.querySelectorAll('.show-password');
    showPasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // Switch between login and register forms
    const authTabs = document.querySelectorAll('.auth-tab, .switch-to-login, .switch-to-register');
    authTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab') || 
                             (this.classList.contains('switch-to-login') ? 'login' : 'register');
            
            // Update tabs
            document.querySelectorAll('.auth-tab').forEach(t => {
                t.classList.toggle('active', t.getAttribute('data-tab') === targetTab);
            });
            
            // Update forms
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.toggle('active', form.id === `${targetTab}-form`);
            });
        });
    });
}

// Image gallery for product page
function initImageGalleries() {
    const thumbnails = document.querySelectorAll('.image-thumbnails img');
    const mainImage = document.getElementById('main-product-img');
    
    if (thumbnails.length && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update main image
                mainImage.src = this.src;
            });
        });
    }
}

// Product quantity controls
function initQuantityControls() {
    const quantityControls = document.querySelectorAll('.item-quantity');
    
    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('.qty-btn:first-child');
        const plusBtn = control.querySelector('.qty-btn:last-child');
        const input = control.querySelector('input');
        
        minusBtn.addEventListener('click', function() {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateCartItemQuantity(input);
            }
        });
        
        plusBtn.addEventListener('click', function() {
            const currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            updateCartItemQuantity(input);
        });
        
        input.addEventListener('change', function() {
            updateCartItemQuantity(this);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(input) {
    const cartItem = input.closest('.cart-item');
    const productId = parseInt(cartItem.querySelector('.add-to-cart')?.getAttribute('data-id'));
    
    if (productId) {
        updateCartQuantity(productId, parseInt(input.value));
        updateCartTotal();
    }
}

// Update cart total display
function updateCartTotal() {
    const cartTotalElement = document.querySelector('.cart-total');
    if (cartTotalElement) {
        const total = getCartTotal();
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);
