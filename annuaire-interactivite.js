// Nouveau dossier/annuaire-interactivite.js

document.addEventListener('DOMContentLoaded', function() {
    const annuaireSearchInput = document.getElementById('annuaireSearchInput');
    const annuaireFilterService = document.getElementById('annuaireFilterService');
    const annuaireSearchBtn = document.getElementById('annuaireSearchBtn');
    const annuaireResetBtn = document.getElementById('annuaireResetBtn');
    const annuaireResultsContainer = document.getElementById('annuaire-results-container');
    const annuaireResultsCount = document.getElementById('annuaireResultsCount');

    let allAnnuaireProfessionals = []; // CHANGEMENT : Stocke les professionnels (médecins, paramédicaux)

    // Fonction pour charger les données des professionnels
    function fetchAnnuaireProfessionals() { // CHANGEMENT
        fetch('annuaire-services.json') // Assurez-vous que le chemin est correct
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur de chargement des professionnels: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                allAnnuaireProfessionals = data;
                populateServiceFilterDropdown(data); // Peuple la liste déroulante avec les services
                filterAndSearchAnnuaireProfessionals(); // Affiche tous les professionnels au chargement initial
            })
            .catch(error => console.error("Erreur lors du chargement des professionnels:", error));
    }

    // Fonction pour peupler la liste déroulante des services (à partir des professionnels)
    function populateServiceFilterDropdown(professionals) { // CHANGEMENT
        const uniqueServices = new Set();
        professionals.forEach(p => uniqueServices.add(JSON.stringify({ id: p.service_id, title: p.service_title }))); // Utilise un Set pour les services uniques
        
        annuaireFilterService.innerHTML = '<option value="all" selected>- Tous les services -</option>'; // Option par défaut
        
        Array.from(uniqueServices).map(str => JSON.parse(str)).sort((a,b) => a.title.localeCompare(b.title)).forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = service.title;
            annuaireFilterService.appendChild(option);
        });
    }

    // Fonction pour afficher la liste des professionnels filtrés
    function renderAnnuaireProfessionalsList(professionalsToDisplay) { // CHANGEMENT
        annuaireResultsContainer.innerHTML = ''; // Vider le conteneur actuel
        if (professionalsToDisplay.length === 0) {
            annuaireResultsContainer.innerHTML = '<p class="text-center text-muted mt-4">Aucun professionnel trouvé pour votre recherche.</p>';
        } else {
            professionalsToDisplay.forEach(p => { // CHANGEMENT : itère sur les professionnels
                const listItem = document.createElement('div');
                listItem.classList.add('list-item'); // Utilise la classe existante pour le style

                let contactInfo = '';
                if (p.contact_direct) contactInfo += `<p>Tél. : <a href="tel:${p.contact_direct.replace(/\s/g, '')}">${p.contact_direct}</a></p>`;
                if (p.email) contactInfo += `<p>Email : <a href="mailto:${p.email}">${p.email}</a></p>`;
                
                listItem.innerHTML = `
                    <h3>${p.name}</h3>
                    <p class="professional-specialty">${p.specialty}</p>
                    <p class="professional-service-title">Service : ${p.service_title}</p>
                    ${contactInfo}
                `;
                annuaireResultsContainer.appendChild(listItem);
            });
        }
        annuaireResultsCount.textContent = professionalsToDisplay.length;
    }

    // Fonction de filtrage et de recherche des professionnels
    function filterAndSearchAnnuaireProfessionals() { // CHANGEMENT
        const searchTerm = annuaireSearchInput.value.toLowerCase();
        const selectedServiceId = annuaireFilterService.value;

        let filteredProfessionals = allAnnuaireProfessionals.filter(p => { // CHANGEMENT : filtre les professionnels
            // Filtrage par service sélectionné
            const serviceMatch = (selectedServiceId === 'all' || p.service_id === selectedServiceId);
            
            // Recherche par terme (nom, spécialité, titre du service)
            const searchMatch = p.name.toLowerCase().includes(searchTerm) ||
                                p.specialty.toLowerCase().includes(searchTerm) ||
                                p.service_title.toLowerCase().includes(searchTerm);

            return serviceMatch && searchMatch;
        });

        renderAnnuaireProfessionalsList(filteredProfessionals); // CHANGEMENT
    }

    // Écouteurs d'événements
    if (annuaireSearchInput) {
        annuaireSearchInput.addEventListener('keyup', filterAndSearchAnnuaireProfessionals);
    }
    if (annuaireFilterService) {
        annuaireFilterService.addEventListener('change', filterAndSearchAnnuaireProfessionals);
    }
    if (annuaireSearchBtn) {
        annuaireSearchBtn.addEventListener('click', filterAndSearchAnnuaireProfessionals);
    }
    if (annuaireResetBtn) {
        annuaireResetBtn.addEventListener('click', function() {
            annuaireSearchInput.value = '';
            annuaireFilterService.value = 'all';
            filterAndSearchAnnuaireProfessionals();
        });
    }

    // Lancement de la récupération des données au chargement de la page
    fetchAnnuaireProfessionals(); // CHANGEMENT
});