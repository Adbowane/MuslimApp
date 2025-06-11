// Script principal pour la page d'accueil

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du carousel
    initCarousel();
    
    // Affichage des produits phares
    displayFeaturedProducts();
    
    // Gestion de la recherche
    setupSearch();
    
    // Mise à jour du compteur de panier
    cartManager.updateCartCount();
});

// Gestion du carousel
let currentSlide = 0;
const totalSlides = 3;

function initCarousel() {
    const carouselImages = document.getElementById('carouselImages');
    if (!carouselImages) return;
    
    // Auto-slide toutes les 5 secondes
    setInterval(() => moveCarousel(1), 5000);
}

function moveCarousel(direction) {
    const carouselImages = document.getElementById('carouselImages');
    if (!carouselImages) return;
    
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    carouselImages.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Affichage des produits phares
function displayFeaturedProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    // Afficher les 4 premiers produits
    const featuredProducts = products.slice(0, 4);
    
    productGrid.innerHTML = '';
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Création d'une carte produit
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250?text=${encodeURIComponent(product.name)}'">
        <h3>${product.name}</h3>
        <p>${product.price.toFixed(2)} €</p>
        <button onclick="addToCartFromCard(${product.id})">Ajouter au panier</button>
    `;
    
    // Ajouter un événement de clic pour aller vers la page produit
    productCard.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            window.location.href = `pages/produit.html?id=${product.id}`;
        }
    });
    
    return productCard;
}

// Ajouter un produit au panier depuis une carte
function addToCartFromCard(productId) {
    const product = getProductById(productId);
    if (product) {
        cartManager.addItem(product);
        showNotification(`${product.name} ajouté au panier !`);
    }
}

// Gestion de la recherche
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length > 2) {
            // Rediriger vers la page catalogue avec le terme de recherche
            window.location.href = `pages/catalogue.html?search=${encodeURIComponent(searchTerm)}`;
        } else if (searchTerm.length === 0) {
            // Réafficher tous les produits phares
            displayFeaturedProducts();
        }
    });
    
    // Recherche en temps réel sur la page d'accueil
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length > 0 && searchTerm.length <= 2) {
            const filteredProducts = searchProducts(searchTerm).slice(0, 4);
            displayFilteredProducts(filteredProducts);
        }
    });
}

// Affichage des produits filtrés
function displayFilteredProducts(filteredProducts) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1;">Aucun produit trouvé.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Notification simple
function showNotification(message) {
    // Créer une notification simple
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #27ae60, #2ecc71);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Gestion des liens de catégories
document.addEventListener('click', (e) => {
    if (e.target.matches('.category-links a')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        window.location.href = href;
    }
});