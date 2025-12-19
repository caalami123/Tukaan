// Stores page functionality
document.addEventListener('DOMContentLoaded', function() {
    initStoreFilters();
    initStoreSearch();
    loadStores();
});

// Initialize store filters
function initStoreFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyStoreFilters();
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            resetStoreFilters();
            loadStores();
        });
    }
}

// Initialize store search
function initStoreSearch() {
    const storeSearchInput = document.getElementById('store-search');
    const storeSearchBtn = storeSearchInput?.nextElementSibling;
    
    if (storeSearchBtn) {
        storeSearchBtn.addEventListener('click', function() {
            searchStoresHandler();
        });
    }
    
    if (storeSearchInput) {
        storeSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchStoresHandler();
            }
        });
    }
}

// Apply store filters
function applyStoreFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const ratingFilter = document.getElementById('rating-filter');
    
    let filteredStores = marketplaceData.stores;
    
    // Apply category filter
    if (categoryFilter.value) {
        filteredStores = filteredStores.filter(store => 
            store.category === categoryFilter.value
        );
    }
    
    // Apply location filter
    if (locationFilter.value) {
        filteredStores = filteredStores.filter(store => 
            store.location.toLowerCase() === locationFilter.value
        );
    }
    
    // Apply rating filter
    if (ratingFilter.value) {
        const minRating = parseFloat(ratingFilter.value);
        filteredStores = filteredStores.filter(store => 
            store.rating >= minRating
        );
    }
    
    renderStores(filteredStores);
}

// Reset store filters
function resetStoreFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const ratingFilter = document.getElementById('rating-filter');
    
    if (categoryFilter) categoryFilter.value = '';
    if (locationFilter) locationFilter.value = '';
    if (ratingFilter) ratingFilter.value = '';
}

// Search stores handler
function searchStoresHandler() {
    const searchInput = document.getElementById('store-search');
    const query = searchInput.value.trim();
    
    if (query) {
        const results = searchStores(query);
        renderStores(results);
    } else {
        loadStores();
    }
}

// Load all stores
function loadStores() {
    const storesContainer = document.getElementById('stores-container');
    if (!storesContainer) return;
    
    renderStores(marketplaceData.stores);
}

// Render stores to the container
function renderStores(stores) {
    const storesContainer = document.getElementById('stores-container');
    if (!storesContainer) return;
    
    storesContainer.innerHTML = '';
    
    if (stores.length === 0) {
        storesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-store-slash"></i>
                <h3>Dukaan lama helin</h3>
                <p>Iskuday doorasho kale ama raadinta</p>
            </div>
        `;
        return;
    }
    
    stores.forEach(store => {
        const storeCard = document.createElement('div');
        storeCard.className = 'store-card';
        storeCard.innerHTML = `
            <img src="${store.image}" alt="${store.name}">
            <div class="store-content">
                <h3>${store.name}</h3>
                <p class="store-description">${store.description}</p>
                
                <div class="store-meta">
                    <span class="store-location">
                        <i class="fas fa-map-marker-alt"></i> ${store.location}
                    </span>
                    <span class="store-rating">
                        <i class="fas fa-star"></i> ${store.rating.toFixed(1)}
                    </span>
                    <span class="store-products">
                        <i class="fas fa-box"></i> ${store.productsCount} alaab
                    </span>
                </div>
                
                <div class="store-actions">
                    <a href="store.html?id=${store.id}" class="btn btn-small">Arag Dukaan</a>
                    <button class="btn-outline btn-small follow-store" data-store-id="${store.id}">
                        <i class="fas fa-heart"></i> Raac
                    </button>
                </div>
            </div>
        `;
        
        storesContainer.appendChild(storeCard);
    });
    
    // Add event listeners to follow buttons
    storesContainer.querySelectorAll('.follow-store').forEach(button => {
        button.addEventListener('click', function() {
            const storeId = parseInt(this.getAttribute('data-store-id'));
            toggleFollowStore(storeId, this);
        });
    });
}

// Toggle follow store
function toggleFollowStore(storeId, button) {
    const store = marketplaceData.stores.find(s => s.id === storeId);
    if (!store) return;
    
    const icon = button.querySelector('i');
    const isFollowing = icon.classList.contains('fas');
    
    if (isFollowing) {
        icon.className = 'far fa-heart';
        button.innerHTML = '<i class="far fa-heart"></i> Raac';
        showNotification(`Ka baxay ${store.name}`);
    } else {
        icon.className = 'fas fa-heart';
        button.innerHTML = '<i class="fas fa-heart"></i> La Raacay';
        showNotification(`Raacay ${store.name}`);
    }
}

// Store pagination
function initStorePagination(stores, itemsPerPage = 12) {
    let currentPage = 1;
    const totalPages = Math.ceil(stores.length / itemsPerPage);
    
    function renderPage(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageStores = stores.slice(startIndex, endIndex);
        
        renderStores(pageStores);
        updatePaginationControls(page, totalPages);
    }
    
    function updatePaginationControls(currentPage, totalPages) {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = `
            <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                ← Hore
            </button>
            <span class="page-numbers">Bogga ${currentPage} / ${totalPages}</span>
            <button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                Xiga →
            </button>
        `;
        
        // Add event listeners
        paginationContainer.querySelector('.prev-btn').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });
        
        paginationContainer.querySelector('.next-btn').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
        });
    }
    
    // Initialize first page
    renderPage(currentPage);
}
