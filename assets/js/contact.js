// Script pour la page Contact

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la page contact
    initContactPage();
    
    // Mise à jour du compteur de panier
    cartManager.updateCartCount();
    
    // Gestion de la recherche
    setupSearch();
});

function initContactPage() {
    // Configuration du formulaire
    setupFormValidation();
    
    // Animation d'apparition
    animateOnScroll();
}

// Configuration de la validation du formulaire
function setupFormValidation() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    // Validation en temps réel
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
}

// Validation d'un champ
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Le nom doit contenir au moins 2 caractères.';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide.';
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Le message doit contenir au moins 10 caractères.';
            }
            break;
    }
    
    showFieldError(field, isValid, errorMessage);
    return isValid;
}

// Afficher/masquer l'erreur d'un champ
function showFieldError(field, isValid, errorMessage) {
    const errorElement = document.getElementById(`${field.name}Error`);
    
    if (isValid) {
        errorElement.style.display = 'none';
        field.style.borderColor = '#27ae60';
    } else {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
        field.style.borderColor = '#e74c3c';
    }
}

// Effacer l'erreur lors de la saisie
function clearError(field) {
    const errorElement = document.getElementById(`${field.name}Error`);
    errorElement.style.display = 'none';
    field.style.borderColor = '#ecf0f1';
}

// Validation complète du formulaire
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    const isNameValid = validateField(name);
    const isEmailValid = validateField(email);
    const isMessageValid = validateField(message);
    
    const isFormValid = isNameValid && isEmailValid && isMessageValid;
    
    if (isFormValid) {
        submitForm();
    }
    
    return isFormValid;
}

// Soumission du formulaire
function submitForm() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Animation de chargement
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simulation d'envoi
    setTimeout(() => {
        showSuccessMessage();
        resetForm();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Afficher le message de succès
function showSuccessMessage() {
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
    notification.innerHTML = `
        <strong>Message envoyé !</strong><br>
        Nous vous répondrons dans les plus brefs délais.
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Réinitialiser le formulaire
function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    
    // Réinitialiser les styles
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '#ecf0f1';
    });
    
    // Masquer les erreurs
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => {
        error.style.display = 'none';
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
    
    const sections = document.querySelectorAll('.contact-form, .contact-info');
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