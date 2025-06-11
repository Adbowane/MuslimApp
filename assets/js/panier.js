// Script pour la page Panier

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la page panier
    initCartPage();
    
    // Mise à jour du compteur de panier
    cartManager.updateCartCount();
    
    // Gestion de la recherche
    setupSearch();
});

function initCartPage() {
    displayCart();
    setupPromoCode();
}

// Variables globales pour le panier
let discount = 0;
const validPromoCodes = {
    'PROMO10': 0.1,
    'WELCOME15': 0.15,
    'STUDENT20': 0.2
};

// Affichage du panier
function displayCart() {
    const cartTableBody = document.getElementById('cartTableBody');
    const cart = cartManager.cart;
    
    cartTableBody.innerHTML = '';
    
    if (cart.length === 0) {
        displayEmptyCart();
        return;
    }
    
    // Grouper les articles identiques
    const groupedCart = groupCartItems(cart);
    
    Object.values(groupedCart).forEach((item, index) => {
        const row = createCartRow(item, index);
        cartTableBody.appendChild(row);
    });
    
    updateCartTotal();
}

// Grouper les articles du panier
function groupCartItems(cart) {
    return cart.reduce((acc, item) => {
        const key = `${item.id}-${item.selectedColor || item.color}-${item.selectedSize || 'standard'}`;
        if (!acc[key]) {
            acc[key] = { 
                ...item, 
                quantity: 0,
                originalIndex: cart.indexOf(item)
            };
        }
        acc[key].quantity += 1;
        return acc;
    }, {});
}

// Créer une ligne du panier
function createCartRow(item, index) {
    const row = document.createElement('tr');
    const total = (item.price * item.quantity).toFixed(2);
    
    row.innerHTML = `
        <td data-label="Produit">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80?text=${encodeURIComponent(item.name)}'">
        </td>
        <td data-label="Nom">
            <strong>${item.name}</strong><br>
            <small>Couleur: ${item.selectedColor || item.color}</small><br>
            <small>Taille: ${item.selectedSize || 'Standard'}</small>
        </td>
        <td data-label="Quantité">
            <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)" class="quantity-input">
        </td>
        <td data-label="Prix Unitaire">${item.price.toFixed(2)} €</td>
        <td data-label="Total"><strong>${total} €</strong></td>
        <td data-label="Action">
            <button onclick="removeFromCart(${index})" class="remove-btn" title="Supprimer">
                🗑️ Supprimer
            </button>
        </td>
    `;
    
    return row;
}

// Afficher un panier vide
function displayEmptyCart() {
    const cartTableBody = document.getElementById('cartTableBody');
    cartTableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; padding: 3rem;">
                <div style="color: #666;">
                    <h3 style="margin-bottom: 1rem;">Votre panier est vide</h3>
                    <p style="margin-bottom: 2rem;">Découvrez nos produits et ajoutez-les à votre panier !</p>
                    <a href="catalogue.html" style="background: linear-gradient(45deg, #2c3e50, #34495e); color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 25px;">
                        Voir le catalogue
                    </a>
                </div>
            </td>
        </tr>
    `;
    
    // Masquer le résumé si le panier est vide
    const cartSummary = document.querySelector('.cart-summary');
    if (cartSummary) {
        cartSummary.style.display = 'none';
    }
}

// Mettre à jour la quantité
function updateQuantity(index, quantity) {
    const groupedCart = Object.values(groupCartItems(cartManager.cart));
    const item = groupedCart[index];
    const key = `${item.id}-${item.selectedColor || item.color}-${item.selectedSize || 'standard'}`;
    
    // Supprimer tous les articles de ce type
    cartManager.cart = cartManager.cart.filter(c => 
        `${c.id}-${c.selectedColor || c.color}-${c.selectedSize || 'standard'}` !== key
    );
    
    // Ajouter la nouvelle quantité
    for (let i = 0; i < parseInt(quantity); i++) {
        cartManager.cart.push({ ...item, quantity: 1 });
    }
    
    cartManager.saveCart();
    displayCart();
    cartManager.updateCartCount();
}

// Supprimer du panier
function removeFromCart(index) {
    const groupedCart = Object.values(groupCartItems(cartManager.cart));
    const item = groupedCart[index];
    const key = `${item.id}-${item.selectedColor || item.color}-${item.selectedSize || 'standard'}`;
    
    // Confirmation
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${item.name}" de votre panier ?`)) {
        cartManager.cart = cartManager.cart.filter(c => 
            `${c.id}-${c.selectedColor || c.color}-${c.selectedSize || 'standard'}` !== key
        );
        
        cartManager.saveCart();
        displayCart();
        cartManager.updateCartCount();
        
        showNotification(`${item.name} supprimé du panier`);
    }
}

// Mettre à jour le total
function updateCartTotal() {
    const total = cartManager.getTotal();
    const discountedTotal = total * (1 - discount);
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (discount > 0) {
        cartTotalElement.innerHTML = `
            <div>Sous-total: ${total.toFixed(2)} €</div>
            <div style="color: #27ae60;">Réduction (${(discount * 100).toFixed(0)}%): -${(total * discount).toFixed(2)} €</div>
            <div style="font-size: 1.2em; margin-top: 0.5rem;"><strong>Total: ${discountedTotal.toFixed(2)} €</strong></div>
        `;
    } else {
        cartTotalElement.textContent = `Total: ${total.toFixed(2)} €`;
    }
    
    // Afficher le résumé si le panier n'est pas vide
    const cartSummary = document.querySelector('.cart-summary');
    if (cartSummary && cartManager.cart.length > 0) {
        cartSummary.style.display = 'block';
    }
}

// Configuration du code promo
function setupPromoCode() {
    const promoInput = document.getElementById('promoCode');
    if (promoInput) {
        promoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
}

// Appliquer le code promo
function applyPromoCode() {
    const promoCode = document.getElementById('promoCode').value.toUpperCase().trim();
    
    if (!promoCode) {
        showNotification('Veuillez entrer un code promo', 'error');
        return;
    }
    
    if (validPromoCodes[promoCode]) {
        discount = validPromoCodes[promoCode];
        updateCartTotal();
        showNotification(`Code promo "${promoCode}" appliqué ! Réduction de ${(discount * 100).toFixed(0)}%`);
        
        // Désactiver le champ et le bouton
        document.getElementById('promoCode').disabled = true;
        document.querySelector('.promo-code button').disabled = true;
        document.querySelector('.promo-code button').textContent = 'Appliqué ✓';
    } else {
        showNotification('Code promo invalide', 'error');
        document.getElementById('promoCode').value = '';
    }
}

// Simuler la commande
function simulateCheckout() {
    if (cartManager.cart.length === 0) {
        showNotification('Votre panier est vide !', 'error');
        return;
    }
    
    const total = cartManager.getTotal() * (1 - discount);
    
    // Animation de chargement
    const checkoutBtn = document.querySelector('.checkout-btn');
    const originalText = checkoutBtn.textContent;
    checkoutBtn.textContent = 'Traitement en cours...';
    checkoutBtn.disabled = true;
    
    setTimeout(() => {
        showSuccessMessage(total);
        cartManager.clear();
        displayCart();
        
        // Réinitialiser le code promo
        discount = 0;
        document.getElementById('promoCode').disabled = false;
        document.getElementById('promoCode').value = '';
        document.querySelector('.promo-code button').disabled = false;
        document.querySelector('.promo-code button').textContent = 'Appliquer';
        
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;
    }, 2000);
}

// Message de succès pour la commande
function showSuccessMessage(total) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        text-align: center;
        max-width: 400px;
        animation: popIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="color: #27ae60; font-size: 3rem; margin-bottom: 1rem;">✅</div>
        <h3 style="color: #2c3e50; margin-bottom: 1rem;">Commande validée !</h3>
        <p style="color: #666; margin-bottom: 1rem;">
            Votre commande d'un montant de <strong>${total.toFixed(2)} €</strong> a été traitée avec succès.
        </p>
        <p style="color: #666; font-size: 0.9rem;">
            Vous recevrez un email de confirmation sous peu.
        </p>
    `;
    
    // Overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
    
    // Fermer après 4 secondes
    setTimeout(() => {
        notification.style.animation = 'popIn 0.3s ease reverse';
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 300);
    }, 4000);
    
    // Fermer en cliquant sur l'overlay
    overlay.addEventListener('click', () => {
        notification.style.animation = 'popIn 0.3s ease reverse';
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 300);
    });
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
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'linear-gradient(45deg, #e74c3c, #c0392b)' : 'linear-gradient(45deg, #27ae60, #2ecc71)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
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

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes popIn {
        from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    .quantity-input {
        width: 80px;
        padding: 0.5rem;
        border: 2px solid #ecf0f1;
        border-radius: 8px;
        text-align: center;
        transition: border-color 0.3s ease;
    }
    
    .quantity-input:focus {
        border-color: #e74c3c;
        outline: none;
    }
    
    .remove-btn {
        background: linear-gradient(45deg, #e74c3c, #c0392b);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .remove-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
    }
`;
document.head.appendChild(style);