// Checkout page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutItems();
    initCheckoutSteps();
    initPaymentMethods();
    initCouponSystem();
    initPlaceOrder();
    formatCardInputs();
});

// Load cart items for checkout
function loadCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const cart = JSON.parse(localStorage.getItem('marketplaceCart')) || [];
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    checkoutItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <div class="checkout-item-image">
                <img src="${item.product.image}" alt="${item.product.name}" width="60">
            </div>
            <div class="checkout-item-details">
                <h4>${item.product.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="checkout-item-price">
                $${(item.product.price * item.quantity).toFixed(2)}
            </div>
        `;
        checkoutItemsContainer.appendChild(itemElement);
        
        subtotal += item.product.price * item.quantity;
    });
    
    // Update totals
    const shipping = 2.00;
    const tax = subtotal * 0.05; // 5% tax
    const serviceFee = 1.00;
    const total = subtotal + shipping + tax + serviceFee;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Save order summary for later
    const orderSummary = {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        serviceFee: serviceFee.toFixed(2),
        total: total.toFixed(2),
        items: cart
    };
    
    localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
}

// Initialize checkout steps
function initCheckoutSteps() {
    const continueToPayment = document.getElementById('continue-to-payment');
    const continueToReview = document.getElementById('continue-to-review');
    
    continueToPayment.addEventListener('click', function() {
        // Validate shipping form
        if (!validateShippingForm()) {
            alert('Please fill in all required shipping information');
            return;
        }
        
        // Save shipping info
        saveShippingInfo();
        
        // Show payment section
        document.getElementById('shipping-section').style.display = 'none';
        document.getElementById('payment-section').style.display = 'block';
        
        // Update progress
        updateProgress(2);
    });
    
    continueToReview.addEventListener('click', function() {
        // Validate payment form
        if (!validatePaymentForm()) {
            alert('Please complete payment information');
            return;
        }
        
        // Save payment info
        savePaymentInfo();
        
        // Load review details
        loadReviewDetails();
        
        // Show review section
        document.getElementById('payment-section').style.display = 'none';
        document.getElementById('review-section').style.display = 'block';
        
        // Update progress
        updateProgress(3);
    });
}

// Update progress steps
function updateProgress(step) {
    const steps = document.querySelectorAll('.progress-step');
    
    steps.forEach((stepElement, index) => {
        if (index < step) {
            stepElement.classList.add('active');
        } else {
            stepElement.classList.remove('active');
        }
    });
}

// Validate shipping form
function validateShippingForm() {
    const requiredFields = ['full-name', 'email', 'phone', 'address', 'city', 'country'];
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            return false;
        }
        field.style.borderColor = '';
    }
    
    // Validate email format
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Save shipping information
function saveShippingInfo() {
    const shippingInfo = {
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value
    };
    
    localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
}

// Initialize payment methods
function initPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const cardForm = document.getElementById('card-form');
    const mobileForm = document.getElementById('mobile-form');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            const selectedMethod = this.value;
            
            // Show/hide forms based on selection
            if (selectedMethod === 'card') {
                cardForm.style.display = 'block';
                mobileForm.style.display = 'none';
            } else if (selectedMethod === 'mobile') {
                cardForm.style.display = 'none';
                mobileForm.style.display = 'block';
            } else {
                cardForm.style.display = 'none';
                mobileForm.style.display = 'none';
            }
            
            // Update selected style
            document.querySelectorAll('.payment-method').forEach(el => {
                el.classList.remove('selected');
            });
            this.closest('.payment-method').classList.add('selected');
        });
    });
}

// Validate payment form
function validatePaymentForm() {
    const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (selectedMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('card-name').value;
        
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            alert('Please fill in all card details');
            return false;
        }
        
        // Validate card number (simple Luhn check)
        if (!validateCardNumber(cardNumber.replace(/\s/g, ''))) {
            alert('Please enter a valid card number');
            return false;
        }
        
        // Validate expiry date
        if (!validateExpiryDate(expiryDate)) {
            alert('Please enter a valid expiry date (MM/YY)');
            return false;
        }
        
    } else if (selectedMethod === 'mobile') {
        const mobileNumber = document.getElementById('mobile-number').value;
        const mobileOperator = document.getElementById('mobile-operator').value;
        
        if (!mobileNumber || !mobileOperator) {
            alert('Please fill in mobile payment details');
            return false;
        }
    }
    
    // Check terms agreement
    if (!document.getElementById('terms').checked) {
        alert('Please agree to the terms and conditions');
        return false;
    }
    
    return true;
}

// Validate card number using Luhn algorithm
function validateCardNumber(cardNumber) {
    if (!/^\d+$/.test(cardNumber)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Validate expiry date
function validateExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (parseInt(year) < currentYear) return false;
    if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
    
    return true;
}

// Save payment information
function savePaymentInfo() {
    const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
    
    let paymentInfo = {
        method: selectedMethod,
        details: {}
    };
    
    if (selectedMethod === 'card') {
        paymentInfo.details = {
            cardNumber: maskCardNumber(document.getElementById('card-number').value),
            expiryDate: document.getElementById('expiry-date').value,
            cardName: document.getElementById('card-name').value
        };
    } else if (selectedMethod === 'mobile') {
        paymentInfo.details = {
            operator: document.getElementById('mobile-operator').value,
            number: document.getElementById('mobile-number').value
        };
    }
    
    localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
}

// Mask card number for display
function maskCardNumber(cardNumber) {
    return cardNumber.replace(/\d(?=\d{4})/g, "*");
}

// Load review details
function loadReviewDetails() {
    const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo')) || {};
    const paymentInfo = JSON.parse(localStorage.getItem('paymentInfo')) || {};
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || {};
    
    // Shipping details
    const shippingDetails = document.getElementById('shipping-details');
    shippingDetails.innerHTML = `
        <p><strong>${shippingInfo.fullName}</strong></p>
        <p>${shippingInfo.address}</p>
        <p>${shippingInfo.city}, ${shippingInfo.zip}</p>
        <p>${shippingInfo.country}</p>
        <p>Phone: ${shippingInfo.phone}</p>
        <p>Email: ${shippingInfo.email}</p>
    `;
    
    // Payment details
    const paymentDetails = document.getElementById('payment-details');
    let paymentText = '';
    
    if (paymentInfo.method === 'card') {
        paymentText = `
            <p><strong>Credit/Debit Card</strong></p>
            <p>Card: ${paymentInfo.details.cardNumber || ''}</p>
            <p>Expires: ${paymentInfo.details.expiryDate || ''}</p>
        `;
    } else if (paymentInfo.method === 'paypal') {
        paymentText = '<p><strong>PayPal</strong></p>';
    } else if (paymentInfo.method === 'mobile') {
        paymentText = `
            <p><strong>Mobile Payment</strong></p>
            <p>Operator: ${paymentInfo.details.operator || ''}</p>
            <p>Number: ${paymentInfo.details.number || ''}</p>
        `;
    } else if (paymentInfo.method === 'cod') {
        paymentText = '<p><strong>Cash on Delivery</strong></p>';
    }
    
    paymentDetails.innerHTML = paymentText;
    
    // Order items
    const orderItemsList = document.getElementById('order-items-list');
    let itemsHTML = '<div class="review-items">';
    
    if (orderSummary.items) {
        orderSummary.items.forEach(item => {
            itemsHTML += `
                <div class="review-item">
                    <span>${item.product.name} x ${item.quantity}</span>
                    <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });
    }
    
    itemsHTML += '</div>';
    orderItemsList.innerHTML = itemsHTML;
}

// Initialize coupon system
function initCouponSystem() {
    const applyCouponBtn = document.getElementById('apply-coupon');
    const couponCodeInput = document.getElementById('coupon-code');
    const couponMessage = document.getElementById('coupon-message');
    
    // Available coupons
    const validCoupons = {
        'WELCOME10': { discount: 10, type: 'percentage' },
        'SAVE5': { discount: 5, type: 'dollar' },
        'FREESHIP': { discount: 2, type: 'shipping' }
    };
    
    applyCouponBtn.addEventListener('click', function() {
        const code = couponCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            couponMessage.textContent = 'Please enter a coupon code';
            couponMessage.style.color = '#e74c3c';
            return;
        }
        
        if (validCoupons[code]) {
            const coupon = validCoupons[code];
            applyCoupon(coupon);
            
            couponMessage.textContent = 'Coupon applied successfully!';
            couponMessage.style.color = '#27ae60';
            couponCodeInput.disabled = true;
            applyCouponBtn.disabled = true;
            
            // Save applied coupon
            localStorage.setItem('appliedCoupon', JSON.stringify({
                code: code,
                discount: coupon.discount,
                type: coupon.type
            }));
        } else {
            couponMessage.textContent = 'Invalid coupon code';
            couponMessage.style.color = '#e74c3c';
        }
    });
}

// Apply coupon discount
function applyCoupon(coupon) {
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || {};
    let discount = 0;
    
    if (coupon.type === 'percentage') {
        discount = (orderSummary.subtotal * coupon.discount) / 100;
    } else if (coupon.type === 'dollar') {
        discount = coupon.discount;
    } else if (coupon.type === 'shipping') {
        discount = Math.min(coupon.discount, orderSummary.shipping);
    }
    
    // Update order summary
    orderSummary.discount = discount.toFixed(2);
    orderSummary.total = (parseFloat(orderSummary.total) - discount).toFixed(2);
    
    localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
    
    // Update display
    const totalElement = document.getElementById('total');
    const currentTotal = parseFloat(totalElement.textContent.replace('$', ''));
    totalElement.textContent = `$${(currentTotal - discount).toFixed(2)}`;
    
    // Add discount row
    const summaryContainer = document.querySelector('.order-summary .checkout-section');
    const existingDiscount = document.getElementById('discount-row');
    
    if (existingDiscount) {
        existingDiscount.remove();
    }
    
    const discountRow = document.createElement('div');
    discountRow.id = 'discount-row';
    discountRow.className = 'summary-item';
    discountRow.innerHTML = `
        <span>Discount</span>
        <span style="color: #27ae60;">-$${discount.toFixed(2)}</span>
    `;
    
    const totalRow = document.querySelector('.summary-total');
    totalRow.parentNode.insertBefore(discountRow, totalRow);
}

// Initialize place order functionality
function initPlaceOrder() {
    const placeOrderBtn = document.getElementById('place-order');
    
    placeOrderBtn.addEventListener('click', function() {
        // Show loading
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        this.disabled = true;
        
        // Simulate payment processing
        setTimeout(() => {
            processOrder();
        }, 2000);
    });
}

// Process the order
function processOrder() {
    // Generate order ID
    const orderId = 'ORD' + Date.now().toString().slice(-8);
    
    // Get order data
    const orderData = {
        id: orderId,
        date: new Date().toISOString(),
        shippingInfo: JSON.parse(localStorage.getItem('shippingInfo')),
        paymentInfo: JSON.parse(localStorage.getItem('paymentInfo')),
        orderSummary: JSON.parse(localStorage.getItem('orderSummary')),
        status: 'processing'
    };
    
    // Save order to localStorage (in real app, send to API)
    const existingOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
    existingOrders.push(orderData);
    localStorage.setItem('userOrders', JSON.stringify(existingOrders));
    
    // Clear cart
    localStorage.removeItem('marketplaceCart');
    
    // Show success modal
    showSuccessModal(orderId);
}

// Show success modal
function showSuccessModal(orderId) {
    const modal = document.getElementById('success-modal');
    document.getElementById('order-id').textContent = orderId;
    modal.style.display = 'block';
    
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
}

// Format card inputs
function formatCardInputs() {
    const cardNumberInput = document.getElementById('card-number');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');
    
    // Format card number (add spaces)
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        let formatted = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += value[i];
        }
        
        e.target.value = formatted.substring(0, 19); // Max 16 digits + 3 spaces
    });
    
    // Format expiry date
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        } else {
            e.target.value = value;
        }
    });
    
    // CVV input - only numbers
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Add to existing style.css
const checkoutStyles = `
.checkout-item {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
}

.checkout-item-image img {
    border-radius: 4px;
}

.checkout-item-details {
    flex: 1;
    margin-left: 15px;
}

.checkout-item-details h4 {
    margin: 0 0 5px 0;
    font-size: 14px;
}

.checkout-item-price {
    font-weight: bold;
    color: #e74c3c;
}

.review-items {
    margin: 20px 0;
}

.review-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.modal-body {
    padding: 20px;
    text-align: center;
}

.success-icon {
    font-size: 60px;
    color: #27ae60;
    margin: 20px 0;
}

.modal-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.card-icons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.coupon-input {
    display: flex;
    gap: 10px;
}

.coupon-input input {
    flex: 1;
}

.trust-badges {
    display: flex;
    gap: 15px;
    margin-top: 15px;
    color: #27ae60;
}

.secure-payment {
    margin-top: 20px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
}
`;

// Add styles to head
const styleElement = document.createElement('style');
styleElement.textContent = checkoutStyles;
document.head.appendChild(styleElement);
