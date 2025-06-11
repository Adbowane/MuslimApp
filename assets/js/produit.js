// Script pour la page produit

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la page produit
    initProductPage();
    
    // Mise à jour du compteur de panier
    cartManager.updateCartCount();
    
    // Gestion de la recherche
    setupSearch();
});

let currentProduct = null;

function initProductPage() {
    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    // Charger les détails du produit
    loadProductDetails(productId);
    
    // Configurer les interactions
    setupImageZoom();
    setupSimilarProducts(productId);
}

// Charger les détails du produit
function loadProductDetails(productId) {
    currentProduct = getProductById(productId);
    
    if (!currentProduct) {
        showError('Produit non trouvé');
        return;
    }
    
    // Mettre à jour les éléments de la page
    updateProductDisplay();
}

// Mettre à jour l'affichage du produit
function updateProductDisplay() {
    if (!currentProduct) return;
    
    // Titre de la page
    document.title = `MShop - ${currentProduct.name}`;
    
    // Image du produit
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.src = currentProduct.image;
        productImage.alt = currentProduct.name;
        productImage.onerror = function() {
            this.src = `https://via.placeholder.com/500?text=${encodeURIComponent(currentProduct.name)}`;
        };
    }
    
    // Nom du produit
    const productName = document.getElementById('productName');
    if (productName) {
        productName.textContent = currentProduct.name;
    }
    
    // Prix du produit
    const productPrice = document.getElementById('productPrice');
    if (productPrice) {
        productPrice.textContent = `${currentProduct.price.toFixed(2)} €`;
    }
    
    // Description du produit
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.textContent = currentProduct.description;
    }
    
    // Badge nouveauté
    if (currentProduct.newest) {
        addNewBadge();
    }
    
    // Mettre à jour les options de couleur
    updateColorOptions();
}

// Ajouter un badge nouveauté
function addNewBadge() {
    const productInfo = document.querySelector('.product-info');
    if (productInfo && !productInfo.querySelector('.new-badge')) {
        const badge = document.createElement('span');
        badge.className = 'new-badge';
        badge.textContent = 'Nouveau';
        badge.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(231, 76, 60, 0.3);
        `;
        productInfo.style.position = 'relative';
        productInfo.appendChild(badge);
    }
}

// Mettre à jour les options de couleur
function updateColorOptions() {
    const colorSelect = document.getElementById('color');
    if (!colorSelect) return;
    
    // Sélectionner la couleur du produit par défaut
    const options = colorSelect.querySelectorAll('option');
    options.forEach(option => {
        if (option.value === currentProduct.color) {
            option.selected = true;
        }
    });
}

// Configuration du zoom d'image
function setupImageZoom() {
    const productImage = document.getElementById('productImage');
    if (!productImage) return;
    
    productImage.addEventListener('click', () => {
        productImage.classList.toggle('zoomed');
    });
    
    // Fermer le zoom en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (e.target !== productImage && productImage.classList.contains('zoomed')) {
            productImage.classList.remove('zoomed');
        }
    });
}

// Ajouter au panier
function addToCart() {
    if (!currentProduct) return;
    
    const color = document.getElementById('color').value;
    const size = document.getElementById('size').value;
    
    const options = {
        color: color,
        size: size
    };
    
    cartManager.addItem(currentProduct, options);
    
    // Animation du bouton
    const addButton = document.querySelector('.add-to-cart');
    const originalText = addButton.textContent;
    
    addButton.textContent = 'Ajouté ! ✓';
    addButton.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
    addButton.disabled = true;
    
    setTimeout(() => {
        addButton.textContent = originalText;
        addButton.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
        addButton.disabled = false;
    }, 2000);
    
    showNotification(`${currentProduct.name} ajouté au panier !`);
}

// Configuration des produits similaires
function setupSimilarProducts(currentProductId) {
    const similarProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProductId)
        .slice(0, 3);
    
    displaySimilarProducts(similarProducts);
}

// Afficher les produits similaires
function displaySimilarProducts(similarProducts) {
    const similarProductsGrid = document.getElementById('similarProducts');
    if (!similarProductsGrid) return;
    
    similarProductsGrid.innerHTML = '';
    
    if (similarProducts.length === 0) {
        similarProductsGrid.innerHTML = `
            <p style="text-align: center; color: #666; grid-column: 1 / -1;">
                Aucun produit similaire trouvé.
            </p>
        `;
        return;
    }
    
    similarProducts.forEach(product => {
        const productCard = createSimilarProductCard(product);
        similarProductsGrid.appendChild(productCard);
    });
}

// Créer une carte produit similaire
function createSimilarProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    const newBadge = product.newest ? 
        '<span style="position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Nouveau</span>' : '';
    
    productCard.innerHTML = `
        ${newBadge}
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250?text=${encodeURIComponent(product.name)}'">
        <h3>${product.name}</h3>
        <p>${product.price.toFixed(2)} €</p>
        <button onclick="goToProduct(${product.id})">Voir le produit</button>
    `;
    
    return productCard;
}

// Aller vers un autre produit
function goToProduct(productId) {
    window.location.href = `produit.html?id=${productId}`;
}

// Afficher une erreur
function showError(message) {
    const productDetail = document.querySelector('.product-detail');
    if (productDetail) {
        productDetail.innerHTML = `
            <div style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                <h2 style="color: #e74c3c; margin-bottom: 1rem;">Erreur</h2>
                <p style="color: #666; margin-bottom: 2rem;">${message}</p>
                <a href="catalogue.html" style="background: linear-gradient(45deg, #2c3e50, #34495e); color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 25px;">
                    Retour au catalogue
                </a>
            </div>
        `;
    }
}

// Gestion de la recherche
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length > 2) {
            window.location.href = `catalogue.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });
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

// Navigation avec les flèches du clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        const prevProduct = products.find(p => p.id === currentProduct.id - 1);
        if (prevProduct) {
            goToProduct(prevProduct.id);
        }
    } else if (e.key === 'ArrowRight') {
        const nextProduct = products.find(p => p.id === currentProduct.id + 1);
        if (nextProduct) {
            goToProduct(nextProduct.id);
        }
    }
});