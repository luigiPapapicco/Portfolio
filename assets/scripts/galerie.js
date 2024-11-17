// Écouteur d'événement qui déclenche le code une fois le DOM chargé
document.addEventListener('DOMContentLoaded', () => {
  // Sélectionne le conteneur de la galerie d'images
  const galleryContainer = document.getElementById('gallery-container')

  // Sélectionne tous les boutons de filtre
  const filterButtons = document.querySelectorAll('.filter-btn')

  // Sélectionne l'élément modal pour afficher les détails du projet
  const modal = document.getElementById('project-modal')

  // Sélectionne le contenu de la modal où les détails du projet seront insérés
  const modalContent = modal.querySelector('.modal-content')

  // Déclare un tableau pour stocker les projets et un tableau pour les filtres actifs
  let projects = []
  let activeFilters = ['Tous'] // Par défaut, le filtre "Tous" est activé

  // Cache la modal au démarrage
  modal.style.display = 'none'

  // Active le bouton "Tous" par défaut
  document
    .querySelector('.filter-btn[data-filter="Tous"]')
    .classList.add('active')

  // Fonction asynchrone pour charger les projets depuis un fichier JSON
  async function loadProjects() {
    try {
      // Charge le fichier JSON
      const response = await fetch('./assets/data/data.json')

      // Parse le JSON en objet JavaScript
      const data = await response.json()

      // Charge la section "projects" de l'objet JSON
      projects = data.projects

      // Affiche tous les projets au démarrage
      displayProjects()
    } catch (error) {
      // Affiche un message d'erreur en cas d'échec du chargement
      console.error('Erreur lors du chargement des projets:', error)
    }
  }

  // Fonction pour afficher les projets en fonction des filtres actifs
  function displayProjects() {
    // Vide le conteneur de la galerie
    galleryContainer.innerHTML = ''

    // Filtre les projets selon les filtres actifs ou montre tous les projets si "Tous" est activé
    const filteredProjects = activeFilters.includes('Tous')
      ? projects
      : projects.filter((project) =>
          activeFilters.every((filter) => project.tags.includes(filter))
        )

    // Pour chaque projet filtré, crée un élément de carte de projet
    filteredProjects.forEach((project) => {
      const projectCard = document.createElement('div')
      projectCard.classList.add('project-card')
      projectCard.innerHTML = `
        <img src="${project.image}" alt="${project.title}">`

      // Ajoute un écouteur pour ouvrir la modal au clic
      projectCard.addEventListener('click', () => openModal(project))

      // Ajoute la carte au conteneur de la galerie
      galleryContainer.appendChild(projectCard)
    })
  }

  // Gestion des clics sur les boutons de filtre
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Récupère le filtre associé au bouton cliqué
      const filter = button.dataset.filter

      if (filter === 'Tous') {
        // Si le filtre "Tous" est cliqué, réinitialise les filtres
        activeFilters = ['Tous']

        // Retire le style actif de tous les boutons
        filterButtons.forEach((btn) => btn.classList.remove('active'))

        // Active le style pour le bouton "Tous"
        button.classList.add('active')
      } else {
        // Si un autre filtre est cliqué, retire "Tous" de la liste des filtres actifs
        activeFilters = activeFilters.filter((f) => f !== 'Tous')

        // Retire le style actif du bouton "Tous"
        filterButtons.forEach((btn) => {
          if (btn.dataset.filter === 'Tous') btn.classList.remove('active')
        })

        // Ajoute ou retire le filtre de la liste active
        if (activeFilters.includes(filter)) {
          activeFilters = activeFilters.filter((f) => f !== filter)
          button.classList.remove('active')
        } else {
          activeFilters.push(filter)
          button.classList.add('active')
        }
      }

      // Si aucun filtre n'est actif, réactive "Tous" par défaut
      if (activeFilters.length === 0) {
        activeFilters = ['Tous']
        document
          .querySelector('.filter-btn[data-filter="Tous"]')
          .classList.add('active')
      }

      // Met à jour l'affichage des projets en fonction des filtres
      displayProjects()
    })
  })

  // Fonction pour ouvrir la modal avec les détails du projet
  function openModal(project) {
    if (project) {
      // Insère les détails du projet dans la modal
      modalContent.innerHTML = `
      <div class="modal-box">
      <span class="close-btn">&times;</span>
      <h2>${project.title}</h2>
      <p>${project.description}</p>
      <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
      <a href="${project.link}" target="_blank">Voir le projet</a>
      </div>
      `
      // Affiche la modal
      modal.style.display = 'flex'

      // Ajoute un écouteur pour fermer la modal au clic sur le bouton de fermeture
      const closeButton = modalContent.querySelector('.close-btn')
      closeButton.addEventListener('click', closeModal)
    }
  }

  // Fonction pour fermer la modal
  function closeModal() {
    // Masque la modal
    modal.style.display = 'none'

    // Vide le contenu de la modal
    modalContent.innerHTML = ''
  }

  // Ferme la modal lorsqu'un clic est détecté à l'extérieur de son contenu
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal()
    }
  })

  // Charge les projets au démarrage
  loadProjects()
})
