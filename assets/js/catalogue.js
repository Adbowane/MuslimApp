// Script pour la page catalogue

document.addEventListener('DOMContentLoaded', function() {
    // Variables de pagination
    const productsPerPage = 8;
    let currentPage = 1;
    let filteredProducts = [...products];
    
    // Initialisation
    initializeFilters();
    setupEventListeners();
    displayProducts();
    cartManager.updateCartCount();
});

// Initialisation des filtres depuis l'URL
function initializeFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Catégorie depuis l'URL
    const category = urlParams.get('category');
    if (category) {
        document.getElementById('category').value = category;
    }
    
    // Recherche depuis l'URL
    const search = urlParams.get('search');
    if (search) {
        document.getElementById('searchInput').value = search;
    }
}

// Configuration des événements
function setupEventListeners() {
    // Filtres
    document.getElementById('category').addEventListener('change', applyFilters);
    document.getElementById('price').addEventListener('input', updatePriceDisplay);
    document.getElementById('price').addEventListener('change', applyFilters);
    document.getElementById('sort').addEventListener('change', applyFilters);
    
    // Couleurs
    document.querySelectorAll('.color').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
    
    // Recherche
    document.getElementById('searchInput').addEventListener('input', handleSearch);
}

// Mise à jour de l'affichage du prix
function updatePriceDisplay(e) {
    document.getElementById('priceValue').textContent = `${e.target.value}€`;
}

// Application des filtres
function applyFilters() {
    const filters = {
        category: document.getElementById('category').value,
        maxPrice: parseFloat(document.getElementById('price').value),
        colors: Array.from(document.querySelectorAll('.color:checked')).map(c => c.value),
        search: document.getElementById('searchInput').value
    };
    
    filteredProducts = filterProducts(filters);
    
    // Tri
    const sortBy = document.getElementById('sort').value;
    filteredProducts = sortProducts(filteredProducts, sortBy);
    
    currentPage = 1;
    displayProducts();
}

// Gestion de la recherche
function handleSearch(e) {
    const searchTerm = e.target.value;
    
    // Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location);
    if (searchTerm) {
        url.searchParams.set('search', searchTerm);
    } else {
        url.searchParams.delete('search');
    }
    window.history.replaceState({}, '', url);
    
    applyFilters();
}

// Affichage des produits avec pagination
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);
    
    productGrid.innerHTML = '';
    
    if (paginatedProducts.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3 style="color: #666; margin-bottom: 1rem;">Aucun produit trouvé</h3>
                <p style="color: #999;">Essayez de modifier vos critères de recherche.</p>
            </div>
        `;
    } else {
        paginatedProducts.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }
    
    updatePagination();
}

// Création d'une carte produit
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Badge pour les nouveautés
    const newBadge = product.newest ? '<span style="position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Nouveau</span>' : '';
    
    productCard.innerHTML = `
        ${newBadge}
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250?text=${encodeURIComponent(product.name)}'">
        <h3>${product.name}</h3>
        <p>${product.price.toFixed(2)} €</p>
        <button onclick="addToCartFromCatalogue(${product.id})">Ajouter au panier</button>
    `;
    
    // Clic sur la carte pour aller vers la page produit
    productCard.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            window.location.href = `produit.html?id=${product.id}`;
        }
    });
    
    return productCard;
}

// Ajouter au panier depuis le catalogue
function addToCartFromCatalogue(productId) {
    const product = getProductById(productId);
    if (product) {
        cartManager.addItem(product);
        showNotification(`${product.name} ajouté au panier !`);
    }
}

// Mise à jour de la pagination
function updatePagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
    
    // Afficher les informations de pagination
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Page ${currentPage} sur ${totalPages}`;
    }
}

// Changement de page
function changePage(direction) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayProducts();
        
        // Scroll vers le haut de la grille
        document.getElementById('productGrid').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Notification
function showNotification(message) {
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}