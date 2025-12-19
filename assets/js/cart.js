// Cart page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    initCartControls();
    initCheckoutButton();
    loadCartRecommendations();
});

// Load cart items
function loadCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartElement = document.getElementById('empty-cart');
    
    if (marketplaceData.cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (emptyCartElement) emptyCartElement.style.display = 'block';
        updateCartSummary(0);
        return;
    }
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        marketplaceData.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.product.image}" alt="${item.product.name}">
                </div>
                <div class="item-details">
                    <h3><a href="product.html?id=${item.product.id}">${item.product.name}</a></h3>
                    <p class="item-store">Sweet Shop</p>
                    <div class="item-price">${formatPrice(item.product.price)}</div>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn minus-btn">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="99" 
                           data-product-id="${item.product.id}">
                    <button class="qty-btn plus-btn">+</button>
                </div>
                <div class="item-total">${formatPrice(item.product.price * item.quantity)}</div>
                <button class="item-remove" data-product-id="${item.product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        updateCartSummary();
    }
}

// Initialize cart controls
function initCartControls() {
    // Quantity controls
    document.addEventListener('click', function(e) {
        // Plus button
        if (e.target.classList.contains('plus-btn') || 
            e.target.closest('.plus-btn')) {
            const button = e.target.classList.contains('plus-btn') ? 
                          e.target : e.target.closest('.plus-btn');
            const input = button.previousElementSibling;
            const currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            updateCartItem(input);
        }
        
        // Minus button
        if (e.target.classList.contains('minus-btn') || 
            e.target.closest('.minus-btn')) {
            const button = e.target.classList.contains('minus-btn') ? 
                          e.target : e.target.closest('.minus-btn');
            const input = button.nextElementSibling;
            const currentValue = parseInt(input.value);
            
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateCartItem(input);
            }
        }
        
        // Remove item
        if (e.target.classList.contains('item-remove') || 
            e.target.closest('.item-remove')) {
            const button = e.target.classList.contains('item-remove') ? 
                          e.target : e.target.closest('.item-remove');
            const productId = parseInt(button.getAttribute('data-product-id'));
            
            if (confirm('Are you sure you want to remove this item from cart?')) {
                removeFromCart(productId);
                loadCartItems();
                showNotification('Item removed from cart', 'success');
            }
        }
    });
    
    // Input change
    document.addEventListener('change', function(e) {
        if (e.target.type === 'number' && e.target.closest('.item-quantity')) {
            updateCartItem(e.target);
        }
    });
}

// Update cart item
function updateCartItem(input) {
    const productId = parseInt(input.getAttribute('data-product-id'));
    const quantity = parseInt(input.value);
    
    if (quantity < 1) {
        input.value = 1;
        return;
    }
    
    updateCartQuantity(productId, quantity);
    updateItemTotal(input, productId, quantity);
    updateCartSummary();
}

// Update item total
function updateItemTotal(input, productId, quantity) {
    const cartItem = input.closest('.cart-item');
    const product = marketplaceData.products.find(p => p.id === productId);
    
    if (cartItem && product) {
        const totalElement = cartItem.querySelector('.item-total');
        totalElement.textContent = formatPrice(product.price * quantity);
    }
}

// Update cart summary
function updateCartSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 2.00 : 0;
    const serviceFee = subtotal > 0 ? 1.00 : 0;
    const total = subtotal + shipping + serviceFee;
    
    // Update summary elements
    const subtotalElement = document.querySelector('.summary-row:nth-child(1) span:last-child');
    const shippingElement = document.querySelector('.summary-row:nth-child(2) span:last-child');
    const totalElement = document.querySelector('.summary-row.total span:last-child');
    
    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (shippingElement) shippingElement.textContent = formatPrice(shipping);
    if (totalElement) totalElement.textContent = formatPrice(total);
}

// Initialize checkout button
function initCheckoutButton() {
    const checkoutBtn = document.querySelector('.btn[href="checkout.html"]');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            if (marketplaceData.cart.length === 0) {
                e.preventDefault();
                alert('Add items to cart first');
                return;
            }
            
            // Save cart for checkout
            localStorage.setItem('checkoutCart', JSON.stringify(marketplaceData.cart));
            
            // Redirect to checkout (in real app)
            // For demo, just show message
            if (!document.querySelector('a[href="checkout.html"]')) {
                e.preventDefault();
                showNotification('Proceeding to checkout...', 'info');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }
}

// Load cart recommendations
function loadCartRecommendations() {
    const recommendationsContainer = document.getElementById('cart-recommendations');
    
    if (recommendationsContainer && marketplaceData.cart.length > 0) {
        // Get categories from cart items
        const cartCategories = marketplaceData.cart.map(item => {
            const product = marketplaceData.products.find(p => p.id === item.productId);
            return product ? product.category : null;
        }).filter(Boolean);
        
        // Get products from same categories (excluding those already in cart)
        const recommendedProducts = marketplaceData.products.filter(product => {
            return cartCategories.includes(product.category) && 
                   !marketplaceData.cart.some(item => item.productId === product.id);
        }).slice(0, 4);
        
        if (recommendedProducts.length > 0) {
            renderProducts(recommendedProducts, recommendationsContainer);
        } else {
            // Fallback to featured products
            const featuredProducts = getFeaturedProducts(4);
            renderProducts(featuredProducts, recommendationsContainer);
        }
    }
}

// Clear cart
function clearCart() {
    marketplaceData.cart = [];
    saveCart();
    updateCartCount();
    loadCartItems();
            }
