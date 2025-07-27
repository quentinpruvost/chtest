// dropdown-arrow.js - Gère la rotation des flèches des menus déroulants

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionne tous les éléments de menu qui ont une classe 'dropdown'
    const dropdowns = document.querySelectorAll('.main-nav .dropdown');

    dropdowns.forEach(dropdown => {
        // Trouve l'icône de flèche à l'intérieur de chaque élément dropdown
        const arrowIcon = dropdown.querySelector('.fa-chevron-down');

        if (arrowIcon) {
            // Ajoute un écouteur pour le survol de la souris (entrée)
            dropdown.addEventListener('mouseenter', () => {
                arrowIcon.classList.add('rotate');
            });

            // Ajoute un écouteur pour la fin du survol (sortie)
            dropdown.addEventListener('mouseleave', () => {
                arrowIcon.classList.remove('rotate');
            });
        }
    });
});