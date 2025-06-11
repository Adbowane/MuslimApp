// Script pour la page À propos

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la page À propos
    initAboutPage();
    
    // Mise à jour du compteur de panier
    cartManager.updateCartCount();
    
    // Gestion de la recherche
    setupSearch();
});

function initAboutPage() {
    // Gestion des FAQ
    setupFAQ();
    
    // Animation d'apparition des sections
    animateOnScroll();
}

// Configuration des FAQ
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item h3');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const faqItem = item.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Fermer toutes les autres FAQ
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== faqItem) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle la FAQ cliquée
            faqItem.classList.toggle('active', !isActive);
        });
    });
}

// Animation au scroll
function animateOnScroll() {
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
    
    // Observer les sections
    const sections = document.querySelectorAll('.about-content, .faq-item');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
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

// Fonction pour smooth scroll vers les sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}