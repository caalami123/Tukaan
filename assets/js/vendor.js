// Vendor dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    initVendorDashboard();
    initVendorProducts();
    initVendorOrders();
});

// Initialize vendor dashboard
function initVendorDashboard() {
    // Dashboard navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Add product modal
    const addProductBtn = document.getElementById('add-product');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            showAddProductModal();
        });
    }
}

// Initialize vendor products
function initVendorProducts() {
    // Load vendor's products
    const productsTable = document.querySelector('.products-table');
    if (productsTable) {
        // In real app, fetch vendor's products from API
        const vendorProducts = marketplaceData.products.filter(p => p.storeId === 1);
        renderVendorProducts(vendorProducts, productsTable);
    }
}

// Render vendor products
function renderVendorProducts(products, container) {
    container.innerHTML = `
        <table class="vendor-products-table">
            <thead>
                <tr>
                    <th>Alaab</th>
                    <th>Qiime</th>
                    <th>Hadhe</th>
                    <th>Qiimaynta</th>
                    <th>Hawlaha</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>
                            <div class="product-cell">
                                <img src="${product.image}" alt="${product.name}" width="50">
                                <div>
                                    <strong>${product.name}</strong>
                                    <p>${product.description.substring(0, 50)}...</p>
                                </div>
                            </div>
                        </td>
                        <td>$${product.price.toFixed(2)}</td>
                        <td>${product.stock}</td>
                        <td>
                            <div class="rating-display">
                                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                                <span>(${product.reviews})</span>
                            </div>
                        </td>
                        <td>
                            <button class="btn-small edit-product" data-id="${product.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-small btn-danger delete-product" data-id="${product.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Add event listeners to action buttons
    container.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    container.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

// Show add product modal
function showAddProductModal() {
    const modalHTML = `
        <div class="modal" id="add-product-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Ku Dar Alaab Cusub</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="new-product-form">
                        <div class="form-group">
                            <label>Magaca Alaabta</label>
                            <input type="text" id="product-name" required>
                        </div>
                        <div class="form-group">
                            <label>Sharaxaad</label>
                            <textarea id="product-description" rows="3" required></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Qiime ($)</label>
                                <input type="number" id="product-price" step="0.01" required>
                            </div>
                            <div class="form-group">
                                <label>Hadhe</label>
                                <input type="number" id="product-stock" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Nooca</label>
                            <select id="product-category">
                                <option value="food">Cuntada</option>
                                <option value="clothing">Dharka</option>
                                <option value="electronics">Tiknooloji</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>URL Sawirka</label>
                            <input type="url" id="product-image" 
                                   value="https://via.placeholder.com/300x200">
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn-outline modal-cancel">Jooji</button>
                            <button type="submit" class="btn">Ku Dar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('add-product-modal');
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.querySelector('.modal-cancel').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle form submission
    modal.querySelector('#new-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newProduct = {
            id: marketplaceData.products.length + 1,
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            originalPrice: parseFloat(document.getElementById('product-price').value) * 1.25,
            image: document.getElementById('product-image').value,
            category: document.getElementById('product-category').value,
            storeId: 1, // Current vendor's store
            rating: 0,
            reviews: 0,
            stock: parseInt(document.getElementById('product-stock').value)
        };
        
        // In real app, send to API
        marketplaceData.products.push(newProduct);
        
        showNotification('Alaabta cusub si guul leh ayaa loo daray');
        modal.remove();
        
        // Refresh products table
        const productsTable = document.querySelector('.products-table');
        if (productsTable) {
            const vendorProducts = marketplaceData.products.filter(p => p.storeId === 1);
            renderVendorProducts(vendorProducts, productsTable);
        }
    });
}

// Edit product
function editProduct(productId) {
    const product = marketplaceData.products.find(p => p.id === productId);
    if (!product) return;
    
    showAddProductModal();
    
    // Fill form with product data
    setTimeout(() => {
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-image').value = product.image;
        
        // Change modal title
        const modalHeader = document.querySelector('#add-product-modal .modal-header h2');
        if (modalHeader) modalHeader.textContent = 'Wax ka beddel Alaabta';
        
        // Change submit button
        const submitBtn = document.querySelector('#add-product-modal button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Kaydi Beddelka';
        
        // Update form submission
        const form = document.getElementById('new-product-form');
        const originalSubmit = form.onsubmit;
        
        form.onsubmit = function(e) {
            e.preventDefault();
            
            // Update product
            product.name = document.getElementById('product-name').value;
            product.description = document.getElementById('product-description').value;
            product.price = parseFloat(document.getElementById('product-price').value);
            product.stock = parseInt(document.getElementById('product-stock').value);
            product.category = document.getElementById('product-category').value;
            product.image = document.getElementById('product-image').value;
            
            showNotification('Alaabta si guul leh ayaa loo cusboonaysiiyay');
            
            const modal = document.getElementById('add-product-modal');
            if (modal) modal.remove();
            
            // Refresh products table
            const productsTable = document.querySelector('.products-table');
            if (productsTable) {
                const vendorProducts = marketplaceData.products.filter(p => p.storeId === 1);
                renderVendorProducts(vendorProducts, productsTable);
            }
        };
    }, 100);
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Ma hubtaa inaad tirtid alaabtan?')) {
        const index = marketplaceData.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            marketplaceData.products.splice(index, 1);
            showNotification('Alaabta si guul leh ayaa loo tirtiray', 'success');
            
            // Refresh products table
            const productsTable = document.querySelector('.products-table');
            if (productsTable) {
                const vendorProducts = marketplaceData.products.filter(p => p.storeId === 1);
                renderVendorProducts(vendorProducts, productsTable);
            }
        }
    }
}

// Initialize vendor orders
function initVendorOrders() {
    // In real app, fetch vendor's orders from API
    // For demo, using sample data
    const ordersTable = document.querySelector('.orders-table tbody');
    if (ordersTable) {
        const sampleOrders = [
            { id: 'ORD001', customer: 'Axmed Cali', date: '20 Oct 2024', total: 25.99, status: 'delivered' },
            { id: 'ORD002', customer: 'Cali Maxamed', date: '19 Oct 2024', total: 42.50, status: 'processing' },
            { id: 'ORD003', customer: 'Safia Xasan', date: '18 Oct 2024', total: 15.75, status: 'pending' }
        ];
        
        ordersTable.innerHTML = sampleOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>
                    <span class="status ${order.status}">
                        ${order.status === 'delivered' ? 'La keenay' : 
                          order.status === 'processing' ? 'Waa la sameeyayaa' : 
                          'La sugayo'}
                    </span>
                </td>
            </tr>
        `).join('');
    }
}

// Update order status
function updateOrderStatus(orderId, status) {
    // In real app, make API call
    showNotification('Xaaladda dalabka waa la cusboonaysiiyay');
}

// Vendor analytics
function loadVendorAnalytics() {
    // In real app, fetch analytics data from API
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        // Update stats with real data
    }
          }
