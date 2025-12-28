// Product Page Script
// Load products from file or localStorage
async function loadAdminProductData() {
    try {
        // First try to load from products-data.json file
        try {
            const response = await fetch('products-data.json');
            if (response.ok) {
                const fileData = await response.json();
                if (fileData.products && fileData.products.length > 0) {
                    return fileData.products;
                }
            }
        } catch (e) {
            console.log('products-data.json not found, using localStorage');
        }
        
        // Fallback to localStorage
        const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        if (adminProducts.length > 0) {
            return adminProducts;
        }
    } catch (e) {
        console.error('Error loading admin products:', e);
    }
    return null;
}

const defaultProductData = {
    dresses: [],
    blouses: [],
    skirts: [],
    accessories: []
};

// Category names mapping
const categoryNames = {
    dresses: 'Платья',
    blouses: 'Блузки',
    skirts: 'Юбки',
    accessories: 'Аксессуары'
};

// Get product data from URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category') || 'dresses';
const productId = parseInt(urlParams.get('id')) || 0;
const isAdminProduct = urlParams.get('admin') === 'true';

// Load and display product
async function initializeProduct() {
    let product;
    
    if (isAdminProduct) {
        // Load admin products
        const allAdminProducts = await loadAdminProductData();
        
        if (allAdminProducts && allAdminProducts[productId]) {
            const adminProduct = allAdminProducts[productId];
            // Convert admin product format to display format
            product = {
                title: adminProduct.title || 'Название товара',
                description: adminProduct.description || '',
                material: adminProduct.material || '',
                article: adminProduct.article || '',
                images: adminProduct.images || [],
                video: adminProduct.video || null,
                colors: adminProduct.colors || [],
                sizes: adminProduct.sizes || []
            };
        } else {
            // Fallback if product not found
            product = {
                title: 'Товар не найден',
                description: 'Товар не найден в базе данных',
                material: '',
                article: '',
                images: [],
                colors: [],
                sizes: []
            };
        }
    } else {
        // Use default data (empty now)
        product = defaultProductData[category] && defaultProductData[category][productId] 
            ? defaultProductData[category][productId] 
            : {
                title: 'Товар не найден',
                description: 'Товар не найден',
                material: '',
                article: '',
                images: [],
                colors: [],
                sizes: []
            };
    }

    // Update breadcrumbs
    document.getElementById('breadcrumbCategory').textContent = categoryNames[category] || 'Категория';
    document.getElementById('breadcrumbProduct').textContent = product.title;

    // Update product details
    document.getElementById('productTitle').textContent = product.title || 'Название товара';

    // Handle description - check if it exists and is not empty
    const description = product.description || '';
    const material = product.material || '';
    let descriptionHTML = '';

    if (description) {
        descriptionHTML += `<p>${description}</p>`;
    } else {
        descriptionHTML += `<p>Описание товара будет загружено здесь</p>`;
    }

    if (material) {
        descriptionHTML += `<p><strong>Материал:</strong> ${material}</p>`;
    }

    document.getElementById('productDescription').innerHTML = descriptionHTML;
    document.getElementById('productArticle').textContent = product.article || '-';
    document.getElementById('productCategory').textContent = categoryNames[category] || 'Категория';

    // Set main image
    const mainImage = document.getElementById('mainProductImage');
    const firstImage = (product.images && product.images.length > 0) ? product.images[0] : 
                       (product.src || 'https://via.placeholder.com/800?text=No+Image');
    mainImage.src = firstImage;
    mainImage.alt = product.title;

    // Create thumbnails
    const thumbnailsContainer = document.getElementById('productThumbnails');
    thumbnailsContainer.innerHTML = '';
    const imagesToShow = product.images || (product.src ? [product.src] : []);
    imagesToShow.forEach((imgSrc, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        thumbnail.alt = `${product.title} - фото ${index + 1}`;
        thumbnail.className = index === 0 ? 'thumbnail active' : 'thumbnail';
        thumbnail.addEventListener('click', () => {
            mainImage.src = imgSrc;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        thumbnailsContainer.appendChild(thumbnail);
    });

    // Create color options
    const colorOptions = document.getElementById('colorOptions');
    colorOptions.innerHTML = '';
    if (product.colors && product.colors.length > 0) {
        product.colors.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = index === 0 ? 'color-option active' : 'color-option';
            colorOption.style.backgroundColor = color.value;
            colorOption.title = color.name;
            colorOption.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
                colorOption.classList.add('active');
            });
            colorOptions.appendChild(colorOption);
        });
    }

    // Create size options
    const sizeOptions = document.getElementById('sizeOptions');
    sizeOptions.innerHTML = '';
    if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach((size, index) => {
            const sizeOption = document.createElement('button');
            sizeOption.className = index === 0 ? 'size-option active' : 'size-option';
            sizeOption.textContent = size;
            sizeOption.addEventListener('click', () => {
                document.querySelectorAll('.size-option').forEach(s => s.classList.remove('active'));
                sizeOption.classList.add('active');
            });
            sizeOptions.appendChild(sizeOption);
        });
    }

    // Quantity selector
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');

    decreaseBtn.addEventListener('click', () => {
        const current = parseInt(quantityInput.value);
        if (current > 1) {
            quantityInput.value = current - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        const current = parseInt(quantityInput.value);
        quantityInput.value = current + 1;
    });

    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(product.title);
            
            let shareUrl = '';
            switch(platform) {
                case 'email':
                    shareUrl = `mailto:?subject=${title}&body=${url}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'vk':
                    shareUrl = `https://vk.com/share.php?url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title} ${url}`;
                    break;
                case 'pinterest':
                    shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${product.images[0]}&description=${title}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProduct);
} else {
    initializeProduct();
}
