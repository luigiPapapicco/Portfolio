document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.getElementById('gallery-container')
  const filterButtons = document.querySelectorAll('.filter-btn')
  const modal = document.getElementById('project-modal')
  const modalContent = modal.querySelector('.modal-content')

  let projects = []
  let activeFilters = ['Tous'] // Par défaut, "Tous" est sélectionné

  // Forcer la modal à être masquée au démarrage
  modal.style.display = 'none'

  // Activer le style du bouton "Tous" par défaut
  document
    .querySelector('.filter-btn[data-filter="Tous"]')
    .classList.add('active')

  // Charger les projets depuis le fichier JSON
  async function loadProjects() {
    try {
      const response = await fetch('../../assets/data/data.json')
      const data = await response.json()
      projects = data.projects // Charger uniquement la section "projects"
      displayProjects() // Afficher tous les projets au démarrage
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error)
    }
  }

  // Afficher les projets en fonction des filtres actifs
  function displayProjects() {
    galleryContainer.innerHTML = ''
    const filteredProjects = activeFilters.includes('Tous')
      ? projects
      : projects.filter((project) =>
          activeFilters.every((filter) => project.tags.includes(filter))
        )

    filteredProjects.forEach((project) => {
      const projectCard = document.createElement('div')
      projectCard.classList.add('project-card')
      projectCard.innerHTML = `
        <img src="${project.image}" alt="${project.title}">`
      projectCard.addEventListener('click', () => openModal(project))
      galleryContainer.appendChild(projectCard)
    })
  }

  // Gérer les clics sur les boutons de filtre
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter

      if (filter === 'Tous') {
        // Si "Tous" est cliqué, réinitialiser les filtres
        activeFilters = ['Tous']
        filterButtons.forEach((btn) => btn.classList.remove('active'))
        button.classList.add('active')
      } else {
        // Si un autre filtre est cliqué, retirer "Tous" de activeFilters et de l'état "active"
        activeFilters = activeFilters.filter((f) => f !== 'Tous')
        filterButtons.forEach((btn) => {
          if (btn.dataset.filter === 'Tous') btn.classList.remove('active')
        })

        // Ajouter ou retirer le filtre de la liste active
        if (activeFilters.includes(filter)) {
          activeFilters = activeFilters.filter((f) => f !== filter)
          button.classList.remove('active')
        } else {
          activeFilters.push(filter)
          button.classList.add('active')
        }
      }

      // Si aucun filtre n'est actif, activer "Tous" par défaut
      if (activeFilters.length === 0) {
        activeFilters = ['Tous']
        document
          .querySelector('.filter-btn[data-filter="Tous"]')
          .classList.add('active')
      }

      displayProjects() // Mettre à jour l'affichage des projets
    })
  })

  // Ouvrir la modal avec les détails du projet
  function openModal(project) {
    if (project) {
      modalContent.innerHTML = `
      <div class="modal-box">
      <span class="close-btn">&times;</span>
      <h2>${project.title}</h2>
      <p>${project.description}</p>
      <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
      <a href="${project.link}" target="_blank">Voir le projet</a>
      
      </div>
      `
      modal.style.display = 'flex'

      // Ajouter un écouteur pour fermer la modal via le bouton de fermeture
      const closeButton = modalContent.querySelector('.close-btn')
      closeButton.addEventListener('click', closeModal)
    }
  }

  // Fermer la modal
  function closeModal() {
    modal.style.display = 'none'
    modalContent.innerHTML = '' // Vide le contenu de la modal
  }

  // Fermer la modal lorsqu'on clique à l'extérieur de son contenu
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal()
    }
  })

  // Charger les projets au démarrage
  loadProjects()
})
