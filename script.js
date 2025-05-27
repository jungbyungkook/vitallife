// Cart functionality
let cart = [];
let cartCount = 0;

// DOM elements
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const categoryButtons = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const searchInput = document.querySelector('.search-box input');
const newsletterForm = document.querySelector('.newsletter-form');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    initializeProductFiltering();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeSearch();
    initializeNewsletter();
    initializeMobileMenu();
});

// Cart Management
function initializeCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('vitallife-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }

    // Add event listeners to "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const product = extractProductInfo(productCard);
            addToCart(product);
            showAddToCartAnimation(this);
        });
    });
}

function extractProductInfo(productCard) {
    const name = productCard.querySelector('h3').textContent;
    const price = productCard.querySelector('.current-price').textContent;
    const category = productCard.getAttribute('data-category');
    const rating = productCard.querySelectorAll('.stars i.fas').length;
    
    return {
        id: Date.now() + Math.random(), // Simple ID generation
        name,
        price,
        category,
        rating,
        quantity: 1
    };
}

function addToCart(product) {
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === product.name);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    updateCartCount();
    saveCartToStorage();
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
    
    // Add animation to cart icon
    cartCountElement.parentElement.classList.add('cart-updated');
    setTimeout(() => {
        cartCountElement.parentElement.classList.remove('cart-updated');
    }, 300);
}

function saveCartToStorage() {
    localStorage.setItem('vitallife-cart', JSON.stringify(cart));
}

function showAddToCartAnimation(button) {
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.background = '#45a049';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#4CAF50';
    }, 1000);
}

// Product Filtering
function initializeProductFiltering() {
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            updateActiveCategory(this);
        });
    });
}

function filterProducts(category) {
    productCards.forEach(card => {
        const productCategory = card.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}

function updateActiveCategory(activeButton) {
    categoryButtons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .product-card, .science-card, .testimonial-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Search Functionality
function initializeSearch() {
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchProducts(searchTerm);
        });
    }
}

function searchProducts(searchTerm) {
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDescription = card.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            card.style.display = 'block';
            highlightSearchTerm(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
}

function highlightSearchTerm(card, searchTerm) {
    if (searchTerm === '') return;
    
    const title = card.querySelector('h3');
    const description = card.querySelector('p');
    
    // Simple highlighting (in a real app, you'd want more sophisticated highlighting)
    const highlightText = (element, term) => {
        const text = element.textContent;
        const regex = new RegExp(`(${term})`, 'gi');
        element.innerHTML = text.replace(regex, '<mark>$1</mark>');
    };
    
    highlightText(title, searchTerm);
    highlightText(description, searchTerm);
}

// Newsletter Subscription
function initializeNewsletter() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                subscribeToNewsletter(email);
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function subscribeToNewsletter(email) {
    // Simulate API call
    showNotification('Subscribing...', 'info');
    
    setTimeout(() => {
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        newsletterForm.querySelector('input[type="email"]').value = '';
    }, 1000);
}

// Mobile Menu
function initializeMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });

    // Set background color based on type
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3'
    };
    notification.style.backgroundColor = colors[type] || colors.success;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Product Rating Interaction
function initializeProductRatings() {
    const ratingStars = document.querySelectorAll('.product-rating .stars');
    
    ratingStars.forEach(starsContainer => {
        const stars = starsContainer.querySelectorAll('i');
        
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', function() {
                highlightStars(stars, index + 1);
            });
            
            star.addEventListener('click', function() {
                rateProduct(starsContainer, index + 1);
            });
        });
        
        starsContainer.addEventListener('mouseleave', function() {
            resetStars(stars);
        });
    });
}

function highlightStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('highlighted');
        } else {
            star.classList.remove('highlighted');
        }
    });
}

function resetStars(stars) {
    stars.forEach(star => {
        star.classList.remove('highlighted');
    });
}

function rateProduct(starsContainer, rating) {
    const productCard = starsContainer.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    
    showNotification(`You rated ${productName} ${rating} star${rating > 1 ? 's' : ''}!`);
}

// Lazy Loading for Images (if we add real images later)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .cart-updated {
        animation: bounce 0.3s ease;
    }
    
    @keyframes bounce {
        0%, 20%, 60%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        80% { transform: translateY(-5px); }
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .stars i.highlighted {
        color: #ffc107 !important;
        transform: scale(1.1);
    }
    
    mark {
        background: #ffeb3b;
        padding: 0 2px;
        border-radius: 2px;
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        padding: 1rem;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;

document.head.appendChild(style);

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeProductRatings();
    initializeLazyLoading();
});

// Export functions for potential use in other scripts
window.VitalLife = {
    addToCart,
    filterProducts,
    showNotification,
    cart
}; 