// Check authentication
if (!sessionStorage.getItem('adminLoggedIn')) {
    window.location.href = 'admin.html';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
    window.location.href = 'admin.html';
});

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    if (!item.target) {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(section + 'Section').classList.add('active');
            
            // Update page title
            const titles = {
                products: 'Управление товарами',
                media: 'Управление медиа'
            };
            document.getElementById('pageTitle').textContent = titles[section] || 'Админ-панель';
        });
    }
});

// Load products from localStorage
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    if (products.length === 0) {
        productsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Товары не найдены. Добавьте первый товар!</p>';
        return;
    }

    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const firstImage = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://via.placeholder.com/300x200?text=No+Image';
        
        productCard.innerHTML = `
            <img src="${firstImage}" alt="${product.title}" class="product-card-image">
            <h3 class="product-card-title">${product.title}</h3>
            <div class="product-card-info">
                <p><strong>Категория:</strong> ${getCategoryName(product.category)}</p>
                <p><strong>Артикул:</strong> ${product.article || 'Не указан'}</p>
            </div>
            <div class="product-card-actions">
                <button class="btn-edit" onclick="editProduct(${index})">
                    <i class="fas fa-edit"></i> Редактировать
                </button>
                <button class="btn-delete" onclick="deleteProduct(${index})">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        `;
        
        productsList.appendChild(productCard);
    });
}

function getCategoryName(category) {
    const names = {
        dresses: 'Платья',
        blouses: 'Блузки',
        skirts: 'Юбки',
        accessories: 'Аксессуары'
    };
    return names[category] || category;
}

// Add Product Button
document.getElementById('addProductBtn').addEventListener('click', () => {
    openProductModal();
});

// Export Products Button
const exportProductsBtn = document.getElementById('exportProductsBtn');
if (exportProductsBtn) {
    exportProductsBtn.addEventListener('click', () => {
        const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        const media = JSON.parse(localStorage.getItem('adminMedia') || '[]');
        
        if (products.length === 0) {
            alert('Нет товаров для экспорта');
            return;
        }
        
        const data = {
            products: products,
            media: media,
            updatedAt: new Date().toISOString()
        };
        
        // Create JSON file
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'zipseoul-products-' + new Date().getTime() + '.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('Товары экспортированы! Загрузите этот файл в корень проекта как "products-data.json" для автоматической загрузки.');
    });
}

// Modal
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
let currentProductIndex = null;
let productImages = [];
let productVideo = null;

document.getElementById('modalClose').addEventListener('click', closeProductModal);
document.getElementById('cancelBtn').addEventListener('click', closeProductModal);

productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeProductModal();
    }
});

function openProductModal(productIndex = null) {
    currentProductIndex = productIndex;
    productImages = [];
    productVideo = null;
    
    if (productIndex !== null) {
        const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        const product = products[productIndex];
        
        document.getElementById('modalTitle').textContent = 'Редактировать товар';
        document.getElementById('productId').value = productIndex;
        document.getElementById('productTitle').value = product.title;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productMaterial').value = product.material || '';
        document.getElementById('productArticle').value = product.article || '';
        
        productImages = product.images || [];
        productVideo = product.video || null;
        
        updateImagesPreview();
        updateVideoPreview();
        loadColors(product.colors || []);
        loadSizes(product.sizes || []);
    } else {
        document.getElementById('modalTitle').textContent = 'Добавить товар';
        productForm.reset();
        document.getElementById('imagesPreview').innerHTML = '';
        document.getElementById('videoPreview').innerHTML = '';
        document.getElementById('colorsList').innerHTML = '';
        document.getElementById('sizesList').innerHTML = '';
    }
    
    productModal.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
    productForm.reset();
    productImages = [];
    productVideo = null;
    currentProductIndex = null;
}

// Images
document.getElementById('addImagesBtn').addEventListener('click', () => {
    document.getElementById('imagesInput').click();
});

document.getElementById('imagesInput').addEventListener('change', (e) => {
    Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            productImages.push(event.target.result);
            updateImagesPreview();
        };
        reader.readAsDataURL(file);
    });
});

function updateImagesPreview() {
    const preview = document.getElementById('imagesPreview');
    preview.innerHTML = '';
    
    productImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'image-preview-item';
        item.innerHTML = `
            <img src="${image}" alt="Preview">
            <button type="button" class="remove-media" onclick="removeImage(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        preview.appendChild(item);
    });
}

function removeImage(index) {
    productImages.splice(index, 1);
    updateImagesPreview();
}

// Video
document.getElementById('addVideoBtn').addEventListener('click', () => {
    document.getElementById('videoInput').click();
});

document.getElementById('videoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            productVideo = event.target.result;
            updateVideoPreview();
        };
        reader.readAsDataURL(file);
    }
});

function updateVideoPreview() {
    const preview = document.getElementById('videoPreview');
    preview.innerHTML = '';
    
    if (productVideo) {
        const item = document.createElement('div');
        item.className = 'video-preview-item';
        item.innerHTML = `
            <video src="${productVideo}" controls style="width: 100%; height: 100%;"></video>
            <button type="button" class="remove-media" onclick="removeVideo()">
                <i class="fas fa-times"></i>
            </button>
        `;
        preview.appendChild(item);
    }
}

function removeVideo() {
    productVideo = null;
    updateVideoPreview();
}

// Colors
let colors = [];

document.getElementById('addColorBtn').addEventListener('click', () => {
    addColorItem();
});

function addColorItem(color = { name: '', value: '#000000' }) {
    const colorsList = document.getElementById('colorsList');
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';
    colorItem.innerHTML = `
        <input type="color" class="color-picker" value="${color.value}" onchange="updateColorValue(this)">
        <input type="text" class="color-name-input" placeholder="Название цвета" value="${color.name}" onchange="updateColorName(this)">
        <button type="button" class="remove-item" onclick="removeColor(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    colorsList.appendChild(colorItem);
}

function loadColors(colorsData) {
    colors = colorsData;
    document.getElementById('colorsList').innerHTML = '';
    colors.forEach(color => addColorItem(color));
}

function updateColorValue(input) {
    // Color value is updated automatically
}

function updateColorName(input) {
    // Color name is updated automatically
}

function removeColor(button) {
    button.parentElement.remove();
}

// Sizes
let sizes = [];

document.getElementById('addSizeBtn').addEventListener('click', () => {
    addSizeItem();
});

function addSizeItem(size = '') {
    const sizesList = document.getElementById('sizesList');
    const sizeItem = document.createElement('div');
    sizeItem.className = 'size-item';
    sizeItem.innerHTML = `
        <input type="text" class="size-input" placeholder="Размер" value="${size}" onchange="updateSize(this)">
        <button type="button" class="remove-item" onclick="removeSize(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    sizesList.appendChild(sizeItem);
}

function loadSizes(sizesData) {
    sizes = sizesData;
    document.getElementById('sizesList').innerHTML = '';
    sizes.forEach(size => addSizeItem(size));
}

function updateSize(input) {
    // Size is updated automatically
}

function removeSize(button) {
    button.parentElement.remove();
}

// Form Submission
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect colors
    const colorsData = [];
    document.querySelectorAll('.color-item').forEach(item => {
        const name = item.querySelector('.color-name-input').value;
        const value = item.querySelector('.color-picker').value;
        if (name) {
            colorsData.push({ name, value });
        }
    });
    
    // Collect sizes
    const sizesData = [];
    document.querySelectorAll('.size-item').forEach(item => {
        const size = item.querySelector('.size-input').value;
        if (size) {
            sizesData.push(size);
        }
    });
    
    // Validate
    if (productImages.length === 0) {
        alert('Добавьте хотя бы одно изображение!');
        return;
    }
    
    if (colorsData.length === 0) {
        alert('Добавьте хотя бы один цвет!');
        return;
    }
    
    if (sizesData.length === 0) {
        alert('Добавьте хотя бы один размер!');
        return;
    }
    
    const product = {
        title: document.getElementById('productTitle').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        material: document.getElementById('productMaterial').value,
        article: document.getElementById('productArticle').value,
        images: productImages,
        video: productVideo,
        colors: colorsData,
        sizes: sizesData
    };
    
    let products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    
    if (currentProductIndex !== null) {
        products[currentProductIndex] = product;
    } else {
        products.push(product);
    }
    
    localStorage.setItem('adminProducts', JSON.stringify(products));
    
    // Save to server/repository
    saveProductsToServer(products);
    
    // Also create downloadable file for manual upload
    createProductsFile(products);
    
    loadProducts();
    closeProductModal();
    
    // Schedule auto-save
    scheduleAutoSave();
    
    alert('Товар успешно сохранен!');
});

// Save products to server (GitHub/Vercel)
async function saveProductsToServer(products) {
    try {
        const response = await fetch('/api/save-products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: products,
                media: JSON.parse(localStorage.getItem('adminMedia') || '[]')
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('Products saved to repository:', result);
            showNotification('Товары успешно сохранены в репозиторий!', 'success');
        } else {
            console.error('Error saving products:', result);
            showNotification('Ошибка при сохранении в репозиторий. Используйте экспорт файла для ручной загрузки.', 'warning');
        }
    } catch (error) {
        console.error('Error saving products to server:', error);
        showNotification('Используйте кнопку "Экспорт товаров" для сохранения в репозиторий.', 'info');
    }
}

// Create downloadable products file
function createProductsFile(products) {
    const data = {
        products: products,
        media: JSON.parse(localStorage.getItem('adminMedia') || '[]'),
        updatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Store in localStorage for download
    localStorage.setItem('productsExport', dataStr);
}

// Notification function
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.getElementById('adminNotification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'adminNotification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#2196f3'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Edit Product
function editProduct(index) {
    openProductModal(index);
}

// Delete Product
function deleteProduct(index) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        let products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        products.splice(index, 1);
        localStorage.setItem('adminProducts', JSON.stringify(products));
        loadProducts();
    }
}

// Media Upload
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadedFiles = document.getElementById('uploadedFiles');

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#c9a961';
    uploadArea.style.background = 'rgba(201, 169, 97, 0.05)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#e0e0e0';
    uploadArea.style.background = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e0e0e0';
    uploadArea.style.background = 'transparent';
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
});

function handleFiles(files) {
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const mediaData = {
                name: file.name,
                type: file.type.startsWith('image/') ? 'image' : 'video',
                data: event.target.result, // Base64 encoded data stored in localStorage
                uploadedAt: new Date().toISOString(),
                size: file.size,
                mimeType: file.type
            };
            
            let mediaFiles = JSON.parse(localStorage.getItem('adminMedia') || '[]');
            mediaFiles.push(mediaData);
            localStorage.setItem('adminMedia', JSON.stringify(mediaFiles));
            
            displayUploadedFiles();
        };
        reader.readAsDataURL(file);
    });
}

function displayUploadedFiles() {
    const mediaFiles = JSON.parse(localStorage.getItem('adminMedia') || '[]');
    uploadedFiles.innerHTML = '';
    
    if (mediaFiles.length === 0) {
        uploadedFiles.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Загруженные файлы отсутствуют</p>';
        return;
    }
    
    mediaFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'uploaded-file-item';
        
        if (file.type === 'image') {
            item.innerHTML = `
                <img src="${file.data}" alt="${file.name}">
                <div class="uploaded-file-name">${file.name}</div>
                <button class="delete-media-btn" onclick="deleteMedia(${index})" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        } else {
            item.innerHTML = `
                <video src="${file.data}" controls></video>
                <div class="uploaded-file-name">${file.name}</div>
                <button class="delete-media-btn" onclick="deleteMedia(${index})" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        }
        
        uploadedFiles.appendChild(item);
    });
}

// Delete media function
function deleteMedia(index) {
    if (confirm('Вы уверены, что хотите удалить этот медиа-файл?')) {
        let mediaFiles = JSON.parse(localStorage.getItem('adminMedia') || '[]');
        mediaFiles.splice(index, 1);
        localStorage.setItem('adminMedia', JSON.stringify(mediaFiles));
        displayUploadedFiles();
    }
}

// Export media function
const exportMediaBtn = document.getElementById('exportMediaBtn');
if (exportMediaBtn) {
    exportMediaBtn.addEventListener('click', () => {
        const mediaFiles = JSON.parse(localStorage.getItem('adminMedia') || '[]');
        
        if (mediaFiles.length === 0) {
            alert('Нет медиа-файлов для экспорта');
            return;
        }
        
        // Create JSON file with media data
        const dataStr = JSON.stringify(mediaFiles, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'zipseoul-media-' + new Date().getTime() + '.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('Медиа-файлы экспортированы в JSON. Данные в base64 формате можно использовать для восстановления.');
    });
}

// Initialize default products if adminProducts is empty
function initializeDefaultProducts() {
    // Don't initialize default products - collections should be empty
    // Collections start empty and admin adds products manually
}

// Initialize
initializeDefaultProducts();
loadProducts();
displayUploadedFiles();

