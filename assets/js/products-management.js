// Products management functionality
document.addEventListener('DOMContentLoaded', function() {
    loadVendorProducts();
    initTabs();
    initFilters();
    initSearch();
    initViewToggle();
    initBulkActions();
    initDeleteModal();
});

// Load vendor products
function loadVendorProducts(filter = 'all', sort = 'newest') {
    const productsGrid = document.getElementById('products-grid');
    const productsTableBody = document.getElementById('products-table-body');
    const emptyProducts = document.getElementById('empty-products');
    const pagination = document.getElementById('pagination');
    
    // Get vendor's products (storeId = 1 for demo)
    const vendorProducts = marketplaceData.products.filter(p => p.storeId === 1);
    
    // Apply filter
    let filteredProducts = vendorProducts;
    if (filter !== 'all') {
        filteredProducts = vendorProducts.filter(product => {
            if (filter === 'published') return product.status === 'published';
            if (filter === 'draft') return product.status === 'draft';
            if (filter === 'archived') return product.status === 'archived';
            if (filter === 'outofstock') return product.quantity === 0;
            return true;
        });
    }
    
    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, sort);
    
    // Check if empty
    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        document.getElementById('products-table').style.display = 'none';
        emptyProducts.style.display = 'block';
        pagination.style.display = 'none';
        return;
    }
    
    emptyProducts.style.display = 'none';
    
    // Display products based on current view
    const currentView = document.querySelector('.view-btn.active').dataset.view;
    
    if (currentView === 'grid') {
        displayProductsGrid(filteredProducts, productsGrid);
        productsGrid.style.display = 'grid';
        document.getElementById('products-table').style.display = 'none';
    } else {
        displayProductsTable(filteredProducts, productsTableBody);
        productsGrid.style.display = 'none';
        document.getElementById('products-table').style.display = 'block';
    }
    
    // Show pagination if needed
    if (filteredProducts.length > 10) {
        setupPagination(filteredProducts);
    } else {
        pagination.style.display = 'none';
    }
}

// Sort products
function sortProducts(products, sortType) {
    return [...products].sort((a, b) => {
        switch (sortType) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name-a':
                return a.name.localeCompare(b.name);
            case 'name-z':
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });
}

// Display products in grid view
function displayProductsGrid(products, container) {
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    
    const mainImage = product.images && product.images.length > 0 ? 
        product.images[0].url : 'https://via.placeholder.com/300x200';
    
    const stockClass = getStockClass(product.quantity);
    const statusClass = getStatusClass(product.status);
    const statusText = getStatusText(product.status);
    
    card.innerHTML = `
        <div class="product-card-image">
            <img src="${mainImage}" alt="${product.name}">
        </div>
        <div class="product-card-body">
            <div class="product-name">${product.name}</div>
            <div class="product-sku">SKU: ${product.sku}</div>
            <div style="margin: 10px 0;">
                <span class="${stockClass}">${product.quantity} in stock</span>
            </div>
            <div class="price-cell">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.comparePrice > product.price ? 
                  `<span class="original-price">$${product.comparePrice.toFixed(2)}</span>` : ''}
            </div>
        </div>
        <div class="product-card-footer">
            <span class="status-badge ${statusClass}">${statusText}</span>
            <div class="action-buttons">
                <button class="action-btn btn-view" onclick="viewProduct(${product.id})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn btn-edit" onclick="editProduct(${product.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="openDeleteModal(${product.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Display products in table view
function displayProductsTable(products, container) {
    container.innerHTML = '';
    
    products.forEach(product => {
        const row = createProductTableRow(product);
        container.appendChild(row);
    });
}

// Create product table row
function createProductTableRow(product) {
    const row = document.createElement('tr');
    row.dataset.productId = product.id;
    
    const mainImage = product.images && product.images.length > 0 ? 
        product.images[0].url : 'https://via.placeholder.com/60';
    
    const stockClass = getStockClass(product.quantity);
    const statusClass = getStatusClass(product.status);
    const statusText = getStatusText(product.status);
    
    row.innerHTML = `
        <td>
            <input type="checkbox" class="product-checkbox" value="${product.id}">
        </td>
        <td>
            <div class="product-cell">
                <img src="${mainImage}" alt="${product.name}" class="product-image">
                <div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-sku">SKU: ${product.sku}</div>
                </div>
            </div>
        </td>
        <td>${product.category}</td>
        <td class="price-cell">
            <span class="current-price">$${product.price.toFixed(2)}</span>
            ${product.comparePrice > product.price ? 
              `<br><span class="original-price">$${product.comparePrice.toFixed(2)}</span>` : ''}
        </td>
        <td class="stock-cell ${stockClass}">${product.quantity}</td>
        <td>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn btn-view" onclick="viewProduct(${product.id})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn btn-edit" onclick="editProduct(${product.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="openDeleteModal(${product.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Get stock class
function getStockClass(quantity) {
    if (quantity > 10) return 'in-stock';
    if (quantity > 0) return 'low-stock';
    return 'out-of-stock';
}

// Get status class
function getStatusClass(status) {
    switch (status) {
        case 'published': return 'status-published';
        case 'draft': return 'status-draft';
        case 'archived': return 'status-archived';
        default: return '';
    }
}

// Get status text
function getStatusText(status) {
    switch (status) {
        case 'published': return 'Published';
        case 'draft': return 'Draft';
        case 'archived': return 'Archived';
        default: return status;
    }
}

// Initialize tabs
function initTabs() {
    const tabs = document.querySelectorAll('.products-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Load products with filter
            const filter = this.dataset.filter;
            loadVendorProducts(filter);
        });
    });
}

// Initialize filters
function initFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-by');
    
    categoryFilter.addEventListener('change', function() {
        // Filter by category would be implemented here
        loadVendorProducts();
    });
    
    sortSelect.addEventListener('change', function() {
        const sort = this.value;
        const activeTab = document.querySelector('.products-tab.active');
        const filter = activeTab.dataset.filter;
        loadVendorProducts(filter, sort);
    });
}

// Initialize search
function initSearch() {
    const searchInput = document.getElementById('product-search');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchProducts(this.value);
        }, 500);
    });
}

// Search products
function searchProducts(query) {
    const vendorProducts = marketplaceData.products.filter(p => p.storeId === 1);
    
    if (!query.trim()) {
        const activeTab = document.querySelector('.products-tab.active');
        const filter = activeTab.dataset.filter;
        loadVendorProducts(filter);
        return;
    }
    
    const searchTerm = query.toLowerCase();
    const filteredProducts = vendorProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults(filteredProducts);
}

// Display search results
function displaySearchResults(products) {
    const currentView = document.querySelector('.view-btn.active').dataset.view;
    
    if (currentView === 'grid') {
        displayProductsGrid(products, document.getElementById('products-grid'));
    } else {
        displayProductsTable(products, document.getElementById('products-table-body'));
    }
    
    // Show empty state if no results
    const emptyProducts = document.getElementById('empty-products');
    if (products.length === 0) {
        emptyProducts.style.display = 'block';
    } else {
        emptyProducts.style.display = 'none';
    }
}

// Initialize view toggle
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Reload products with new view
            const activeTab = document.querySelector('.products-tab.active');
            const filter = activeTab.dataset.filter;
            loadVendorProducts(filter);
        });
    });
}

// Initialize bulk actions
function initBulkActions() {
    const selectAll = document.getElementById('select-all');
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    const applyBulkAction = document.getElementById('apply-bulk-action');
    const selectedCount = document.getElementById('selected-count');
    
    // Select all checkbox
    selectAll.addEventListener('change', function() {
        const isChecked = this.checked;
        document.querySelectorAll('.product-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        updateSelectedCount();
    });
    
    // Update count when individual checkboxes change
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('product-checkbox')) {
            updateSelectedCount();
            
            // Update select all checkbox
            const allCheckboxes = document.querySelectorAll('.product-checkbox');
            const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
            selectAll.checked = allChecked;
        }
    });
    
    // Apply bulk action
    applyBulkAction.addEventListener('click', function() {
        const action = document.getElementById('bulk-action').value;
        if (!action) {
            alert('Please select a bulk action');
            return;
        }
        
        const selectedIds = getSelectedProductIds();
        if (selectedIds.length === 0) {
            alert('Please select products');
            return;
        }
        
        applyBulkActionToProducts(action, selectedIds);
    });
}

// Update selected count
function updateSelectedCount() {
    const selectedCount = document.getElementById('selected-count');
    const selected = document.querySelectorAll('.product-checkbox:checked').length;
    selectedCount.textContent = `${selected} product${selected !== 1 ? 's' : ''} selected`;
}

// Get selected product IDs
function getSelectedProductIds() {
    const selectedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
    return Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));
}

// Apply bulk action to products
function applyBulkActionToProducts(action, productIds) {
    if (action === 'delete') {
        if (!confirm(`Are you sure you want to delete ${productIds.length} product(s)?`)) {
            return;
        }
    }
    
    productIds.forEach(productId => {
        const productIndex = marketplaceData.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            if (action === 'delete') {
                marketplaceData.products.splice(productIndex, 1);
            } else {
                marketplaceData.products[productIndex].status = action;
            }
        }
    });
    
    // Save to localStorage
    localStorage.setItem('marketplaceProducts', JSON.stringify(marketplaceData.products));
    
    // Reload products
    const activeTab = document.querySelector('.products-tab.active');
    const filter = activeTab.dataset.filter;
    loadVendorProducts(filter);
    
    // Show success message
    showNotification(`${productIds.length} product(s) updated successfully`, 'success');
}

// Initialize delete modal
function initDeleteModal() {
    const deleteModal = document.getElementById('delete-modal');
    const cancelDelete = document.getElementById('cancel-delete');
    const confirmDelete = document.getElementById('confirm-delete');
    
    cancelDelete.addEventListener('click', function() {
        deleteModal.style.display = 'none';
    });
    
    deleteModal.querySelector('.modal-close').addEventListener('click', function() {
        deleteModal.style.display = 'none';
    });
    
    // Close on outside click
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
}

// Open delete modal
let productToDelete = null;

function openDeleteModal(productId) {
    productToDelete = productId;
    const deleteModal = document.getElementById('delete-modal');
    deleteModal.style.display = 'flex';
    
    // Set up confirm delete
    const confirmDelete = document.getElementById('confirm-delete');
    confirmDelete.onclick = function() {
        deleteProduct(productToDelete);
        deleteModal.style.display = 'none';
    };
}

// Delete product
function deleteProduct(productId) {
    const productIndex = marketplaceData.products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        marketplaceData.products.splice(productIndex, 1);
        
        // Save to localStorage
        localStorage.setItem('marketplaceProducts', JSON.stringify(marketplaceData.products));
        
        // Reload products
        const activeTab = document.querySelector('.products-tab.active');
        const filter = activeTab.dataset.filter;
        loadVendorProducts(filter);
        
        showNotification('Product deleted successfully', 'success');
    }
}

// View product
function viewProduct(productId) {
    const product = marketplaceData.products.find(p => p.id === productId);
    if (product) {
        // Open product in new tab or show preview
        window.open(`../product.html?id=${productId}`, '_blank');
    }
}

// Edit product
function editProduct(productId) {
    // Redirect to edit page with product ID
    window.location.href = `edit-product.html?id=${productId}`;
}

// Setup pagination
function setupPagination(products) {
    const pagination = document.getElementById('pagination');
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    let currentPage = 1;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    
    pagination.style.display = 'flex';
    updatePageInfo();
    
    function updatePageInfo() {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }
    
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePageInfo();
            displayCurrentPage();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePageInfo();
            displayCurrentPage();
        }
    });
    
    function displayCurrentPage() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageProducts = products.slice(startIndex, endIndex);
        
        const currentView = document.querySelector('.view-btn.active').dataset.view;
        if (currentView === 'grid') {
            displayProductsGrid(pageProducts, document.getElementById('products-grid'));
        } else {
            displayProductsTable(pageProducts, document.getElementById('products-table-body'));
        }
    }
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
const notificationStyles = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

// Add styles if not already added
if (!document.querySelector('#products-management-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'products-management-styles';
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);
}
