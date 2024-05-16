/**
 * Modifie le texte d'un élément HTML avec le nom du film.
 *
 * @param {HTMLElement} titleInHTML - L'élément HTML du titre à modifier.
 * @param {Object} movie - Les informations du film.
 */
function modifyMovieTitle(titleInHTML, movie) {
    let movieName = getMovieName(movie)
    titleInHTML.innerText = movieName
}

/**
 * Modifie les propriétés de l'image en fonction des informations du film et retourne l'état de la modification.
 *
 * @param {HTMLImageElement} imageInHTML - L'élément image HTML à modifier.
 * @param {Object} movieInformations - Les informations du film.
 * @returns {boolean} Etat de la modification. Vrai si modifié avec succès, sinon faux.
 */
function modifyMovieImage(imageInHTML, movieInformations) {
    const imageDescription = "Affiche du film " + getMovieName(movieInformations)
    imageInHTML.alt = imageDescription
    imageInHTML.title = imageDescription
    imageInHTML.src = movieInformations.image_url
}

/**
 * Vérifie si la longueur de la description est bien supérieur au seuil indiqué dans le module config.js.
 *
 * @param {string} description - La description à vérifier.
 * @returns {boolean} Vrai si la longueur de la description dépasse la limite, sinon faux.
 */
function checkLengthDescription(description) {
    return description.length > minCaracteresForDescription
}

/**
 * Modifie la description affichée en fonction des informations du film.
 *
 * @param {HTMLElement} descriptionInHTML - L'élément HTML où afficher la description.
 * @param {Object} movieInformations - Les informations du film.
 * @param {boolean} longDescription - Indique si on doit utiliser la description longue.
 */
function modifyDescription(descriptionInHTML, movieInformations, longDescription) {
    let descriptionToAppend = ""
    if (longDescription) {
        descriptionToAppend = movieInformations.long_description
        if (checkLengthDescription(descriptionToAppend)) {
            descriptionInHTML.innerText = descriptionToAppend
            return
        }
    }

    descriptionToAppend = movieInformations.description
    if (checkLengthDescription(descriptionToAppend)) {
        descriptionInHTML.innerText = descriptionToAppend
        return
    }

    descriptionInHTML.innerText = "Pas de description."
}

/**
 * Modifie les éléments HTML de la section du meilleur film avec les informations
 * présentes dans le tableau bestMovieDatas.
 */
function modifyBestMovieInformations() {
    const sectionInHTML = document.querySelector("#best-movie")

    const imageInHTML = sectionInHTML.querySelector("img")
    modifyMovieImage(imageInHTML, bestMovieDatas)

    const titleInHTML = sectionInHTML.querySelector("#title")
    modifyMovieTitle(titleInHTML, bestMovieDatas)

    const descriptionInHTML = sectionInHTML.querySelector("#description")
    modifyDescription(descriptionInHTML, bestMovieDatas)
}

/**
 * Modifie le titre de la catégorie spécifiée dans le HTML.
 *
 * @param {string} idHTML - L'ID de la section HTML contenant le titre à modifier.
 * @param {string} category - Le nouveau titre de la catégorie.
 */
function modifyCategoryTitle(idHTML, category) {
    document.querySelector("#" + idHTML + " h1").innerText = category
}

/**
 * Supprime toutes les colonnes de films et le bouton "Voir plus" d'une section.
 * @param {string} categoryID - L'ID de la section de la catégorie.
 */
function removeAllElementsInCategory(categoryID) {
    const categorySection = document.getElementById(categoryID)
    const allElements = categorySection.querySelectorAll("div.col")
    allElements.forEach((column) => {
        column.remove()
    })
    categorySection.querySelector("button").remove()
}

/**
 * Modifie les éléments HTML d'une catégorie par les données des films fournis.
 *
 * @param {Array<Object>} allMovies - Tableau d'objets comprenant les informations des films.
 * @param {string} categoryID - ID de la catégorie à modifier.
 */
function modifyMoviesInformations(allMovies, categoryID) {
    const allImages = document.querySelectorAll("#" + categoryID + " img")
    const allTitles = document.querySelectorAll("#" + categoryID + " p")
    for (let i = 0; i < nbMovieByCategory && i < allMovies.length; i++) {
        modifyMovieImage(allImages[i], allMovies[i])
        modifyMovieTitle(allTitles[i], allMovies[i])
    }
}

/**
 * Modifie toutes les informations de la catégorie spécifiée en fonction de son ID HTML.
 *
 * @param {string} idHTML - L'ID HTML de la catégorie à modifier.
 */
async function modifyCategory(idHTML) {
    let requestObject = {}
    switch (idHTML) {
        // Cas ou l'id entré en paramètre est celui des meilleurs films
        case bestMoviesHTMLId:
            requestObject = createRequestObject()
            bestMoviesDatas = await getMoviesDatas(requestObject, nbApiPageNeedBestFilms, idHTML)
            // Sépare le meilleur films des autres films
            bestMovieDatas = bestMoviesDatas.shift()
            createCategoryGrid(idHTML, bestMoviesDatas)
            modifyMoviesInformations(bestMoviesDatas, idHTML)
            modifyBestMovieInformations()
            break

        // Cas ou l'id entré en paramètre est celui de la première catégorie
        case firstCategoryMoviesHTMLId:
            requestObject = createRequestObject(defaultFirstCategory)
            bestMoviesDatasOfCategory1 = await getMoviesDatas(requestObject, nbApiPageNeedCategories, idHTML)
            createCategoryGrid(idHTML, bestMoviesDatasOfCategory1)
            modifyMoviesInformations(bestMoviesDatasOfCategory1, idHTML)
            modifyCategoryTitle(idHTML, defaultFirstCategory)
            break

        // Cas ou l'id entré en paramètre est celui de la deuxième catégorie
        case secondCategoryMoviesHTMLId:
            requestObject = createRequestObject(defaultSecondCategory)
            bestMoviesDatasOfCategory2 = await getMoviesDatas(requestObject, nbApiPageNeedCategories, idHTML)
            createCategoryGrid(idHTML, bestMoviesDatasOfCategory2)
            modifyMoviesInformations(bestMoviesDatasOfCategory2, idHTML)
            modifyCategoryTitle(idHTML, defaultSecondCategory)
            break

        // Cas ou l'id entré en paramètre est celui de la catégorie libre.
        case freeCategoryMoviesHTMLId:
            requestObject = createRequestObject(defaultSelectedCategory)
            bestMoviesDatasOfSelectedCategory = await getMoviesDatas(requestObject, nbApiPageNeedCategories, idHTML)
            // Supprime les colonnes pour les recréer selon le nombre d'éléments de la catégorie.
            try {
                removeAllElementsInCategory(idHTML)
            } catch {
                // Essaie de supprimer les éléments, s'il n'y en a pas, ne fait rien.
            }
            createCategoryGrid(idHTML, bestMoviesDatasOfSelectedCategory)
            modifyMoviesInformations(bestMoviesDatasOfSelectedCategory, idHTML)
            break
    }
    modifyModalActions()
}

/**
 * Retourne les classes permettant de masquer les éléments pour les petits formats
 * d'écran selon le nombre de films affichés par défaut pour les tablette et les portables.
 *
 * @param {number} currentMovieNumber - Le numéro actuel du films.
 * @returns {(string[]|boolean)} Un tableau de classes à ajouter si le nombre de films dépasse les
 * paramètres par défaut, sinon false.
 */
function addClassDNoneIfSmallScreens(currentMovieNumber) {
    let classToAdd = []
    if (currentMovieNumber > nbMovieShowOnTablet) {
        classToAdd.push("d-none", "d-lg-block")
        return classToAdd
    }

    if (currentMovieNumber > nbMovieShowOnPhone) {
        classToAdd.push("d-none", "d-md-block")
        return classToAdd
    }

    return false
}

/**
 * Met à jour les informations de la catégorie sélectionnée par défaut lorsque
 * l'événement d'un changement est réalisé sur l'élément selection.
 */
function eventChangeCategory() {
    const selectionDiv = document.getElementById("selection")
    selectionDiv.onchange = () => {
        defaultSelectedCategory = allCategories[selectionDiv.value]
        modifyCategory(freeCategoryMoviesHTMLId)
    }
}

/**
 * Modifie les informations affichées dans la fenêtre modale en fonction de la position
 * du film dans la liste des films affichés.
 *
 * @param {number} value - La position du film dans la liste des films affichés.
 */
function modifyModalInformations(value) {
    const modal = document.getElementById("movie-modal")
    const movieInformations = getMovieInformations(value)

    const movieTitle = modal.querySelector("h1")
    modifyMovieTitle(movieTitle, movieInformations)

    const movieImages = modal.querySelectorAll("img")
    for (let i = 0; i < movieImages.length; i++) {
        modifyMovieImage(movieImages[i], movieInformations)
    }

    const movieDescription = modal.querySelector("#modal-description")
    modifyDescription(movieDescription, movieInformations, true)

    const movieYear = modal.querySelector("#year")
    movieYear.innerText = movieInformations.year

    const movieCategories = modal.querySelector("#categories")
    movieCategories.innerText = movieInformations.genres.join(", ")

    const movieDuration = modal.querySelector("#duration")
    movieDuration.innerText = movieInformations.duration

    const movieCountries = modal.querySelector("#countries")
    movieCountries.innerText = movieInformations.countries.join("/")

    const movieIMDBScore = modal.querySelector("#imdb-score")
    movieIMDBScore.innerText = movieInformations.imdb_score

    const movieDirectors = modal.querySelector("#directors")
    movieDirectors.innerText = movieInformations.directors.join(", ")

    const movieActors = modal.querySelector("#actors")
    movieActors.innerText = movieInformations.actors.join(", ")
}

/**
 * Modifie toutes les catégories inscrite dans par défaut dans le fichier config.js.
 */
function modifyAllCategories() {
    modifyCategory(bestMoviesHTMLId)
    modifyCategory(firstCategoryMoviesHTMLId)
    modifyCategory(secondCategoryMoviesHTMLId)
    modifyCategory(freeCategoryMoviesHTMLId)
}
