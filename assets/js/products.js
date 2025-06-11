// Données des produits centralisées
const products = [
    {
        id: 1,
        name: "Hijab Chiffon Premium",
        price: 19.99,
        category: "hijab",
        color: "noir",
        image: "assets/images/products/hijab-1.jpg",
        description: "Ce hijab en chiffon premium offre une texture légère et fluide, idéale pour un port quotidien. Conçu pour allier élégance et confort.",
        newest: false
    },
    {
        id: 2,
        name: "Sous-Hijab Coton",
        price: 9.99,
        category: "sous-hijab",
        color: "blanc",
        image: "assets/images/products/sous-hijab-1.jpg",
        description: "Sous-hijab en coton doux pour un confort optimal sous votre hijab.",
        newest: true
    },
    {
        id: 3,
        name: "Épingle Perle",
        price: 4.99,
        category: "epingle",
        color: "beige",
        image: "assets/images/products/epingle-1.jpg",
        description: "Épingle élégante avec perle décorative pour maintenir votre hijab en place.",
        newest: false
    },
    {
        id: 4,
        name: "Hijab Satin Luxe",
        price: 24.99,
        category: "hijab",
        color: "bleu",
        image: "assets/images/products/hijab-2.jpg",
        description: "Hijab en satin pour une touche d'élégance et de sophistication.",
        newest: true
    },
    {
        id: 5,
        name: "Accessoire Brodé",
        price: 14.99,
        category: "accessoire",
        color: "noir",
        image: "assets/images/products/accessoire-1.jpg",
        description: "Accessoire brodé pour compléter votre tenue avec style.",
        newest: false
    },
    {
        id: 6,
        name: "Hijab Modal",
        price: 22.99,
        category: "hijab",
        color: "beige",
        image: "assets/images/products/hijab-3.jpg",
        description: "Hijab en modal doux et respirant, parfait pour toutes les saisons.",
        newest: false
    },
    {
        id: 7,
        name: "Sous-Hijab Bambou",
        price: 12.99,
        category: "sous-hijab",
        color: "blanc",
        image: "assets/images/products/sous-hijab-2.jpg",
        description: "Sous-hijab en fibre de bambou, antibactérien et ultra-doux.",
        newest: true
    },
    {
        id: 8,
        name: "Épingle Magnétique",
        price: 7.99,
        category: "epingle",
        color: "noir",
        image: "assets/images/products/epingle-2.jpg",
        description: "Épingle magnétique innovante pour un maintien parfait sans percer le tissu.",
        newest: true
    }
];

// Fonctions utilitaires pour les produits
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

function getProductsByCategory(category) {
    if (!category) return products;
    return products.filter(product => product.category === category);
}

function searchProducts(searchTerm) {
    if (!searchTerm) return products;
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

function filterProducts(filters) {
    let filteredProducts = [...products];

    if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }

    if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.colors && filters.colors.length > 0) {
        filteredProducts = filteredProducts.filter(p => filters.colors.includes(p.color));
    }

    if (filters.search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(filters.search.toLowerCase())
        );
    }

    return filteredProducts;
}

function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-asc':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'newest':
            return sortedProducts.sort((a, b) => b.newest - a.newest);
        default:
            return sortedProducts;
    }
}

// Gestion du panier
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addItem(product, options = {}) {
        const cartItem = {
            ...product,
            selectedColor: options.color || product.color,
            selectedSize: options.size || 'standard',
            quantity: 1,
            addedAt: new Date().toISOString()
        };
        
        this.cart.push(cartItem);
        this.saveCart();
        this.updateCartCount();
        return cartItem;
    }

    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
        } else {
            this.cart[index].quantity = quantity;
            this.saveCart();
            this.updateCartCount();
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + (item.quantity || 1), 0);
    }

    clear() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }
}

// Instance globale du gestionnaire de panier
const cartManager = new CartManager();

// Initialisation du compteur de panier au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    cartManager.updateCartCount();
});