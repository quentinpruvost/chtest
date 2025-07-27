// Nouveau dossier/soins-interactivite.js

document.addEventListener('DOMContentLoaded', function() {
    const poleSelect = document.getElementById('pole-select');
    const allPoleContainers = document.querySelectorAll('.pole-container'); // Conteneurs des grilles de services par pôle

    const specialtiesOverviewSection = document.getElementById('specialites-overview');
    const serviceDetailSection = document.getElementById('service-detail-section');
    const serviceContentArea = document.getElementById('service-content-area');
    
    const backToSpecialtiesBtn = document.getElementById('backToSpecialtiesBtn');
    const viewServiceButtons = document.querySelectorAll('.view-service-btn');

    let servicesData = []; // Pour stocker les données JSON des services

    // Charger les données des services depuis le fichier JSON
    fetch('services-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de chargement du JSON: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            servicesData = data;
            // Initialiser l'affichage après le chargement des données
            const urlParams = new URLSearchParams(window.location.search);
            const serviceParam = urlParams.get('service');
            const poleParam = urlParams.get('pole'); // NOUVEAU : Récupérer le paramètre 'pole'

            if (serviceParam) {
                const initialService = servicesData.find(s => s.id === serviceParam);
                if (initialService) {
                    renderServiceDetail(initialService);
                    activateMajorView('service-detail', true);
                } else {
                    activateMajorView('specialties-overview', false);
                    poleSelect.value = 'all';
                }
            } else if (poleParam) { // NOUVEAU : Gérer le paramètre 'pole'
                if (poleSelect) {
                    const optionExists = Array.from(poleSelect.options).some(option => option.value === poleParam);
                    if (optionExists) {
                        poleSelect.value = poleParam; // Sélectionner le pôle dans le filtre
                    } else {
                        poleSelect.value = 'all'; // Revenir à "Tous les pôles" si le pôle n'existe pas
                    }
                }
                activateMajorView('specialties-overview', true); // Afficher la vue d'ensemble et défiler vers elle
                displayOnlyThisPoleGrid(poleSelect.value === 'all' ? 'all-poles-container' : `${poleSelect.value}-container`);
            }
            else {
                activateMajorView('specialties-overview', false);
                poleSelect.value = 'all';
            }
        })
        .catch(error => console.error("Erreur lors du chargement des services:", error));


    // Helper function to show only one pole grid within the overview
    function displayOnlyThisPoleGrid(selectedPoleId) {
        allPoleContainers.forEach(container => {
            container.style.display = 'none';
            container.classList.remove('active');
        });

        const targetGrid = document.getElementById(selectedPoleId);
        if (targetGrid) {
            targetGrid.style.display = 'grid'; // Utiliser 'grid' si c'est une grille CSS
            targetGrid.classList.add('active');
        }
    }

    // Helper function to switch between major views (overview vs. service detail)
    function activateMajorView(viewId, doScroll = true) {
        specialtiesOverviewSection.style.display = 'none';
        serviceDetailSection.style.display = 'none';

        if (viewId === 'specialties-overview') {
            specialtiesOverviewSection.style.display = 'block';
            // S'assurer que le bon pôle est affiché si on revient à la vue d'ensemble
            displayOnlyThisPoleGrid(poleSelect.value === 'all' ? 'all-poles-container' : `${poleSelect.value}-container`);
            if (doScroll) {
                window.scrollTo({ top: specialtiesOverviewSection.offsetTop - 100, behavior: 'smooth' });
            }
        } else if (viewId === 'service-detail') {
            serviceDetailSection.style.display = 'block';
            if (doScroll) {
                window.scrollTo({ top: serviceDetailSection.offsetTop - 100, behavior: 'smooth' });
            }
        }
    }

    // Fonction pour générer et injecter le HTML du détail d'un service
    function renderServiceDetail(service) {
        let highlightsHtml = '';
        if (service.highlights && service.highlights.length > 0) {
            highlightsHtml = `<div class="service-highlights">`;
            service.highlights.forEach(h => {
                highlightsHtml += `
                    <div class="highlight-card">
                        <i class="${h.icon || 'fas fa-info-circle'} card-icon"></i>
                        <h3>${h.title}</h3>
                        <p>${h.description}</p>
                        <a href="${h.link}" class="btn-link">Cliquez ici</a>
                    </div>
                `;
            });
            highlightsHtml += `</div>`;
        }

        let detailsListHtml = '';
        if (service.details_list && service.details_list.length > 0) {
            detailsListHtml = `
                <div class="service-details-list">
                    <h3>${service.details_list_heading || 'Détails des prises en charge'}</h3>
                    <ul>`;
            service.details_list.forEach(item => {
                detailsListHtml += `<li><i class="fas fa-circle-check"></i> ${item}</li>`;
            });
            detailsListHtml += `</ul></div>`;
        }

        let additionalInfoHtml = '';
        if (service.additional_info && service.additional_info.length > 0) {
            service.additional_info.forEach(info => {
                additionalInfoHtml += `<p>${info}</p>`;
            });
        }

        let teamHtml = '';
        if (service.team && service.team.length > 0) {
            teamHtml = `
                <div class="service-team">
                    <h4 class="section-subtitle green-text">${service.team_heading || "L'équipe"}</h4>
                    <p>${service.team_intro || "Rencontrez l'équipe médicale et soignante du service"}</p>
                    <div class="team-list">`;
            service.team.forEach(member => {
                teamHtml += `
                    <div class="team-member">
                        <i class="${member.icon || 'fas fa-user-md'}"></i>
                        <p>${member.role}</p>
                        ${member.name ? `<p>${member.name}</p>` : ''}
                    </div>
                `;
            });
            teamHtml += `</div></div>`;
        }

        const serviceHtml = `
            <h2 class="section-title text-left">${service.title}</h2>
            <div class="service-header-info">
                <div class="info-block">
                    <h3>Chef du service</h3>
                    <p>${service.chef_service}</p>
                </div>
                <div class="info-block">
                    <h3>Adresse</h3>
                    <p>${service.adresse.replace(/\n/g, '<br>')}</p>
                    ${service.adresse_link ? `<a href="${service.adresse_link}" class="btn-link">Voir le plan</a>` : ''}
                </div>
                <div class="info-block">
                    <h3>Horaires</h3>
                    <p>${service.horaires.replace(/\n/g, '<br>')}</p>
                </div>
                <div class="info-block">
                    <h3>Adresse e-mail</h3>
                    <p><a href="mailto:${service.email}">${service.email}</a></p>
                </div>
                <div class="info-block">
                    <h3>Téléphone</h3>
                    <p><a href="tel:${service.phone.replace(/\s/g, '')}">${service.phone}</a></p>
                </div>
                <div class="info-block action-block">
                    <a href="${service.rdv_button_link}" class="btn-primary">${service.rdv_button_text}</a>
                </div>
            </div>

            <div class="service-intro">
                <h4 class="section-subtitle green-text">Description du service</h4>
                ${service.intro_desc.map(p => `<p>${p}</p>`).join('')}
            </div>

            ${highlightsHtml}
            
            <div class="service-media service-media-flex">
                <div class="service-media-image-wrapper">
                    <img src="${service.main_image}" alt="Image du service ${service.title}">
                </div>
                <div class="service-media-text-content">
                    <h4 class="section-subtitle green-text">${service.title} en images</h4>
                    <p>${service.media_description || 'Découvrez notre service en images et apprenez-en plus sur nos équipements et nos équipes.'}</p>
                </div>
            </div>
            
            ${detailsListHtml}
            ${additionalInfoHtml}
            ${teamHtml}
        `;

        serviceContentArea.innerHTML = serviceHtml;
    }


    // --- Écouteurs d'événements ---

    if (poleSelect) {
        poleSelect.addEventListener('change', function() {
            displayOnlyThisPoleGrid(this.value === 'all' ? 'all-poles-container' : `${this.value}-container`);
            // Pas de défilement ici, car on reste dans la même vue
        });
    }

    viewServiceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceId = this.dataset.targetService;
            const service = servicesData.find(s => s.id === serviceId);
            if (service) {
                renderServiceDetail(service);
                activateMajorView('service-detail', true);
            } else {
                alert(`Détails pour le service "${serviceId}" non trouvés.`);
            }
        });
    });

    if (backToSpecialtiesBtn) {
        backToSpecialtiesBtn.addEventListener('click', function() {
            activateMajorView('specialties-overview', true);
            // Quand on revient à la vue d'ensemble, réinitialiser la sélection si nécessaire ou laisser le pôle actif
            // Pour réinitialiser le filtre à 'all' :
            poleSelect.value = 'all';
            displayOnlyThisPoleGrid('all-poles-container'); // Afficher tous les pôles
        });
    }

});