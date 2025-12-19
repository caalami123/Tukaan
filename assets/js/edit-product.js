// Edit product functionality
document.addEventListener('DOMContentLoaded', function() {
    loadProductForEditing();
});

// Load product for editing
function loadProductForEditing() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    const product = marketplaceData.products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Product not found', 'error');
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 2000);
        return;
    }
    
    // Load the add product form template
    loadFormTemplate(product);
}

// Load form template
function loadFormTemplate(product) {
    // Create a temporary div to hold the form
    const tempDiv = document.createElement('div');
    
    // Use the same form structure as add-product.html
    tempDiv.innerHTML = `
        <!-- Form Tabs -->
        <div class="form-tabs">
            <button class="form-tab active" data-tab="basic">Basic Info</button>
            <button class="form-tab" data-tab="pricing">Pricing & Inventory</button>
            <button class="form-tab" data-tab="images">Images</button>
            <button class="form-tab" data-tab="shipping">Shipping</button>
            <button class="form-tab" data-tab="variations">Variations</button>
            <button class="form-tab" data-tab="seo">SEO</button>
        </div>
        
        <!-- Product Form -->
        <form id="editProductForm" class="form-container">
            <!-- Form content will be populated by JavaScript -->
        </form>
    `;
    
    document.getElementById('edit-form-container').appendChild(tempDiv);
    
    // Now populate the form with product data
    populateForm(product);
    
    // Initialize the form
    initEditForm(product.id);
}

// Populate form with product data
function populateForm(product) {
    const form = document.getElementById('editProductForm');
    
    // Basic Information
    form.innerHTML = `
        <!-- Basic Information Tab -->
        <div class="tab-content active" id="basic">
            <div class="form-section">
                <h3 class="section-title"><i class="fas fa-info-circle"></i> Basic Information</h3>
                
                <div class="form-group">
                    <label for="product-name" class="required">Product Name</label>
                    <input type="text" id="product-name" class="form-control" value="${product.name}" required>
                    <div class="character-counter" id="name-counter">${product.name.length}/100</div>
                </div>
                
                <div class="form-group">
                    <label for="product-description" class="required">Description</label>
                    <textarea id="product-description" class="form-control textarea-control" rows="6" required>${product.description}</textarea>
                    <div class="character-counter" id="desc-counter">${product.description.length}/2000</div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="product-category" class="required">Category</label>
                        <select id="product-category" class="form-control select-control" required>
                            <option value="">Select Category</option>
                            <option value="clothing" ${product.category === 'clothing' ? 'selected' : ''}>Clothing & Fashion</option>
                            <option value="electronics" ${product.category === 'electronics' ? 'selected' : ''}>Electronics & Gadgets</option>
                            <option value="food" ${product.category === 'food' ? 'selected' : ''}>Food & Beverages</option>
                            <option value="home" ${product.category === 'home' ? 'selected' : ''}>Home & Living</option>
                            <option value="beauty" ${product.category === 'beauty' ? 'selected' : ''}>Beauty & Health</option>
                            <option value="sports" ${product.category === 'sports' ? 'selected' : ''}>Sports & Outdoors</option>
                            <option value="books" ${product.category === 'books' ? 'selected' : ''}>Books & Stationery</option>
                            <option value="toys" ${product.category === 'toys' ? 'selected' : ''}>Toys & Games</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-subcategory">Subcategory</label>
                        <select id="product-subcategory" class="form-control select-control">
                            <option value="">Select Subcategory</option>
                            <!-- Will be populated based on category -->
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="product-brand">Brand</label>
                        <input type="text" id="product-brand" class="form-control" value="${product.brand || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="product-sku">SKU</label>
                        <input type="text" id="product-sku" class="form-control" value="${product.sku}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Product Attributes</label>
                    <div id="attributes-container">
                        <input type="text" id="attribute-input" class="form-control" placeholder="Add attributes and press Enter">
                    </div>
                    <div id="attribute-tags">
                        ${product.attributes ? product.attributes.map(attr => `
                            <div class="attribute-tag" id="attr-${attr.replace(/\s+/g, '-')}">
                                ${attr}
                                <button type="button" onclick="removeAttributeTag('attr-${attr.replace(/\s+/g, '-')}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Pricing & Inventory Tab -->
        <div class="tab-content" id="pricing">
            <div class="form-section">
                <h3 class="section-title"><i class="fas fa-tag"></i> Pricing</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="product-price" class="required">Price ($)</label>
                        <div class="input-group">
                            <span class="input-group-prepend">$</span>
                            <input type="number" id="product-price" class="form-control" value="${product.price}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-compare-price">Compare at Price ($)</label>
                        <div class="input-group">
                            <span class="input-group-prepend">$</span>
                            <input type="number" id="product-compare-price" class="form-control" value="${product.comparePrice || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="product-cost">Cost per Item ($)</label>
                        <div class="input-group">
                            <span class="input-group-prepend">$</span>
                            <input type="number" id="product-cost" class="form-control" value="${product.cost || ''}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-tax">Tax Rate (%)</label>
                        <div class="input-group">
                            <input type="number" id="product-tax" class="form-control" value="${product.taxRate || 5}">
                            <span class="input-group-prepend">%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-section">
                <h3 class="section-title"><i class="fas fa-box"></i> Inventory</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="product-quantity" class="required">Quantity</label>
                        <input type="number" id="product-quantity" class="form-control" value="${product.quantity}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-low-stock">Low Stock Threshold</label>
                        <input type="number" id="product-low-stock" class="form-control" value="${product.lowStock || 10}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Stock Management</label>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <label class="switch">
                                <input type="checkbox" id="track-inventory" ${product.trackInventory ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                            <span>Track inventory</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Allow Backorders</label>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <label class="switch">
                                <input type="checkbox" id="allow-backorders" ${product.allowBackorders ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                            <span>Allow customers to purchase when out of stock</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Images Tab -->
        <div class="tab-content" id="images">
            <div class="form-section">
                <h3 class="section-title"><i class="fas fa-images"></i> Product Images</h3>
                
                <div class="image-upload-container" id="dropzone-container">
                    <div class="image-upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <h3>Drag & Drop Images Here</h3>
                    <p>or click to browse files</p>
                    <input type="file" id="image-upload" accept="image/*" multiple style="display: none;">
                    <button type="button" class="btn" onclick="document.getElementById('image-upload').click()">
                        <i class="fas fa-upload"></i> Browse Files
                    </button>
                </div>
                
                <div class="image-preview-container" id="image-preview">
                    ${product.images ? product.images.map((img, index) => `
                        <div class="image-preview" id="img-${index}">
                            <img src="${img.url}" alt="${img.alt}">
                            <button type="button" class="remove-image" onclick="removeImage('img-${index}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('') : ''}
                </div>
                
                <div class="form-group">
                    <label for="image-urls">Or Add Image URLs (one per line)</label>
                    <textarea id="image-urls" class="form-control textarea-control" rows="4" placeholder="https://example.com/image1.jpg">${product.images ? product.images.map(img => img.url).join('\n') : ''}</textarea>
                </div>
            </div>
        </div>
        
        <!-- Shipping Tab -->
        <div class="tab-content" id="shipping">
            <div class="form-section">
                <h3 class="section-title"><i class="fas fa-shipping-fast"></i> Shipping Details</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="product-weight">Weight (kg)</label>
                        <div class="input-group">
                            <input type="number" id="product-weight" class="form-control" value="${product.weight || ''}">
                            <span class="input-group-prepend">kg</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-dimensions">Dimensions (L×W×H in cm)</label>
                        <div class="input-group">
                            <input type="text" id="product-dimensions" class="form-control" value="${product.dimensions || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="shipping-type">Shipping Type</label>
                    <select id="shipping-type" class="form-control select-control">
                        <option value="free" ${product.shippingType === 'free' ? 'selected' : ''}>Free Shipping</option>
                        <option value="flat" ${product.shippingType === 'flat' ? 'selected' : ''}>Flat Rate</option>
                        <option value="calculated" ${product.shippingType === 'calculated' ? 'selected' : ''}>Calculated Shipping</option>
                        <option value="pickup" ${product.shippingType === 'pickup' ? 'selected' : ''}>Local Pickup</option>
                    </select>
                </div>
                
                <div class="form-group" id="shipping-cost-container" style="${product.shippingType === 'flat' ? 'display: block;' : 'display: none;'}">
                    <label for="shipping-cost">Shipping Cost ($)</label>
                    <div class="input-group">
                        <span class="input-group-prepend">$</span>
                        <input type="number" id="shipping-cost" class="form-control" value="${product.shippingCost || ''}">
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Variations Tab -->
        <div class="tab-content" id="variations">
            <div class="form-section">
                <h3 class="section-title"><i class="fas fa-list"></i> Product Variations</h3>
                <div class="variations-container" id="variations-container">
                    ${product.variations ? product.variations.map((variation, index) => `
                        <div class="variation-item" id="var-${index}">
                            <div class="variation-header">
                                <h4>Variation ${index + 1}</h4>
                                <button type="button" class="remove-variation" onclick="removeVariation('var-${index}')">
                                    <i class="fas fa-trash"></i> Remove
                                </button>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Variation Type</label>
                                    <select class="form-control variation-type">
                                        <option value="size" ${variation.type === 'size' ? 'selected' : ''}>Size</option>
                                        <option value="color" ${variation.type === 'color' ? 'selected' : ''}>Color</option>
                                        <option value="material" ${variation.type === 'material' ? 'selected' : ''}>Material</option>
                                        <option value="style" ${variation.type === 'style' ? 'selected' : ''}>Style</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label>Variation Value</label>
                                    <input type="text" class="form-control variation-value" value="${variation.value}">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Additional Price ($)</label>
                                    <input type="number" class="form-control variation-price" value="${variation.additionalPrice || ''}">
                                </div>
                                
                                <div class="form-group">
                                    <label>Stock for Variation</label>
                                    <input type="number" class="form-control variation-stock" value="${variation.stock || ''}">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>SKU for Variation</label>
                                <input type="text" class="form-control variation-sku" value="${variation.sku || ''}">
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
                <button type="button" class="add-variation" id="add-variation">
                    <i class="fas fa-plus"></i> Add Variation
                </button>
            </div>
        </div>
        
        <!-- SEO Tab -->
        <div class="tab-content" id="seo">
            <div class="form-section">
                <h3 class="section-title"><i class="fas fa-search"></i> Search Engine Optimization</h3>
                
                <div class="form-group">
                    <label for="seo-title">SEO Title</label>
                    <input type="text" id="seo-title" class="form-control" value="${product.seoTitle || ''}">
                    <div class="character-counter" id="seo-title-counter">${product.seoTitle ? product.seoTitle.length : 0}/60</div>
                </div>
                
                <div class="form-group">
                    <label for="seo-description">Meta Description</label>
                    <textarea id="seo-description" class="form-control textarea-control" rows="4">${product.seoDescription || ''}</textarea>
                    <div class="character-counter" id="seo-desc-counter">${product.seoDescription ? product.seoDescription.length : 0}/160</div>
                </div>
                
                <div class="form-group">
                    <label for="seo-keywords">Keywords</label>
                    <input type="text" id="seo-keywords" class="form-control" value="${product.seoKeywords || ''}">
                </div>
                         </div>
        </div>
        
        <!-- Form Actions -->
        <div class="form-actions">
            <button type="button" class="btn btn-save-draft" id="save-draft">
                <i class="fas fa-save"></i> Update Draft
            </button>
            
            <button type="button" class="btn btn-preview" id="preview-product">
                <i class="fas fa-eye"></i> Preview
            </button>
            
            <button type="submit" class="btn btn-submit" id="submit-product">
                <i class="fas fa-check-circle"></i> Update Product
            </button>
        </div>
    `;
}

// Initialize edit form
function initEditForm(productId) {
    // Initialize all the form functionalities from add-product.js
    // We can reuse most functions by including them here
    
    // Initialize tabs
    initFormTabs();
    
    // Initialize character counters
    initCharacterCounters();
    
    // Initialize category subcategory
    initCategorySubcategory();
    
    // Initialize attribute input
    initAttributeInput();
    
    // Initialize image upload
    initImageUpload();
    
    // Initialize variations
    initVariations();
    
    // Initialize shipping type
    initShippingType();
    
    // Initialize form submission for edit
    initEditFormSubmission(productId);
    
    // Initialize preview
    initPreview();
}

// Initialize edit form submission
function initEditFormSubmission(productId) {
    const form = document.getElementById('editProductForm');
    const saveDraftBtn = document.getElementById('save-draft');
    const submitBtn = document.getElementById('submit-product');
    
    // Save as draft
    saveDraftBtn.addEventListener('click', function() {
        updateProduct(productId, 'draft');
    });
    
    // Submit product
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateProduct(productId, 'published');
    });
}

// Update product
function updateProduct(productId, status) {
    const productIndex = marketplaceData.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Collect updated data
    const productData = collectFormData();
    productData.id = productId;
    productData.status = status;
    productData.updatedAt = new Date().toISOString();
    
    // Update product in array
    marketplaceData.products[productIndex] = {
        ...marketplaceData.products[productIndex],
        ...productData
    };
    
    // Save to localStorage
    localStorage.setItem('marketplaceProducts', JSON.stringify(marketplaceData.products));
    
    // Show success message
    const message = status === 'draft' ? 
        'Product updated as draft successfully!' : 
        'Product updated and published successfully!';
    
    showNotification(message, 'success');
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 2000);
}

// Collect form data (reuse from add-product.js)
function collectFormData() {
    // This function should be imported from add-product.js
    // For now, we'll create a simplified version
    
    return {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        category: document.getElementById('product-category').value,
        subcategory: document.getElementById('product-subcategory').value,
        brand: document.getElementById('product-brand').value,
        sku: document.getElementById('product-sku').value,
        price: parseFloat(document.getElementById('product-price').value) || 0,
        comparePrice: parseFloat(document.getElementById('product-compare-price').value) || 0,
        cost: parseFloat(document.getElementById('product-cost').value) || 0,
        taxRate: parseFloat(document.getElementById('product-tax').value) || 5,
        quantity: parseInt(document.getElementById('product-quantity').value) || 0,
        lowStock: parseInt(document.getElementById('product-low-stock').value) || 10,
        trackInventory: document.getElementById('track-inventory').checked,
        allowBackorders: document.getElementById('allow-backorders').checked,
        weight: parseFloat(document.getElementById('product-weight').value) || 0,
        dimensions: document.getElementById('product-dimensions').value,
        shippingType: document.getElementById('shipping-type').value,
        shippingCost: parseFloat(document.getElementById('shipping-cost').value) || 0,
        seoTitle: document.getElementById('seo-title').value,
        seoDescription: document.getElementById('seo-description').value,
        seoKeywords: document.getElementById('seo-keywords').value
    };
}
