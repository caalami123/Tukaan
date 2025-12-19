// Orders page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    initOrderTabs();
    initOrderDetails();
});

// Load user orders
function loadOrders(filter = 'all') {
    const ordersList = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    
    // Filter orders if needed
    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(order => order.status === filter);
    }
    
    // Check if empty
    if (filteredOrders.length === 0) {
        ordersList.style.display = 'none';
        emptyOrders.style.display = 'block';
        return;
    }
    
    ordersList.style.display = 'flex';
    emptyOrders.style.display = 'none';
    ordersList.innerHTML = '';
    
    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render orders
    filteredOrders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersList.appendChild(orderCard);
    });
}

// Create order card element
function createOrderCard(order) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.dataset.orderId = order.id;
    
    // Format date
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Get status display
    const statusDisplay = getStatusDisplay(order.status);
    
    // Calculate total
    const total = order.orderSummary ? parseFloat(order.orderSummary.total) : 0;
    
    orderCard.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-id">Order #${order.id}</div>
                <div class="order-date">Placed on ${formattedDate}</div>
            </div>
            <div class="order-status ${statusDisplay.class}">${statusDisplay.text}</div>
        </div>
        
        <div class="order-items">
            ${getOrderItemsHTML(order)}
        </div>
        
        <div class="order-footer">
            <div class="order-total">Total: $${total.toFixed(2)}</div>
            <div class="order-actions">
                <button class="btn-small view-order" data-order-id="${order.id}">
                    View Details
                </button>
                ${order.status === 'delivered' ? 
                  '<button class="btn-small btn-outline">Reorder</button>' : ''}
            </div>
        </div>
    `;
    
    return orderCard;
}

// Get order items HTML
function getOrderItemsHTML(order) {
    if (!order.orderSummary || !order.orderSummary.items) return '';
    
    let itemsHTML = '';
    const items = order.orderSummary.items.slice(0, 3); // Show first 3 items
    
    items.forEach(item => {
        itemsHTML += `
            <div class="order-item">
                <img src="${item.product.image}" alt="${item.product.name}">
                <div>
                    <div><strong>${item.product.name}</strong></div>
                    <div>Quantity: ${item.quantity}</div>
                    <div>Price: $${item.product.price}</div>
                </div>
            </div>
        `;
    });
    
    // Show more items count if applicable
    if (order.orderSummary.items.length > 3) {
        itemsHTML += `
            <div style="text-align: center; padding: 10px;">
                + ${order.orderSummary.items.length - 3} more items
            </div>
        `;
    }
    
    return itemsHTML;
}

// Get status display information
function getStatusDisplay(status) {
    const statusMap = {
        'processing': { text: 'Processing', class: 'status-processing' },
        'shipped': { text: 'Shipped', class: 'status-shipped' },
        'delivered': { text: 'Delivered', class: 'status-delivered' },
        'cancelled': { text: 'Cancelled', class: 'status-cancelled' }
    };
    
    return statusMap[status] || { text: 'Processing', class: 'status-processing' };
}

// Initialize order tabs
function initOrderTabs() {
    const tabs = document.querySelectorAll('.orders-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Load orders with filter
            const filter = this.dataset.filter;
            loadOrders(filter);
        });
    });
}

// Initialize order details
function initOrderDetails() {
    // Use event delegation for view order buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-order') || 
            e.target.closest('.view-order')) {
            const button = e.target.classList.contains('view-order') ? 
                          e.target : e.target.closest('.view-order');
            const orderId = button.dataset.orderId;
            
            showOrderDetails(orderId);
        }
    });
}

// Show order details modal
function showOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');
    
    // Format date
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Get status display
    const statusDisplay = getStatusDisplay(order.status);
    
    // Calculate totals
    const subtotal = order.orderSummary ? parseFloat(order.orderSummary.subtotal) : 0;
    const shipping = order.orderSummary ? parseFloat(order.orderSummary.shipping) : 0;
    const tax = order.orderSummary ? parseFloat(order.orderSummary.tax) : 0;
    const discount = order.orderSummary ? parseFloat(order.orderSummary.discount || 0) : 0;
    const total = order.orderSummary ? parseFloat(order.orderSummary.total) : 0;
    
    // Build content
    content.innerHTML = `
        <div class="order-details">
            <div class="details-header">
                <h3>Order #${order.id}</h3>
                <div class="order-status ${statusDisplay.class}">${statusDisplay.text}</div>
            </div>
            
            <div class="details-info">
                <p><strong>Order Date:</strong> ${formattedDate}</p>
                <p><strong>Order Status:</strong> ${statusDisplay.text}</p>
            </div>
            
            <!-- Tracking Progress -->
            ${order.status !== 'cancelled' ? `
            <div class="tracking-section">
                <h4>Order Tracking</h4>
                <div class="tracking-progress">
                    ${getTrackingProgress(order.status)}
                </div>
            </div>
            ` : ''}
            
            <!-- Shipping Information -->
            <div class="shipping-section">
                <h4>Shipping Information</h4>
                ${order.shippingInfo ? `
                <div class="shipping-info">
                    <p><strong>${order.shippingInfo.fullName}</strong></p>
                    <p>${order.shippingInfo.address}</p>
                    <p>${order.shippingInfo.city}, ${order.shippingInfo.zip}</p>
                    <p>${order.shippingInfo.country}</p>
                    <p>Phone: ${order.shippingInfo.phone}</p>
                    <p>Email: ${order.shippingInfo.email}</p>
                </div>
                ` : ''}
            </div>
            
            <!-- Payment Information -->
            <div class="payment-section">
                <h4>Payment Information</h4>
                ${order.paymentInfo ? `
                <div class="payment-info">
                    <p><strong>Payment Method:</strong> ${getPaymentMethodText(order.paymentInfo.method)}</p>
                    ${getPaymentDetailsHTML(order.paymentInfo)}
                </div>
                ` : ''}
            </div>
            
            <!-- Order Items -->
            <div class="items-section">
                <h4>Order Items</h4>
                <div class="items-list">
                    ${getFullOrderItemsHTML(order)}
                </div>
            </div>
            
            <!-- Order Summary -->
            <div class="summary-section">
                <h4>Order Summary</h4>
                <div class="summary-details">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    ${discount > 0 ? `
                    <div class="summary-row">
                        <span>Discount:</span>
                        <span style="color: #27ae60;">-$${discount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span>$${shipping.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax:</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Order Actions -->
            <div class="actions-section">
                ${order.status === 'processing' ? 
                  '<button class="btn btn-outline cancel-order" data-order-id="' + order.id + '">Cancel Order</button>' : ''}
                ${order.status === 'delivered' ? 
                  '<button class="btn">Download Invoice</button>' : ''}
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Cancel order button
    const cancelBtn = content.querySelector('.cancel-order');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel this order?')) {
                cancelOrder(order.id);
                modal.style.display = 'none';
                loadOrders(); // Reload orders
            }
        });
    }
}

// Get tracking progress HTML
function getTrackingProgress(status) {
    const steps = [
        { id: 'ordered', label: 'Ordered', icon: 'fas fa-shopping-cart' },
        { id: 'processing', label: 'Processing', icon: 'fas fa-cog' },
        { id: 'shipped', label: 'Shipped', icon: 'fas fa-shipping-fast' },
        { id: 'delivered', label: 'Delivered', icon: 'fas fa-check-circle' }
    ];
    
    let progressHTML = '';
    const statusIndex = steps.findIndex(step => step.id === status);
    
    steps.forEach((step, index) => {
        const isActive = index <= statusIndex;
        progressHTML += `
            <div class="tracking-step ${isActive ? 'active' : ''}">
                <div class="step-icon">
                    <i class="${step.icon}"></i>
                </div>
                <div class="step-label">${step.label}</div>
            </div>
        `;
    });
    
    return progressHTML;
}

// Get payment method text
function getPaymentMethodText(method) {
    const methodMap = {
        'card': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'mobile': 'Mobile Payment',
        'cod': 'Cash on Delivery'
    };
    
    return methodMap[method] || method;
}

// Get payment details HTML
function getPaymentDetailsHTML(paymentInfo) {
    if (!paymentInfo.details) return '';
    
    if (paymentInfo.method === 'card') {
        return `
            <p><strong>Card:</strong> ${paymentInfo.details.cardNumber || ''}</p>
            <p><strong>Expires:</strong> ${paymentInfo.details.expiryDate || ''}</p>
            <p><strong>Name:</strong> ${paymentInfo.details.cardName || ''}</p>
        `;
    } else if (paymentInfo.method === 'mobile') {
        return `
            <p><strong>Operator:</strong> ${paymentInfo.details.operator || ''}</p>
            <p><strong>Number:</strong> ${paymentInfo.details.number || ''}</p>
        `;
    }
    
    return '';
}

// Get full order items HTML
function getFullOrderItemsHTML(order) {
    if (!order.orderSummary || !order.orderSummary.items) return '';
    
    let itemsHTML = '';
    
    order.orderSummary.items.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        itemsHTML += `
            <div class="item-row">
                <div class="item-info">
                    <img src="${item.product.image}" alt="${item.product.name}" width="50">
                    <div>
                        <strong>${item.product.name}</strong>
                        <div>Quantity: ${item.quantity}</div>
                    </div>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    return itemsHTML;
}

// Cancel order
function cancelOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'cancelled';
        localStorage.setItem('userOrders', JSON.stringify(orders));
        
        showNotification('Order cancelled successfully', 'success');
    }
}

// Add orders page styles
const ordersStyles = `
.order-details {
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 10px;
}

.order-details > div {
    margin-bottom: 25px;
    padding-bottom: 25px;
    border-bottom: 1px solid #eee;
}

.details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.details-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.tracking-section {
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
}

.tracking-section h4 {
    margin-bottom: 20px;
}

.shipping-info, .payment-info {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
}

.items-list {
    margin-top: 15px;
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 10px;
}

.item-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.summary-details {
    max-width: 300px;
    margin-left: auto;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.summary-row.total {
    font-size: 18px;
    font-weight: bold;
    padding-top: 10px;
    border-top: 2px solid #eee;
}

.actions-section {
    display: flex;
    gap: 15px;
    justify-content: center;
}
`;

// Add styles if not already added
if (!document.querySelector('#orders-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'orders-styles';
    styleElement.textContent = ordersStyles;
    document.head.appendChild(styleElement);
                  }
