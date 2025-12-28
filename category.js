// Category Page Script
// Load products from admin panel if available
function loadAdminProducts() {
    try {
        const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        if (adminProducts.length > 0) {
            const organizedData = {
                dresses: [],
                blouses: [],
                skirts: [],
                accessories: []
            };
            
            adminProducts.forEach((product, index) => {
                const productData = {
                    type: product.video ? 'video' : 'image',
                    src: product.video || (product.images && product.images[0]) || '',
                    poster: product.images && product.images[0] || '',
                    title: product.title,
                    description: product.description,
                    category: product.category,
                    article: product.article,
                    material: product.material,
                    colors: product.colors,
                    sizes: product.sizes,
                    images: product.images,
                    video: product.video,
                    adminIndex: index
                };
                
                if (organizedData[product.category]) {
                    organizedData[product.category].push(productData);
                }
            });
            
            return organizedData;
        }
    } catch (e) {
        console.error('Error loading admin products:', e);
    }
    return null;
}

const adminData = loadAdminProducts();
// No default products - only show products from admin panel
const defaultCategoryData = {
    dresses: {
        title: 'Платья',
        description: 'Элегантные платья для любого случая',
        products: []
    },
    blouses: {
        title: 'Блузки',
        description: 'Стильные блузки для создания идеального образа',
        products: []
    },
    skirts: {
        title: 'Юбки',
        description: 'Разнообразные юбки для создания неповторимого стиля',
        products: []
    },
    accessories: {
        title: 'Аксессуары',
        description: 'Стильные аксессуары для завершения образа',
        products: []
    }
};

// Get category type from URL
const urlParams = new URLSearchParams(window.location.search);
const categoryType = urlParams.get('type') || 'dresses';

// Load category data (use admin data if available, otherwise use default)
let categoryData = defaultCategoryData;
let category = categoryData[categoryType] || categoryData.dresses;

if (adminData) {
    // Use admin data structure
    const adminCategory = adminData[categoryType] || [];
    category = {
        title: getCategoryTitle(categoryType),
        description: getCategoryDescription(categoryType),
        products: adminCategory // Will be empty array if no products in this category
    };
}

function getCategoryTitle(type) {
    const titles = {
        dresses: 'Платья',
        blouses: 'Блузки',
        skirts: 'Юбки',
        accessories: 'Аксессуары'
    };
    return titles[type] || 'Категория';
}

function getCategoryDescription(type) {
    const descriptions = {
        dresses: 'Элегантные платья для любого случая',
        blouses: 'Стильные блузки для создания идеального образа',
        skirts: 'Разнообразные юбки для создания неповторимого стиля',
        accessories: 'Стильные аксессуары для завершения образа'
    };
    return descriptions[type] || 'Коллекция товаров';
}

// Update page title and header
document.getElementById('categoryTitle').textContent = category.title;
document.getElementById('categoryDescription').textContent = category.description;
document.title = `${category.title} - ZipSeoul`;

// Render products
const productsGrid = document.getElementById('productsGrid');

// Get products array (from admin or default empty)
const productsToShow = category.products || [];

if (productsToShow.length === 0) {
    productsGrid.innerHTML = '<div style="text-align: center; padding: 60px; color: #999;"><p style="font-size: 1.2rem; margin-bottom: 10px;">Товары не найдены</p><p>Добавьте товары через админ-панель</p></div>';
} else {
    productsToShow.forEach((product, index) => {
        const productItem = document.createElement('a');
        productItem.className = 'product-item';
        
        // Use admin index if available, otherwise use regular index
        const productId = product.adminIndex !== undefined ? product.adminIndex : index;
        const productCategory = product.category || categoryType;
        
        productItem.href = `product.html?category=${productCategory}&id=${productId}&admin=${product.adminIndex !== undefined ? 'true' : 'false'}`;
        productItem.style.textDecoration = 'none';
        productItem.style.color = 'inherit';
        
        const firstImage = product.images && product.images.length > 0 ? product.images[0] : product.src;
        
        if (product.type === 'video' || product.video) {
            const video = document.createElement('video');
            video.src = product.video || product.src;
            video.poster = firstImage;
            video.controls = true;
            video.muted = false;
            video.loop = false;
            video.className = 'product-media';
            productItem.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = firstImage;
            img.alt = product.title;
            img.className = 'product-media';
            productItem.appendChild(img);
        }
        
        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';
        productInfo.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
        `;
        productItem.appendChild(productInfo);
        
        productsGrid.appendChild(productItem);
    });
}

// Animate products on load
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

document.querySelectorAll('.product-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});

