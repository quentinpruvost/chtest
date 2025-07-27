document.addEventListener('DOMContentLoaded', function () {
    const megaMenuTrigger = document.querySelector('.dropdown-mega');
    const megaMenu = megaMenuTrigger ? megaMenuTrigger.querySelector('.mega-menu') : null;
    let hideDelay;

    // Si les éléments n'existent pas, on ne fait rien.
    if (!megaMenuTrigger || !megaMenu) {
        return;
    }

    // Fonction pour afficher le menu
    const showMenu = () => {
        clearTimeout(hideDelay); // Annule toute action de masquage en attente
        megaMenu.classList.add('show');
    };

    // Fonction pour masquer le menu (avec un petit délai)
    const hideMenu = () => {
        hideDelay = setTimeout(() => {
            megaMenu.classList.remove('show');
        }, 250); // Délai de 250ms avant de cacher
    };

    // Écouteurs d'événements
    megaMenuTrigger.addEventListener('mouseenter', showMenu); // La souris entre sur le lien -> on montre
    megaMenuTrigger.addEventListener('mouseleave', hideMenu); // La souris quitte le lien -> on lance le timer pour cacher

    megaMenu.addEventListener('mouseenter', showMenu); // La souris entre sur le menu -> on annule le timer et on garde affiché
    megaMenu.addEventListener('mouseleave', hideMenu); // La souris quitte le menu -> on lance le timer pour cacher
});