document.addEventListener('DOMContentLoaded', async () => {
  const carouselContainer = document.querySelector('.carousel')
  const prevBtn = document.getElementById('prev-btn')
  const nextBtn = document.getElementById('next-btn')
  let currentIndex = 0
  let autoSlide

  // Charger les données JSON et extraire les compétences
  async function loadCompetences() {
    try {
      const response = await fetch('../../assets/data/data.json')
      const data = await response.json()
      const competences = data.competences // Extraire uniquement la section "competences"
      createCarouselItems(competences)
      updateItems() // Afficher le premier élément au démarrage
      startAutoSlide() // Démarrer le carrousel automatique
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error)
    }
  }

  // Créer les éléments HTML pour le carrousel
  function createCarouselItems(competences) {
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
      carouselContainer.appendChild(carouselItem)
    })
  }

  // Mettre à jour l'affichage des éléments du carrousel
  function updateItems() {
    const items = document.querySelectorAll('.carousel-item')
    items.forEach((item, index) => {
      item.classList.toggle('active', index === currentIndex)
    })
  }

  // Fonction pour aller à l'élément suivant
  function nextItem() {
    const items = document.querySelectorAll('.carousel-item')
    currentIndex = (currentIndex + 1) % items.length
    updateItems()
  }

  // Fonction pour aller à l'élément précédent
  function prevItem() {
    const items = document.querySelectorAll('.carousel-item')
    currentIndex = (currentIndex - 1 + items.length) % items.length
    updateItems()
  }

  // Démarrer le défilement automatique
  function startAutoSlide() {
    autoSlide = setInterval(nextItem, 6000)
  }

  // Arrêter le défilement automatique
  function stopAutoSlide() {
    clearInterval(autoSlide)
  }

  // Écouteurs d'événements pour les boutons de navigation
  prevBtn.addEventListener('click', () => {
    stopAutoSlide()
    prevItem()
    startAutoSlide()
  })

  nextBtn.addEventListener('click', () => {
    stopAutoSlide()
    nextItem()
    startAutoSlide()
  })

  // Charger les compétences au démarrage
  loadCompetences()
})
