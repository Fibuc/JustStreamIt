/**
 * Crée une colonne pour une grid d'un film d'une catégorie.
 *
 * @param {number} indexMovieNumber - Le numéro du film dans la liste.
 * @returns {HTMLElement} La colonne de film créée.
 */
function createMovieColumn(indexMovieNumber) {
    const currentMovieNumber = indexMovieNumber + 1
    // Création de la colonne.
    let classToAdd = addClassDNoneIfSmallScreens(currentMovieNumber)
    const colDiv = document.createElement("div")
    colDiv.classList.add("col", "position-relative")
    // Ajout de la classe permettant de limiter l'affichage pour les petits écrans.
    if (classToAdd) {
        colDiv.classList.add(classToAdd[0], classToAdd[1])
    }

    // Création de l'image.
    const img = document.createElement("img")
    img.classList.add("category-img-movie", "mx-auto", "d-block", "shadow-lg", "mb-5", "bg-body-tertiary", "rounded")

    // Création de l'overlay.
    const overlayDiv = document.createElement("div")
    overlayDiv.classList.add("overlay")

    // Création du titre.
    const movieTitle = document.createElement("p")
    movieTitle.classList.add("text-white", "h5", "movie-title")
    movieTitle.textContent = `Titre ${currentMovieNumber} film`

    // Création du bouton.
    const button = document.createElement("button")
    button.type = "button"
    button.classList.add("btn", "btn-dark", "open-modal")
    button.textContent = "Détails"

    // Ajout des éléments à l'overlay.
    overlayDiv.appendChild(movieTitle)
    overlayDiv.appendChild(button)

    // Ajout des éléments à la colonne.
    colDiv.appendChild(img)
    colDiv.appendChild(overlayDiv)

    return colDiv
}

/**
 * Crée un bouton "Voir plus" pour une catégorie avec la possibilité de ne pas l'afficher sur la tablette.
 *
 * @param {boolean} hideOnTablet - Vrai si caché sur l'affichage tablette, sinon faux.
 * @returns {HTMLElement} Le bouton "Voir plus" créé.
 */
function createShowMoreButton(hideOnTablet) {
    const btnShowMore = document.createElement("button")
    btnShowMore.textContent = "Voir plus"
    btnShowMore.classList.add("btn", "btn-danger", "col-5", "btn-lg", "mx-auto")
    if (hideOnTablet) {
        btnShowMore.classList.add("d-md-none")
    } else {
        btnShowMore.classList.add("d-lg-none")
    }

    return btnShowMore
}

/**
 * Ajoute un l'option d'afficher les colonnes masquées lorsque l'événement click est réalisé
 * sur l'élément puis le masque.
 *
 * @param {HTMLElement} elementToListen - L'élément bouton à écouter pour les événements.
 * @param {HTMLElement} section - La section contenant les colonnes à afficher.
 */
function eventShowMore(elementToListen, section) {
    elementToListen.onclick = () => {
        const allCols = section.querySelectorAll("div.col")
        allCols.forEach((column) => {
            if (column.classList.contains("d-none")) {
                column.classList.remove("d-none")
            }
        })
        elementToListen.classList.add("d-none")
    }
}

/**
 * Crée la grid de la section correspondant à la catégorie indiqué.
 *
 * @param {string} categoryID - L'id de la section correspondant à la catégorie.
 * @param {Array<Object>} allCategoryMovies - Tableau comprenant les objets film.
 */
function createCategoryGrid(categoryID, allCategoryMovies) {
    let section = document.getElementById(categoryID)

    // Création de la ligne
    const rowDiv = document.createElement("div")
    rowDiv.classList.add(
        "row",
        "row-cols-1",
        "row-cols-md-2",
        "row-cols-lg-3",
        "grid",
        "gap-0",
        "row-gap-5",
        "align-items-center"
    )

    // Création des colonnes
    for (let i = 0; i < nbMovieByCategory && i < allCategoryMovies.length; i++) {
        let movieColumns = createMovieColumn(i)
        rowDiv.appendChild(movieColumns)
    }

    // Création du bouton "Voir plus".
    let btnShowMore = null
    if (allCategoryMovies.length > nbMovieShowOnTablet) {
        btnShowMore = createShowMoreButton()
    } else if (allCategoryMovies.length > nbMovieShowOnPhone) {
        btnShowMore = createShowMoreButton(true)
    }

    // Ajout du bouton à la ligne s'il existe.
    if (btnShowMore) {
        eventShowMore(btnShowMore, section)
        rowDiv.appendChild(btnShowMore)
    }

    section.appendChild(rowDiv)
}

/**
 * Créé toutes les options de la liste de sélection avec les noms des catégories.
 */
async function createSelectedCategories() {
    await fetchAllCategories()
    let options = ""
    let sectionInHTML = document.querySelector("#selection")
    for (let i = 0; i < allCategories.length; i++) {
        if (allCategories[i] === defaultSelectedCategory) {
            options += `<option value="${i}" selected>${allCategories[i]}</option>`
        } else {
            options += `<option value="${i}">${allCategories[i]}</option>`
        }
    }
    sectionInHTML.innerHTML = options
    eventChangeCategory()
}

/**
 * Ajoute l'option de fermeture de la fenêtre modale lorsque l'élément
 * réalise l'événement clique.
 *
 * @param {HTMLElement} modal - L'élément HTML représentant la fenêtre modale.
 * @param {HTMLElement} button - L'élément HTML lié à l'événement.
 * @param {HTMLElement} mainOverlay - L'élément HTML représentant le filtre d'opaque sur le main.
 */
function addCloseModalOption(modal, button, mainOverlay) {
    button.onclick = () => {
        mainOverlay.classList.add("d-none")
        modal.classList.remove("d-block")
    }
}

/**
 * Ajoute l'option d'ouverture de la fenêtre modale lorsque l'élément
 * réalise l'événement clique.
 *
 * @param {HTMLElement} modal - L'élément HTML représentant la fenêtre modale.
 * @param {HTMLElement} elementHTML - L'élément HTML lié à l'événement.
 * @param {HTMLElement} mainOverlay - L'élément HTML représentant le filtre d'opaque sur le main.
 */
function addOpenModalOption(modal, elementHTML, mainOverlay) {
    elementHTML.onclick = () => {
        mainOverlay.classList.remove("d-none")
        modal.classList.add("d-block")
        modifyModalInformations(elementHTML.value)
    }
}

/**
 * Associe les événement d'ouverture et fermeture de la fenêtre modale aux boutons et images.
 */
function modifyModalActions() {
    const modal = document.getElementById("movie-modal")
    const mainOverlay = document.getElementById("main-overlay")

    // Récupération de toutes les images.
    const allCategoryImages = document.querySelectorAll(".category-img-movie")
    const allImagesMovies = [document.querySelector(".img-best-movie")]
    allCategoryImages.forEach((image) => {
        allImagesMovies.push(image)
    })

    // Ajout de la fonctionnalité d'ouverture de la fenêtre lors du clique sur chaque bouton.
    const buttonsModalOpen = document.querySelectorAll("button.open-modal")
    for (let i = 0; i < buttonsModalOpen.length; i++) {
        addOpenModalOption(modal, buttonsModalOpen[i], mainOverlay)
        buttonsModalOpen[i].value = i
    }

    // Ajout de la fonctionnalité d'ouverture de la fenêtre lors du clique sur chaque image.
    for (let i = 0; i < allImagesMovies.length; i++) {
        addOpenModalOption(modal, allImagesMovies[i], mainOverlay)
        allImagesMovies[i].value = i
    }

    // Ajout de la fonctionnalité de fermeture de la fenêtre lors du clique un bouton.
    const buttonsModalClose = modal.querySelectorAll("button.close-modal")
    buttonsModalClose.forEach((button) => {
        addCloseModalOption(modal, button, mainOverlay)
    })

    // Ajout de la fonctionnalité de fermeture de la fenêtre lors du clique en dehors de la zone de la fenêtre.
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove("d-block")
            mainOverlay.classList.add("d-none")
        }
    }
}
