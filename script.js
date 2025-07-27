document.addEventListener('DOMContentLoaded', function() {

    // Fonction pour charger et insérer un fragment HTML
    function loadHTML(filePath, elementId) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                const placeholder = document.getElementById(elementId);
                if (placeholder) {
                    placeholder.innerHTML = html;
                    // Initialiser la logique de la barre de navigation après son chargement
                    if (elementId === 'mainHeaderPlaceholder' || elementId === 'ifmsHeaderPlaceholder') {
                        initDropdowns();
                        highlightActiveNav();
                        initSearchOverlay();
                    }
                } else {
                    console.error(`Element with ID '${elementId}' not found.`); // Ajout d'un message d'erreur si le placeholder n'est pas trouvé
                }
            })
            .catch(e => console.error(`Failed to load ${filePath}:`, e));
    }

    const currentPage = window.location.pathname.split('/').pop();

    // Détecter la page actuelle pour charger le bon header et footer
    if (['ifms.html', 'institut.html', 'demarchequalite.html', 'lesformations.html', 'vieetudiante.html', 'demandedemutation.html', 'inscriptionsresultats.html'].includes(currentPage)) {
        loadHTML('ifms-header.html', 'ifmsHeaderPlaceholder');
        loadHTML('ifms-footer.html', 'ifmsFooterPlaceholder'); // CORRIGÉ : Utilise 'ifmsFooterPlaceholder'
    } else {
        loadHTML('header.html', 'mainHeaderPlaceholder');
        loadHTML('footer.html', 'mainFooterPlaceholder'); // CORRIGÉ : Utilise 'mainFooterPlaceholder'
    }
    
    loadHTML('top-bar.html', 'topBarPlaceholder');


    // --- Logique pour les menus déroulants (Header) ---
    function initDropdowns() {
        document.querySelectorAll('.dropdown > a').forEach(item => {
            // Supprimer les écouteurs d'événements existants pour éviter les duplications
            item.removeEventListener('click', handleDropdownClick);
            item.removeEventListener('mouseenter', handleDropdownHoverEnter);
            item.removeEventListener('mouseleave', handleDropdownHoverLeave);

            // Ajouter les écouteurs appropriés
            item.addEventListener('click', handleDropdownClick);
            
            // Pour le survol sur les écrans larges
            if (window.innerWidth > 992) {
                item.addEventListener('mouseenter', handleDropdownHoverEnter);
                item.addEventListener('mouseleave', handleDropdownHoverLeave);
            }
        });
    }

    function handleDropdownClick(e) {
        if (window.innerWidth <= 992) {
            const dropdownMenu = this.nextElementSibling;
            if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                if (!dropdownMenu.classList.contains('show')) {
                    e.preventDefault();

                    document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                        if (openMenu !== dropdownMenu) { // S'assurer de ne pas fermer le menu actuel si réactivé par clic
                            openMenu.classList.remove('show');
                            if (openMenu.previousElementSibling) {
                                openMenu.previousElementSibling.classList.remove('active-dropdown-link');
                            }
                        }
                    });
                    
                    dropdownMenu.classList.add('show');
                    this.classList.add('active-dropdown-link');
                } else {
                    window.location.href = this.href; // Navigue si le menu est déjà ouvert et on clique à nouveau
                }
            }
        }
    }

    function handleDropdownHoverEnter() {
        if (window.innerWidth > 992) {
            const dropdownMenu = this.nextElementSibling;
            if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                    if (openMenu !== dropdownMenu) { // S'assurer de ne pas fermer le menu actuel
                        openMenu.classList.remove('show');
                        if (openMenu.previousElementSibling) {
                            openMenu.previousElementSibling.classList.remove('active-dropdown-link');
                        }
                    }
                });
                dropdownMenu.classList.add('show');
                this.classList.add('active-dropdown-link');
            }
        }
    }

    function handleDropdownHoverLeave() {
        if (window.innerWidth > 992) {
            const dropdownMenu = this.nextElementSibling;
            if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                setTimeout(() => {
                    if (!this.matches(':hover') && !dropdownMenu.matches(':hover')) { // Ferme si la souris quitte le lien ET le dropdown
                        dropdownMenu.classList.remove('show');
                        this.classList.remove('active-dropdown-link');
                    }
                }, 100);
            }
        }
    }

    // Fermer les menus déroulants si on clique en dehors
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992) { // Sur mobile/tablette
            if (!event.target.closest('.dropdown') && !event.target.closest('.main-nav') && !event.target.closest('.header-actions')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                    openMenu.classList.remove('show');
                    if (openMenu.previousElementSibling) {
                        openMenu.previousElementSibling.classList.remove('active-dropdown-link');
                    }
                });
            }
        }
    });

    // Surligner la navigation active
    function highlightActiveNav() {
        const currentPath = window.location.pathname.split('/').pop();
        // Cible les liens de navigation dans la nouvelle structure Bootstrap
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            // Nettoyer les classes actives précédentes
            link.classList.remove('active', 'active-dropdown-link');
            link.removeAttribute('aria-current');

            const linkPath = link.getAttribute('href') ? link.getAttribute('href').split('/').pop() : '';

            // Surligner le lien direct de la page
            if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
            // Logique pour les sous-pages de dropdowns (si le lien est un parent de dropdown)
            else if (link.classList.contains('dropdown-toggle')) {
                // Pour les dropdowns parents, vérifier si une de leurs sous-pages est active
                const dropdownItems = link.nextElementSibling ? link.nextElementSibling.querySelectorAll('.dropdown-item') : [];
                let isParentActive = false;
                dropdownItems.forEach(item => {
                    const itemPath = item.getAttribute('href') ? item.getAttribute('href').split('/').pop().split('#')[0] : ''; // Ignorer les ancres
                    if (itemPath === currentPath) {
                        isParentActive = true;
                    }
                });
                if (isParentActive) {
                    link.classList.add('active', 'active-dropdown-link');
                }
            }
        });
    }


    // --- Logique pour les accordéons (patients.html) ---
    function initAccordions() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');

        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const isActive = this.classList.contains('active');

                document.querySelectorAll('.accordion-header.active').forEach(openHeader => {
                    if (openHeader !== this) {
                        openHeader.classList.remove('active');
                        openHeader.nextElementSibling.classList.remove('show');
                    }
                });

                this.classList.toggle('active');
                content.classList.toggle('show');
            });
        });
    }

    // --- Logique pour l'overlay de recherche ---
    function initSearchOverlay() {
        // Cible le bouton de recherche dans la nouvelle navbar Bootstrap
        const searchToggle = document.querySelector('.navbar .btn-link.search-icon-btn');
        // L'overlay de recherche est maintenant directement dans le header.html / ifms-header.html
        const searchOverlay = document.querySelector('.search-overlay');
        const closeSearch = document.querySelector('.search-overlay .close-search-overlay');
        const searchInput = document.querySelector('.search-overlay #searchInput'); // S'assurer que l'input a un ID

        if (searchToggle && searchOverlay && closeSearch && searchInput) {
            // Nettoyer les écouteurs pour éviter les duplications lors de loadHTML
            searchToggle.removeEventListener('click', openSearch);
            closeSearch.removeEventListener('click', closeSearchOverlay);
            searchOverlay.removeEventListener('click', closeSearchOnClickOutside);
            document.removeEventListener('keydown', closeSearchOnEscape); // Écouteur global, à nettoyer avec précaution

            // Ajouter les écouteurs
            searchToggle.addEventListener('click', openSearch);
            closeSearch.addEventListener('click', closeSearchOverlay);
            searchOverlay.addEventListener('click', closeSearchOnClickOutside);
            document.addEventListener('keydown', closeSearchOnEscape);
        }

        function openSearch() {
            searchOverlay.classList.add('show');
            searchInput.focus();
        }

        function closeSearchOverlay() {
            searchOverlay.classList.remove('show');
            searchInput.value = '';
        }

        function closeSearchOnClickOutside(event) {
            if (event.target === searchOverlay) {
                closeSearchOverlay();
            }
        }

        function closeSearchOnEscape(event) {
            if (event.key === 'Escape' && searchOverlay.classList.contains('show')) {
                closeSearchOverlay();
            }
        }
    }

    // Initialisation des composants au chargement du DOM
    initAccordions();
    // initSearchOverlay et initDropdowns sont appelés par loadHTML après le chargement du header
});