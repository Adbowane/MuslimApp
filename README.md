# MShop - Boutique en ligne de mode musulmane

## 📁 Structure du projet

```
MShop/
├── index.html                 # Page d'accueil
├── pages/                     # Pages du site
│   ├── catalogue.html         # Catalogue des produits
│   ├── about.html            # À propos
│   ├── contact.html          # Contact
│   ├── panier.html           # Panier d'achat
│   └── produit.html          # Détail d'un produit
├── assets/                   # Ressources du site
│   ├── css/
│   │   └── styles.css        # Styles CSS principaux
│   ├── js/                   # Scripts JavaScript
│   │   ├── products.js       # Gestion des produits et du panier
│   │   ├── main.js          # Script de la page d'accueil
│   │   ├── catalogue.js     # Script du catalogue
│   │   ├── about.js         # Script de la page à propos
│   │   ├── contact.js       # Script de contact
│   │   ├── panier.js        # Script du panier
│   │   └── produit.js       # Script de la page produit
│   └── images/              # Images du site
│       ├── products/        # Images des produits
│       ├── banners/         # Images de bannières
│       └── icons/           # Icônes
└── README.md               # Documentation
```

## 🚀 Fonctionnalités

### Pages principales
- **Accueil** : Carousel, produits phares, catégories
- **Catalogue** : Filtres, tri, pagination, recherche
- **Produit** : Détails, options, produits similaires
- **Panier** : Gestion des quantités, codes promo, commande
- **À propos** : Informations sur la marque, FAQ
- **Contact** : Formulaire de contact avec validation

### Fonctionnalités techniques
- **Responsive Design** : Compatible mobile, tablette, desktop
- **Gestion du panier** : LocalStorage, persistance des données
- **Recherche** : Recherche en temps réel dans les produits
- **Filtres** : Par catégorie, prix, couleur
- **Navigation** : Menu cohérent sur toutes les pages
- **Animations** : Transitions fluides, micro-interactions

## 🎨 Design

### Palette de couleurs
- **Primaire** : #2c3e50 (Bleu foncé)
- **Secondaire** : #e74c3c (Rouge)
- **Accent** : #f39c12 (Orange)
- **Succès** : #27ae60 (Vert)
- **Neutre** : #ecf0f1 (Gris clair)

### Typographie
- **Police** : Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Hiérarchie** : Titres en 2-3rem, texte en 1-1.1rem
- **Espacement** : Line-height de 1.6-1.8 pour la lisibilité

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 480px
- **Tablette** : 481px - 768px
- **Desktop** : > 768px

### Adaptations mobiles
- Navigation en colonne
- Grille de produits en une colonne
- Tableau du panier en cartes empilées
- Formulaires optimisés pour le tactile

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Flexbox, Grid, animations, gradients
- **JavaScript ES6+** : Classes, modules, localStorage
- **Responsive Design** : Media queries, mobile-first

## 📦 Installation et utilisation

1. **Cloner ou télécharger** le projet
2. **Ouvrir** `index.html` dans un navigateur
3. **Naviguer** entre les pages via le menu
4. **Tester** les fonctionnalités (panier, recherche, filtres)

## 🔧 Personnalisation

### Ajouter des produits
Modifier le fichier `assets/js/products.js` :

```javascript
const products = [
    {
        id: 9,
        name: "Nouveau Hijab",
        price: 29.99,
        category: "hijab",
        color: "rose",
        image: "assets/images/products/hijab-4.jpg",
        description: "Description du nouveau hijab",
        newest: true
    }
    // ... autres produits
];
```

### Modifier les styles
Éditer `assets/css/styles.css` pour personnaliser :
- Couleurs (variables CSS recommandées)
- Typographie
- Espacements
- Animations

### Ajouter des pages
1. Créer le fichier HTML dans `pages/`
2. Inclure les CSS et JS nécessaires
3. Ajouter le lien dans la navigation

## 🎯 Améliorations possibles

### Fonctionnalités
- [ ] Système de favoris
- [ ] Comparaison de produits
- [ ] Avis clients
- [ ] Newsletter
- [ ] Compte utilisateur
- [ ] Historique des commandes

### Technique
- [ ] PWA (Progressive Web App)
- [ ] Optimisation des images (WebP, lazy loading)
- [ ] Cache Service Worker
- [ ] Tests automatisés
- [ ] Intégration API de paiement

### UX/UI
- [ ] Mode sombre
- [ ] Accessibilité (ARIA, contraste)
- [ ] Animations plus poussées
- [ ] Filtres avancés
- [ ] Recommandations personnalisées

## 📞 Support

Pour toute question ou suggestion :
- **Email** : contact@mshop.fr
- **Téléphone** : +33 1 23 45 67 89

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.