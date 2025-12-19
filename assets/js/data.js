// Sample data for the marketplace
const marketplaceData = {
    // Products data
    products: [
        {
            id: 1,
            name: "Canjeero Somaliyeed",
            description: "Canjeero Somaliyeed oo asaliga ah",
            price: 5.99,
            originalPrice: 7.99,
            image: "https://via.placeholder.com/300x200",
            category: "food",
            storeId: 1,
            rating: 4.5,
            reviews: 24,
            stock: 10
        },
        {
            id: 2,
            name: "Macawiis",
            description: "Macawiis cas ah oo cajiib ah",
            price: 12.99,
            image: "https://via.placeholder.com/300x200",
            category: "clothing",
            storeId: 2,
            rating: 4.2,
            reviews: 18,
            stock: 25
        },
        {
            id: 3,
            name: "Gambaro",
            description: "Gambaro casri ah oo smartphone ah",
            price: 299.99,
            image: "https://via.placeholder.com/300x200",
            category: "electronics",
            storeId: 3,
            rating: 4.8,
            reviews: 45,
            stock: 5
        }
    ],
    
    // Stores data
    stores: [
        {
            id: 1,
            name: "Dukaan Macaan",
            description: "Cuntada Somaliyeed ee asaliga ah",
            location: "Muqdisho",
            rating: 4.7,
            productsCount: 15,
            category: "food",
            image: "https://via.placeholder.com/300x200"
        },
        {
            id: 2,
            name: "Bazaar Clothing",
            description: "Dharka Somaliyeed ee ugu fiican",
            location: "Hargeysa",
            rating: 4.5,
            productsCount: 42,
            category: "clothing",
            image: "https://via.placeholder.com/300x200"
        },
        {
            id: 3,
            name: "Somali Tech",
            description: "Qalabka elektarooniga ah",
            location: "Kismaayo",
            rating: 4.9,
            productsCount: 28,
            category: "electronics",
            image: "https://via.placeholder.com/300x200"
        }
    ],
    
    // Categories data
    categories: [
        { id: 1, name: "Dharka", icon: "fa-tshirt", count: 156 },
        { id: 2, name: "Cuntada", icon: "fa-utensils", count: 89 },
        { id: 3, name: "Tiknooloji", icon: "fa-laptop", count: 72 },
        { id: 4, name: "Qalabka Guriga", icon: "fa-home", count: 103 },
        { id: 5, name: "Jirrada", icon: "fa-heart", count: 64 },
        { id: 6, name: "Gaadiidka", icon: "fa-car", count: 31 }
    ],
    
    // Cart data
    cart: [],
    
    // User data
    currentUser: null
};

// Initialize cart from localStorage
function initializeCart() {
    const savedCart = localStorage.getItem('marketplaceCart');
    if (savedCart) {
        marketplaceData.cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('marketplaceCart', JSON.stringify(marketplaceData.cart));
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    const product = marketplaceData.products.find(p => p.id === productId);
    if (!product) return false;
    
    const cartItem = marketplaceData.cart.find(item => item.productId === productId);
    
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        marketplaceData.cart.push({
            productId: productId,
            product: product,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    updateCartCount();
    return true;
}

// Remove product from cart
function removeFromCart(productId) {
    marketplaceData.cart = marketplaceData.cart.filter(item => item.productId !== productId);
    saveCart();
    updateCartCount();
}

// Update cart item quantity
function updateCartQuantity(productId, quantity) {
    const cartItem = marketplaceData.cart.find(item => item.productId === productId);
    if (cartItem) {
        cartItem.quantity = quantity;
        saveCart();
        updateCartCount();
    }
}

// Get cart total
function getCartTotal() {
    return marketplaceData.cart.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = marketplaceData.cart.reduce((count, item) => count + item.quantity, 0);
    const cartElements = document.querySelectorAll('.cart-count');
    
    cartElements.forEach(element => {
        if (cartCount > 0) {
            element.textContent = cartCount;
            element.style.display = 'inline';
        } else {
            element.style.display = 'none';
        }
    });
}

// Filter products by category
function filterProducts(category) {
    if (!category) return marketplaceData.products;
    return marketplaceData.products.filter(product => product.category === category);
}

// Filter stores by category
function filterStores(category) {
    if (!category) return marketplaceData.stores;
    return marketplaceData.stores.filter(store => store.category === category);
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return marketplaceData.products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
}

// Search stores
function searchStores(query) {
    const searchTerm = query.toLowerCase();
    return marketplaceData.stores.filter(store => 
        store.name.toLowerCase().includes(searchTerm) ||
        store.description.toLowerCase().includes(searchTerm)
    );
}

// Get featured products
function getFeaturedProducts(limit = 6) {
    return [...marketplaceData.products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Get featured stores
function getFeaturedStores(limit = 4) {
    return [...marketplaceData.stores]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Get related products
function getRelatedProducts(productId, limit = 4) {
    const product = marketplaceData.products.find(p => p.id === productId);
    if (!product) return [];
    
    return marketplaceData.products
        .filter(p => p.category === product.category && p.id !== productId)
        .slice(0, limit);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    updateCartCount();
});
