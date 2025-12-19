// Product addition functionality
document.addEventListener('DOMContentLoaded', function() {
    initFormTabs();
    initCharacterCounters();
    initCategorySubcategory();
    initAttributeInput();
    initImageUpload();
    initVariations();
    initShippingType();
    initFormSubmission();
    initPreview();
});

// Initialize form tabs
function initFormTabs() {
    const tabButtons = document.querySelectorAll('.form-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize character counters
function initCharacterCounters() {
    const counters = {
        'product-name': { max: 100, counter: 'name-counter' },
        'product-description': { max: 2000, counter: 'desc-counter' },
        'seo-title': { max: 60, counter: 'seo-title-counter' },
        'seo-description': { max: 160, counter: 'seo-desc-counter' }
    };
    
    Object.keys(counters).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const counter = document.getElementById(counters[fieldId].counter);
        const maxLength = counters[fieldId].max;
        
        if (field && counter) {
            field.addEventListener('input', function() {
                const length = this.value.length;
                counter.textContent = `${length}/${maxLength}`;
                
                // Update counter color based on length
                if (length > maxLength * 0.9) {
                    counter.classList.add('error');
                    counter.classList.remove('warning');
                } else if (length > maxLength * 0.75) {
                    counter.classList.add('warning');
                    counter.classList.remove('error');
                } else {
                    counter.classList.remove('warning', 'error');
                }
            });
            
            // Initial count
            counter.textContent = `${field.value.length}/${maxLength}`;
        }
    });
}

// Initialize category and subcategory
function initCategorySubcategory() {
    const categorySelect = document.getElementById('product-category');
    const subcategorySelect = document.getElementById('product-subcategory');
    
    // Subcategory mapping
    const subcategories = {
        clothing: ['Men\'s Clothing', 'Women\'s Clothing', 'Kids\' Clothing', 'Traditional Wear', 'Accessories'],
        electronics: ['Mobile Phones', 'Laptops', 'Tablets', 'Accessories', 'Home Appliances'],
        food: ['Fresh Food', 'Packaged Food', 'Beverages', 'Snacks', 'Spices'],
        home: ['Furniture', 'Home Decor', 'Kitchenware', 'Bedding', 'Lighting'],
        beauty: ['Skincare', 'Haircare', 'Makeup', 'Fragrances', 'Personal Care'],
        sports: ['Fitness Equipment', 'Team Sports', 'Outdoor Gear', 'Sportswear', 'Footwear'],
        books: ['Fiction', 'Non-fiction', 'Educational', 'Children\'s Books', 'Religious'],
        toys: ['Educational Toys', 'Action Figures', 'Board Games', 'Outdoor Toys', 'Dolls']
    };
    
    categorySelect.addEventListener('change', function() {
        const category = this.value;
        
        // Clear existing options
        subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
        
        // Add new options
        if (category && subcategories[category]) {
            subcategories[category].forEach(subcat => {
                const option = document.createElement('option');
                option.value = subcat.toLowerCase().replace(/\s+/g, '-');
                option.textContent = subcat;
                subcategorySelect.appendChild(option);
            });
        }
    });
}

// Initialize attribute input
function initAttributeInput() {
    const attributeInput = document.getElementById('attribute-input');
    const attributeTags = document.getElementById('attribute-tags');
    
    attributeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const attribute = this.value.trim();
            
            if (attribute) {
                addAttributeTag(attribute);
                this.value = '';
            }
        }
    });
}

// Add attribute tag
function addAttributeTag(attribute) {
    const attributeTags = document.getElementById('attribute-tags');
    const tagId = 'attr-' + Date.now();
    
    const tag = document.createElement('div');
    tag.className = 'attribute-tag';
    tag.id = tagId;
    tag.innerHTML = `
        ${attribute}
        <button type="button" onclick="removeAttributeTag('${tagId}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    attributeTags.appendChild(tag);
}

// Remove attribute tag
function removeAttributeTag(tagId) {
    const tag = document.getElementById(tagId);
    if (tag) {
        tag.remove();
    }
}

// Initialize image upload
function initImageUpload() {
    const dropzoneContainer = document.getElementById('dropzone-container');
    const fileInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const imageUrls = document.getElementById('image-urls');
    
    // Handle drag and drop
    dropzoneContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#3498db';
        this.style.background = '#f0f7ff';
    });
    
    dropzoneContainer.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.background = '#f8fdff';
    });
    
    dropzoneContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.background = '#f8fdff';
        
        const files = e.dataTransfer.files;
        handleImageFiles(files);
    });
    
    // Handle file input change
    fileInput.addEventListener('change', function(e) {
        handleImageFiles(e.target.files);
    });
    
    // Handle URL input
    imageUrls.addEventListener('input', function() {
        const urls = this.value.split('\n').filter(url => url.trim());
        displayImageUrls(urls);
    });
}

// Handle image files
function handleImageFiles(files) {
    const imagePreview = document.getElementById('image-preview');
    
    Array.from(files).forEach(file => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please upload image files only', 'error');
            return;
        }
        
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('File size must be less than 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            addImagePreview(e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    });
}

// Add image preview
function addImagePreview(imageSrc, fileName) {
    const imagePreview = document.getElementById('image-preview');
    const imageId = 'img-' + Date.now();
    
    const preview = document.createElement('div');
    preview.className = 'image-preview';
    preview.id = imageId;
    preview.innerHTML = `
        <img src="${imageSrc}" alt="${fileName}">
        <button type="button" class="remove-image" onclick="removeImage('${imageId}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    imagePreview.appendChild(preview);
}

// Display image URLs
function displayImageUrls(urls) {
    const imagePreview = document.getElementById('image-preview');
    
    // Clear existing previews
    imagePreview.innerHTML = '';
    
    urls.forEach((url, index) => {
        const imageId = 'url-img-' + index;
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.id = imageId;
        preview.innerHTML = `
            <img src="${url}" alt="Product image ${index + 1}" onerror="this.src='https://via.placeholder.com/120?text=Image+Error'">
            <button type="button" class="remove-image" onclick="removeImage('${imageId}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        imagePreview.appendChild(preview);
    });
}

// Remove image
function removeImage(imageId) {
    const image = document.getElementById(imageId);
    if (image) {
        image.remove();
    }
}

// Initialize variations
function initVariations() {
    const addVariationBtn = document.getElementById('add-variation');
    const variationsContainer = document.getElementById('variations-container');
    
    // Add first variation
    addVariation(variationsContainer);
    
    addVariationBtn.addEventListener('click', function() {
        addVariation(variationsContainer);
    });
}

// Add variation
function addVariation(container) {
    const variationId = 'var-' + Date.now();
    
    const variation = document.createElement('div');
    variation.className = 'variation-item';
    variation.id = variationId;
    variation.innerHTML = `
        <div class="variation-header">
            <h4>New Variation</h4>
            <button type="button" class="remove-variation" onclick="removeVariation('${variationId}')">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Variation Type</label>
                <select class="form-control variation-type">
                    <option value="size">Size</option>
                    <option value="color">Color</option>
                    <option value="material">Material</option>
                    <option value="style">Style</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Variation Value</label>
                <input type="text" class="form-control variation-value" placeholder="e.g., Red, Large, etc.">
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Additional Price ($)</label>
                <input type="number" class="form-control variation-price" step="0.01" placeholder="0.00">
            </div>
            
            <div class="form-group">
                <label>Stock for Variation</label>
                <input type="number" class="form-control variation-stock" min="0" placeholder="Quantity">
            </div>
        </div>
        
        <div class="form-group">
            <label>SKU for Variation</label>
            <input type="text" class="form-control variation-sku" placeholder="Optional">
        </div>
    `;
    
    container.appendChild(variation);
}

// Remove variation
function removeVariation(variationId) {
    const variation = document.getElementById(variationId);
    if (variation) {
        variation.remove();
    }
}

// Initialize shipping type
function initShippingType() {
    const shippingType = document.getElementById('shipping-type');
    const shippingCostContainer = document.getElementById('shipping-cost-container');
    
    shippingType.addEventListener('change', function() {
        if (this.value === 'flat') {
            shippingCostContainer.style.display = 'block';
        } else {
            shippingCostContainer.style.display = 'none';
        }
    });
}

// Initialize form submission
function initFormSubmission() {
    const form = document.getElementById('addProductForm');
    const saveDraftBtn = document.getElementById('save-draft');
    const submitBtn = document.getElementById('submit-product');
    
    // Save as draft
    saveDraftBtn.addEventListener('click', function() {
        const productData = collectFormData();
        productData.status = 'draft';
        saveProduct(productData, 'draft');
    });
    
    // Submit product
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const productData = collectFormData();
        productData.status = 'published';
        saveProduct(productData, 'published');
    });
}

// Collect form data
function collectFormData() {
    // Basic Information
    const productData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        category: document.getElementById('product-category').value,
        subcategory: document.getElementById('product-subcategory').value,
        brand: document.getElementById('product-brand').value,
        sku: document.getElementById('product-sku').value || generateSKU(),
        
        // Pricing
        price: parseFloat(document.getElementById('product-price').value) || 0,
        comparePrice: parseFloat(document.getElementById('product-compare-price').value) || 0,
        cost: parseFloat(document.getElementById('product-cost').value) || 0,
        taxRate: parseFloat(document.getElementById('product-tax').value) || 5,
        
        // Inventory
        quantity: parseInt(document.getElementById('product-quantity').value) || 0,
        lowStock: parseInt(document.getElementById('product-low-stock').value) || 10,
        trackInventory: document.getElementById('track-inventory').checked,
        allowBackorders: document.getElementById('allow-backorders').checked,
        
        // Shipping
        weight: parseFloat(document.getElementById('product-weight').value) || 0,
        dimensions: document.getElementById('product-dimensions').value,
        shippingType: document.getElementById('shipping-type').value,
        shippingCost: parseFloat(document.getElementById('shipping-cost').value) || 0,
        
        // SEO
        seoTitle: document.getElementById('seo-title').value,
        seoDescription: document.getElementById('seo-description').value,
        seoKeywords: document.getElementById('seo-keywords').value,
        urlSlug: document.getElementById('product-url').value || generateSlug(),
        
        // Metadata
        storeId: 1, // Current vendor's store ID
        vendorId: 1, // Current vendor ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 0,
        reviews: 0
    };
    
    // Collect images
    productData.images = collectImages();
    
    // Collect attributes
    productData.attributes = collectAttributes();
    
    // Collect variations
    productData.variations = collectVariations();
    
    return productData;
}

// Generate SKU
function generateSKU() {
    const prefix = 'SKU';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

// Generate URL slug
function generateSlug() {
    const name = document.getElementById('product-name').value;
    return name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
}

// Collect images
function collectImages() {
    const images = [];
    const imagePreviews = document.querySelectorAll('#image-preview .image-preview img');
    
    imagePreviews.forEach((img, index) => {
        images.push({
            url: img.src,
            alt: `Product image ${index + 1}`,
            isMain: index === 0
        });
    });
    
    // If no images, add placeholder
    if (images.length === 0) {
        images.push({
            url: 'https://via.placeholder.com/500x500?text=Product+Image',
            alt: 'Product image',
            isMain: true
        });
    }
    
    return images;
}

// Collect attributes
function collectAttributes() {
    const attributes = [];
    const attributeTags = document.querySelectorAll('#attribute-tags .attribute-tag');
    
    attributeTags.forEach(tag => {
        const text = tag.textContent.trim();
        // Remove the × icon text
        const attribute = text.replace('×', '').trim();
        if (attribute) {
            attributes.push(attribute);
        }
    });
    
    return attributes;
}

// Collect variations
function collectVariations() {
    const variations = [];
    const variationItems = document.querySelectorAll('#variations-container .variation-item');
    
    variationItems.forEach(item => {
        const type = item.querySelector('.variation-type').value;
        const value = item.querySelector('.variation-value').value;
        const price = parseFloat(item.querySelector('.variation-price').value) || 0;
        const stock = parseInt(item.querySelector('.variation-stock').value) || 0;
        const sku = item.querySelector('.variation-sku').value || '';
        
        if (type && value) {
            variations.push({
                type,
                value,
                additionalPrice: price,
                stock,
                sku,
                id: generateVariationId(type, value)
            });
        }
    });
    
    return variations;
}

// Generate variation ID
function generateVariationId(type, value) {
    return `${type}-${value.toLowerCase().replace(/\s+/g, '-')}`;
}

// Save product
function saveProduct(productData, status) {
    // Generate product ID
    productData.id = marketplaceData.products.length + 1;
    
    // Set product status
    productData.status = status;
    
    // Add to marketplace data
    marketplaceData.products.push(productData);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Show success message
    const message = status === 'draft' ? 
        'Product saved as draft successfully!' : 
        'Product published successfully!';
    
    showNotification(message, 'success');
    
    // Redirect after delay
    setTimeout(() => {
        if (status === 'draft') {
            window.location.href = 'products.html?tab=drafts';
        } else {
            window.location.href = 'products.html';
        }
    }, 2000);
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('marketplaceProducts', JSON.stringify(marketplaceData.products));
}

// Initialize preview
function initPreview() {
    const previewBtn = document.getElementById('preview-product');
    const previewModal = document.getElementById('preview-modal');
    const previewContent = document.getElementById('preview-content');
    
    previewBtn.addEventListener('click', function() {
        const productData = collectFormData();
        displayPreview(productData, previewContent);
        previewModal.style.display = 'flex';
    });
    
    // Close modal
    previewModal.querySelector('.modal-close').addEventListener('click', function() {
        previewModal.style.display = 'none';
    });
    
    // Close on outside click
    previewModal.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });
}

// Display preview
function displayPreview(productData, container) {
    container.innerHTML = `
        <div class="product-preview">
            <div class="preview-images">
                ${productData.images.map((img, index) => `
                    <img src="${img.url}" alt="${img.alt}" style="max-width: 100%; margin-bottom: 10px;">
                `).join('')}
            </div>
            
            <div class="preview-details">
                <h2>${productData.name}</h2>
                <p><strong>Category:</strong> ${productData.category} ${productData.subcategory ? '> ' + productData.subcategory : ''}</p>
                
                <div class="preview-price">
                    <span class="current-price">$${productData.price.toFixed(2)}</span>
                    ${productData.comparePrice > productData.price ? 
                      `<span class="original-price">$${productData.comparePrice.toFixed(2)}</span>` : ''}
                </div>
                
                <div class="preview-description">
                    <h3>Description</h3>
                    <p>${productData.description}</p>
                </div>
                
                <div class="preview-specs">
                    <h3>Specifications</h3>
                    <ul>
                        <li><strong>SKU:</strong> ${productData.sku}</li>
                        ${productData.brand ? `<li><strong>Brand:</strong> ${productData.brand}</li>` : ''}
                        ${productData.attributes.length > 0 ? `
                            <li><strong>Attributes:</strong> ${productData.attributes.join(', ')}</li>
                        ` : ''}
                        <li><strong>In Stock:</strong> ${productData.quantity} units</li>
                        ${productData.weight > 0 ? `<li><strong>Weight:</strong> ${productData.weight} kg</li>` : ''}
                        ${productData.dimensions ? `<li><strong>Dimensions:</strong> ${productData.dimensions} cm</li>` : ''}
                    </ul>
                </div>
                
                ${productData.variations.length > 0 ? `
                <div class="preview-variations">
                    <h3>Variations</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ddd; padding: 8px;">Type</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Value</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Additional Price</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productData.variations.map(variation => `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${variation.type}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${variation.value}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">$${variation.additionalPrice.toFixed(2)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${variation.stock}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : ''}
                
                <div class="preview-status">
                    <strong>Status:</strong> ${productData.status === 'draft' ? 'Draft' : 'Published'}
                </div>
            </div>
        </div>
    `;
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

const styleElement = document.createElement('style');
styleElement.textContent = notificationStyles;
document.head.appendChild(styleElement);
