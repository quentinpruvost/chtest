// NOUVEAU-SCRIPT.JS - Logique pour le header sticky

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.main-header');

    if (header) {
        // Seuil de défilement pour activer l'effet sticky
        // (10 pixels pour un effet rapide)
        const scrollThreshold = 10; 

        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                // Ajoute la classe 'sticky' si l'utilisateur a défilé vers le bas
                header.classList.add('sticky');
            } else {
                // Retire la classe 'sticky' si l'utilisateur est en haut de la page
                header.classList.remove('sticky');
            }
        });
    }

    // Vous pouvez garder ici vos autres fonctions JS existantes
    // comme l'initialisation de l'overlay de recherche ou les accordéons.
    // Par exemple, si vous avez une fonction initSearchOverlay() dans votre
    // script.js, vous pouvez l'appeler ici.
    // initSearchOverlay(); 
});