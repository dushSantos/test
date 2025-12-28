// Vercel Serverless Function для сохранения товаров
// Этот файл должен быть в папке /api для работы на Vercel

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { products, media } = req.body;

    try {
        // Здесь будет логика сохранения через GitHub API
        // Для работы нужен GitHub Personal Access Token
        
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_REPO = process.env.GITHUB_REPO; // формат: owner/repo
        const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

        if (!GITHUB_TOKEN || !GITHUB_REPO) {
            return res.status(500).json({ 
                error: 'GitHub configuration missing. Please set GITHUB_TOKEN and GITHUB_REPO environment variables.' 
            });
        }

        // Получаем текущий SHA файла category.js
        const getFileSha = async () => {
            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_REPO}/contents/category.js?ref=${GITHUB_BRANCH}`,
                {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                return data.sha;
            }
            return null;
        };

        // Обновляем category.js с новыми товарами
        const updateCategoryFile = async (content, sha) => {
            const base64Content = Buffer.from(content).toString('base64');
            
            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_REPO}/contents/category.js`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: 'Update products from admin panel',
                        content: base64Content,
                        sha: sha,
                        branch: GITHUB_BRANCH
                    })
                }
            );

            return response.ok;
        };

        // Генерируем содержимое category.js
        const generateCategoryContent = (products) => {
            const organizedData = {
                dresses: [],
                blouses: [],
                skirts: [],
                accessories: []
            };

            products.forEach((product, index) => {
                if (organizedData[product.category]) {
                    organizedData[product.category].push({
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
                    });
                }
            });

            return `// Category Page Script
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
        products: ${JSON.stringify(organizedData.dresses, null, 8)}
    },
    blouses: {
        title: 'Блузки',
        description: 'Стильные блузки для создания идеального образа',
        products: ${JSON.stringify(organizedData.blouses, null, 8)}
    },
    skirts: {
        title: 'Юбки',
        description: 'Разнообразные юбки для создания неповторимого стиля',
        products: ${JSON.stringify(organizedData.skirts, null, 8)}
    },
    accessories: {
        title: 'Аксессуары',
        description: 'Стильные аксессуары для завершения образа',
        products: ${JSON.stringify(organizedData.accessories, null, 8)}
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
        products: adminCategory
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
document.title = \`\${category.title} - ZipSeoul\`;

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
        
        const productId = product.adminIndex !== undefined ? product.adminIndex : index;
        const productCategory = product.category || categoryType;
        
        productItem.href = \`product.html?category=\${productCategory}&id=\${productId}&admin=\${product.adminIndex !== undefined ? 'true' : 'false'}\`;
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
        productInfo.innerHTML = \`
            <h3>\${product.title}</h3>
            <p>\${product.description}</p>
        \`;
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
});`;
        };

        const fileSha = await getFileSha();
        const newContent = generateCategoryContent(products);
        const success = await updateCategoryFile(newContent, fileSha);

        if (success) {
            return res.status(200).json({ 
                success: true, 
                message: 'Products saved successfully to repository' 
            });
        } else {
            return res.status(500).json({ error: 'Failed to save products' });
        }

    } catch (error) {
        console.error('Error saving products:', error);
        return res.status(500).json({ error: error.message });
    }
}

