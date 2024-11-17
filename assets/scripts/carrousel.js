// Écouteur d'événement qui déclenche le code une fois le DOM entièrement chargé
document.addEventListener('DOMContentLoaded', async () => {
  // Sélectionne le conteneur du carrousel
  const carouselContainer = document.querySelector('.carousel')

  // Sélectionne le bouton pour aller à l'élément précédent
  const prevBtn = document.getElementById('prev-btn')

  // Sélectionne le bouton pour aller à l'élément suivant
  const nextBtn = document.getElementById('next-btn')

  // Initialise l'index actuel du carrousel
  let currentIndex = 0

  // Initialise une variable pour l'intervalle de défilement automatique
  let autoSlide

  // Fonction asynchrone pour charger les compétences depuis un fichier JSON
  async function loadCompetences() {
    try {
      // Charge le fichier JSON
      const response = await fetch('./assets/data/data.json')

      // Parse le JSON en objet JavaScript
      const data = await response.json()

      // Extrait uniquement la section "competences" du fichier JSON
      const competences = data.competences

      // Crée les éléments du carrousel pour chaque compétence
      createCarouselItems(competences)

      // Affiche le premier élément du carrousel
      updateItems()

      // Démarre le défilement automatique du carrousel
      startAutoSlide()
    } catch (error) {
      // Affiche un message d'erreur en cas d'échec du chargement
      console.error('Erreur lors du chargement des compétences:', error)
    }
  }

  // Fonction pour créer les éléments HTML du carrousel
  function createCarouselItems(competences) {
    // Pour chaque compétence, crée un élément de carrousel
    competences.forEach((competence) => {
      const carouselItem = document.createElement('div')
      carouselItem.classList.add('carousel-item')
      carouselItem.innerHTML = `
        <div class="carousel-img-box">
          <img src="${competence.image}" alt="${competence.title}">
        </div>
        <h3>${competence.title}</h3>
        <p>${competence.description}</p>
      `
      // Ajoute l'élément de carrousel au conteneur
      carouselContainer.appendChild(carouselItem)
    })
  }

  // Fonction pour mettre à jour l'affichage des éléments du carrousel
  function updateItems() {
    // Sélectionne tous les éléments du carrousel
    const items = document.querySelectorAll('.carousel-item')

    // Ajoute la classe 'active' à l'élément actif et la retire des autres
    items.forEach((item, index) => {
      item.classList.toggle('active', index === currentIndex)
    })
  }

  // Fonction pour aller à l'élément suivant dans le carrousel
  function nextItem() {
    // Sélectionne tous les éléments du carrousel
    const items = document.querySelectorAll('.carousel-item')

    // Met à jour l'index actuel pour passer à l'élément suivant
    currentIndex = (currentIndex + 1) % items.length

    // Met à jour l'affichage des éléments
    updateItems()
  }

  // Fonction pour aller à l'élément précédent dans le carrousel
  function prevItem() {
    // Sélectionne tous les éléments du carrousel
    const items = document.querySelectorAll('.carousel-item')

    // Met à jour l'index actuel pour passer à l'élément précédent
    currentIndex = (currentIndex - 1 + items.length) % items.length

    // Met à jour l'affichage des éléments
    updateItems()
  }

  // Démarre le défilement automatique du carrousel en passant à l'élément suivant toutes les 6 secondes
  function startAutoSlide() {
    autoSlide = setInterval(nextItem, 6000)
  }

  // Arrête le défilement automatique du carrousel
  function stopAutoSlide() {
    clearInterval(autoSlide)
  }

  // Ajoute un écouteur d'événement pour le bouton "Précédent"
  prevBtn.addEventListener('click', () => {
    // Arrête le défilement automatique pour éviter les conflits
    stopAutoSlide()

    // Passe à l'élément précédent
    prevItem()

    // Relance le défilement automatique
    startAutoSlide()
  })

  // Ajoute un écouteur d'événement pour le bouton "Suivant"
  nextBtn.addEventListener('click', () => {
    // Arrête le défilement automatique pour éviter les conflits
    stopAutoSlide()

    // Passe à l'élément suivant
    nextItem()

    // Relance le défilement automatique
    startAutoSlide()
  })

  // Charge les compétences au démarrage de la page
  loadCompetences()
})
