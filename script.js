// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Carousel Functionality
class Carousel {
    constructor() {
        this.currentIndex = 0;
        this.carouselTrack = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.carouselDots = document.getElementById('carouselDots');
        this.items = [];
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        // Load media from admin panel (localStorage)
        const adminMedia = JSON.parse(localStorage.getItem('adminMedia') || '[]');
        
        if (adminMedia.length > 0) {
            this.items = adminMedia.map(media => {
                if (media.type === 'video') {
                    return {
                        type: 'video',
                        src: media.data,
                        poster: media.data // Use first frame or same data
                    };
                } else {
                    return {
                        type: 'image',
                        src: media.data,
                        alt: media.name || 'Gallery Image'
                    };
                }
            });
        } else {
            // Empty gallery if no media uploaded
            this.items = [];
        }

        if (this.items.length > 0) {
            this.renderCarousel();
            this.setupEventListeners();
            this.startAutoPlay();
        } else {
            // Hide carousel if no items
            if (this.carouselTrack) {
                this.carouselTrack.innerHTML = '<div style="padding: 60px; text-align: center; color: #999;">Галерея пуста. Загрузите медиа-файлы через админ-панель.</div>';
            }
        }
    }

    renderCarousel() {
        // Clear existing content
        this.carouselTrack.innerHTML = '';
        this.carouselDots.innerHTML = '';

        // Create carousel items
        this.items.forEach((item, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';

            if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.src;
                video.poster = item.poster;
                video.controls = true;
                video.muted = false;
                video.loop = false;
                carouselItem.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt || `Image ${index + 1}`;
                carouselItem.appendChild(img);
            }

            this.carouselTrack.appendChild(carouselItem);

            // Create dot
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.carouselDots.appendChild(dot);
        });

        this.updateCarousel();
    }

    updateCarousel() {
        const translateX = -this.currentIndex * 100;
        this.carouselTrack.style.transform = `translateX(${translateX}%)`;

        // Update dots
        const dots = this.carouselDots.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());

        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;

        this.carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.carouselTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}

// Initialize Carousel (only if carousel elements exist)
if (document.getElementById('carouselTrack')) {
    const carousel = new Carousel();
}


// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe collection items
document.querySelectorAll('.collection-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});

// Working Hours Indicator
const statusDot = document.getElementById('statusDot');
if (statusDot) {
    function updateWorkingHoursStatus() {
        const now = new Date();
        const currentHour = now.getHours();
        
        // Check if current time is between 10:00 and 21:00
        if (currentHour >= 10 && currentHour < 21) {
            statusDot.classList.add('active');
            statusDot.classList.remove('inactive');
        } else {
            statusDot.classList.add('inactive');
            statusDot.classList.remove('active');
        }
    }
    
    // Update on load
    updateWorkingHoursStatus();
    
    // Update every minute
    setInterval(updateWorkingHoursStatus, 60000);
}

