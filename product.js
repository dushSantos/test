// Product Page Script
// Load products from admin panel if available
function loadAdminProductData() {
    try {
        const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        if (adminProducts.length > 0) {
            const organizedData = {
                dresses: [],
                blouses: [],
                skirts: [],
                accessories: []
            };
            
            adminProducts.forEach((product) => {
                if (organizedData[product.category]) {
                    organizedData[product.category].push(product);
                }
            });
            
            return organizedData;
        }
    } catch (e) {
        console.error('Error loading admin products:', e);
    }
    return null;
}

const adminProductData = loadAdminProductData();
const defaultProductData = {
    dresses: [
        {
            title: 'Вечернее платье',
            description: 'Роскошное вечернее платье из премиального материала. Идеально подходит для особых случаев и торжественных мероприятий.',
            images: [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
                'https://images.unsplash.com/photo-1566479179817-4de02f5b58c2?w=800',
                'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800'
            ],
            colors: [
                { name: 'Черный', value: '#000000' },
                { name: 'Белый', value: '#ffffff' },
                { name: 'Красный', value: '#dc143c' }
            ],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)', 'XL (54-56)'],
            article: 'DR-001',
            material: 'Шелк, полиэстер'
        },
        {
            title: 'Повседневное платье',
            description: 'Стильное платье для повседневной носки. Комфортное и элегантное решение для любого дня.',
            images: [
                'https://images.unsplash.com/photo-1566479179817-4de02f5b58c2?w=800',
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'
            ],
            colors: [
                { name: 'Бежевый', value: '#f5f5dc' },
                { name: 'Голубой', value: '#87ceeb' },
                { name: 'Розовый', value: '#ffc0cb' }
            ],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'DR-002',
            material: 'Хлопок, эластан'
        },
        {
            title: 'Летнее платье',
            description: 'Легкое и воздушное летнее платье. Идеально для жаркой погоды и летних прогулок.',
            images: [
                'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
                'https://images.unsplash.com/photo-1566479179817-4de02f5b58c2?w=800'
            ],
            colors: [
                { name: 'Белый', value: '#ffffff' },
                { name: 'Желтый', value: '#ffff00' },
                { name: 'Оранжевый', value: '#ffa500' }
            ],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)', 'XL (54-56)'],
            article: 'DR-003',
            material: 'Лен, хлопок'
        },
        {
            title: 'Офисное платье',
            description: 'Деловое платье для офиса. Строгий и элегантный крой для деловых встреч.',
            images: [
                'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'
            ],
            colors: [
                { name: 'Черный', value: '#000000' },
                { name: 'Серый', value: '#808080' },
                { name: 'Синий', value: '#0000ff' }
            ],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'DR-004',
            material: 'Полиэстер, вискоза'
        },
        {
            title: 'Коктейльное платье',
            description: 'Элегантное коктейльное платье для вечеринок и праздников.',
            images: [
                'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
                'https://images.unsplash.com/photo-1566479179817-4de02f5b58c2?w=800'
            ],
            colors: [
                { name: 'Красный', value: '#dc143c' },
                { name: 'Золотой', value: '#ffd700' },
                { name: 'Серебряный', value: '#c0c0c0' }
            ],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)', 'XL (54-56)'],
            article: 'DR-005',
            material: 'Атлас, полиэстер'
        },
        {
            title: 'Платье-миди',
            description: 'Классическое платье средней длины. Универсальный вариант для любого случая.',
            images: [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
                'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800'
            ],
            colors: [
                { name: 'Черный', value: '#000000' },
                { name: 'Белый', value: '#ffffff' },
                { name: 'Бежевый', value: '#f5f5dc' }
            ],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'DR-006',
            material: 'Хлопок, эластан'
        }
    ],
    blouses: [
        {
            title: 'Классическая блузка',
            description: 'Белая классическая блузка для делового стиля.',
            images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'],
            colors: [{ name: 'Белый', value: '#ffffff' }, { name: 'Черный', value: '#000000' }],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'BL-001',
            material: 'Хлопок'
        },
        {
            title: 'Шелковая блузка',
            description: 'Роскошная шелковая блузка премиального качества.',
            images: ['https://images.unsplash.com/photo-1566479179817-4de02f5b58c2?w=800'],
            colors: [{ name: 'Бежевый', value: '#f5f5dc' }, { name: 'Розовый', value: '#ffc0cb' }],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)', 'XL (54-56)'],
            article: 'BL-002',
            material: 'Шелк'
        },
        {
            title: 'Блузка с воротником',
            description: 'Элегантная блузка с декоративным воротником.',
            images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
            colors: [{ name: 'Белый', value: '#ffffff' }, { name: 'Голубой', value: '#87ceeb' }],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'BL-003',
            material: 'Хлопок, полиэстер'
        },
        {
            title: 'Блузка-рубашка',
            description: 'Стильная блузка в стиле рубашки.',
            images: ['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800'],
            colors: [{ name: 'Белый', value: '#ffffff' }, { name: 'Полосатая', value: '#000000' }],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'BL-004',
            material: 'Хлопок'
        },
        {
            title: 'Блузка с бантом',
            description: 'Романтичная блузка с бантом.',
            images: ['https://images.unsplash.com/photo-1566479179817-4de02f5b58c2?w=800'],
            colors: [{ name: 'Белый', value: '#ffffff' }, { name: 'Розовый', value: '#ffc0cb' }],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'BL-005',
            material: 'Шелк, полиэстер'
        }
    ],
    skirts: [
        {
            title: 'Юбка-карандаш',
            description: 'Классическая юбка-карандаш для делового стиля.',
            images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'],
            colors: [{ name: 'Черный', value: '#000000' }, { name: 'Серый', value: '#808080' }],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'SK-001',
            material: 'Полиэстер, эластан'
        },
        {
            title: 'Пышная юбка',
            description: 'Романтичная пышная юбка для особых случаев.',
            images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
            colors: [{ name: 'Белый', value: '#ffffff' }, { name: 'Розовый', value: '#ffc0cb' }],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)', 'XL (54-56)'],
            article: 'SK-002',
            material: 'Тюль, полиэстер'
        },
        {
            title: 'Мини-юбка',
            description: 'Стильная мини-юбка для современного образа.',
            images: ['https://images.unsplash.com/photo-1566479179817-4de02f5b58c2?w=800'],
            colors: [{ name: 'Черный', value: '#000000' }, { name: 'Синий', value: '#0000ff' }],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'SK-003',
            material: 'Деним'
        },
        {
            title: 'Длинная юбка',
            description: 'Элегантная длинная юбка для особых случаев.',
            images: ['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800'],
            colors: [{ name: 'Черный', value: '#000000' }, { name: 'Бежевый', value: '#f5f5dc' }],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'SK-004',
            material: 'Вискоза, эластан'
        },
        {
            title: 'Юбка с плиссировкой',
            description: 'Современная юбка с плиссировкой для стильного образа.',
            images: ['https://images.unsplash.com/photo-1566479179817-4de02f5b58c2?w=800'],
            colors: [{ name: 'Черный', value: '#000000' }, { name: 'Серый', value: '#808080' }],
            sizes: ['S (42-44)', 'M (46-48)', 'L (50-52)'],
            article: 'SK-005',
            material: 'Полиэстер'
        }
    ],
    accessories: [
        {
            title: 'Сумка',
            description: 'Элегантная кожаная сумка премиального качества.',
            images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'],
            colors: [{ name: 'Черный', value: '#000000' }, { name: 'Коричневый', value: '#8b4513' }],
            sizes: ['Один размер'],
            article: 'AC-001',
            material: 'Натуральная кожа'
        },
        {
            title: 'Шарф',
            description: 'Шелковый шарф для завершения образа.',
            images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
            colors: [{ name: 'Разноцветный', value: '#ff69b4' }, { name: 'Синий', value: '#0000ff' }],
            sizes: ['Один размер'],
            article: 'AC-002',
            material: 'Шелк'
        },
        {
            title: 'Украшения',
            description: 'Эксклюзивные украшения для особых случаев.',
            images: ['https://images.unsplash.com/photo-1566479179817-4de02f5b58c2?w=800'],
            colors: [{ name: 'Золото', value: '#ffd700' }, { name: 'Серебро', value: '#c0c0c0' }],
            sizes: ['Один размер'],
            article: 'AC-003',
            material: 'Металл, кристаллы'
        },
        {
            title: 'Обувь',
            description: 'Стильная обувь для завершения образа.',
            images: ['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800'],
            colors: [{ name: 'Черный', value: '#000000' }, { name: 'Бежевый', value: '#f5f5dc' }],
            sizes: ['36', '37', '38', '39', '40'],
            article: 'AC-004',
            material: 'Кожа, замша'
        },
        {
            title: 'Ремень',
            description: 'Кожаный ремень для стильного образа.',
            images: ['https://images.unsplash.com/photo-1566479179817-4de02f5b58c2?w=800'],
            colors: [{ name: 'Черный', value: '#000000' }, { name: 'Коричневый', value: '#8b4513' }],
            sizes: ['S', 'M', 'L'],
            article: 'AC-005',
            material: 'Натуральная кожа'
        },
        {
            title: 'Шляпа',
            description: 'Элегантная шляпа для стильного образа.',
            images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'],
            colors: [{ name: 'Черный', value: '#000000' }, { name: 'Бежевый', value: '#f5f5dc' }],
            sizes: ['Один размер'],
            article: 'AC-006',
            material: 'Фетр, ткань'
        }
    ]
};

// Get product data from URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category') || 'dresses';
const productId = parseInt(urlParams.get('id')) || 0;
const isAdminProduct = urlParams.get('admin') === 'true';

// Use admin data if available and product is from admin panel
let product;

if (isAdminProduct) {
    // Find product by index in all admin products
    const allAdminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const adminProduct = allAdminProducts[productId];
    
    if (adminProduct) {
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
        product = defaultProductData.dresses[0];
    }
} else {
    product = defaultProductData[category] && defaultProductData[category][productId] 
        ? defaultProductData[category][productId] 
        : defaultProductData.dresses[0];
}

// Category names mapping
const categoryNames = {
    dresses: 'Платья',
    blouses: 'Блузки',
    skirts: 'Юбки',
    accessories: 'Аксессуары'
};

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

// Create size options
const sizeOptions = document.getElementById('sizeOptions');
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

