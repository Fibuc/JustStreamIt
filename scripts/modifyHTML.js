/**
 * Modifie les éléments HTML d'une catégorie par les données des films fournis.
 * 
 * @param {Array<Object>} allMovies - Tableau d'objets comprenant les informations des films.
 * @param {string} categoryID - ID de la catégorie à modifier.
 */
function modifyMoviesInformations(allMovies, categoryID) {
    allImages = document.querySelectorAll("#" + categoryID + " img")
    allTitles = document.querySelectorAll("#" + categoryID + " p")
    for (let i = 0; i < nbMovieByCategory; i++) {
        // if {}
        modifyMovieImage(allImages[i], allMovies[i])
        modifyMovieTitle(allTitles[i], allMovies[i])
    }
}

function getMovieName(movie) {
    if (movie.original_title) {
        return movie.original_title
    }
    return movie.title
}

function modifyMovieTitle(titleInHTML, movie){
    let movieName = getMovieName(movie)
    titleInHTML.innerText = movieName
}

function modifyMovieImage(imageInHTML, movieInformations) {
    imageInHTML.src = movieInformations.image_url
    imageDescription = "Affiche du film " + getMovieName(movieInformations)
    imageInHTML.alt = imageDescription
    imageInHTML.title = imageDescription
}

function modifyBestFilmInformations() {
    sectionInHTML = document.querySelector("#best-film")
    imageInHTML = sectionInHTML.querySelector("img")
    titleInHTML = sectionInHTML.querySelector("#title")
    descriptionInHTML = sectionInHTML.querySelector("#description")
    descriptionInHTML.innerText = bestMovieDatas.description
    modifyMovieImage(imageInHTML, bestMovieDatas)
    modifyMovieTitle(titleInHTML, bestMovieDatas)
}

function modifyCategoryTitle(idHTML, category) {
    document.querySelector("#" + idHTML + " h1").innerText = category
}

async function showMoviesOfACategory(idHTML) {
    let requestObject = {}
    switch (idHTML) {
        case bestMoviesHTMLId:
            requestObject = createRequestObject()
            bestMoviesDatas = await getMoviesDatas(requestObject, nbApiPageNeedBestFilms, idHTML)
            bestMovieDatas = bestMoviesDatas.shift()
            modifyMoviesInformations(bestMoviesDatas, idHTML)
            modifyBestFilmInformations()
            break
        case firstCategoryMoviesHTMLId:
            requestObject = createRequestObject(defaultFirstCategory)
            bestMoviesDatasOfCategory1 = await getMoviesDatas(requestObject, nbApiPageNeedCategories, idHTML)
            modifyMoviesInformations(bestMoviesDatasOfCategory1, idHTML)
            modifyCategoryTitle(idHTML, defaultFirstCategory)
            break
        case secondCategoryMoviesHTMLId:
            requestObject = createRequestObject(defaultSecondCategory)
            bestMoviesDatasOfCategory2 = await getMoviesDatas(requestObject, nbApiPageNeedCategories, idHTML)
            modifyMoviesInformations(bestMoviesDatasOfCategory2, idHTML)
            modifyCategoryTitle(idHTML, defaultSecondCategory)
            break
        case freeCategoryMoviesHTMLId:
            requestObject = createRequestObject(defaultSelectedCategory)
            bestMoviesDatasOfSelectedCategory = await getMoviesDatas(requestObject, nbApiPageNeedCategories, idHTML)
            modifyMoviesInformations(bestMoviesDatasOfSelectedCategory, idHTML)
            break
    }
}

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

function createMovieColumn(indexMovieNumber) {
    currentMovieNumber = indexMovieNumber + 1
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
    movieTitle.classList.add("text-white", "h5", "film-title")
    movieTitle.textContent = `Titre ${currentMovieNumber} film`

    // Création du bouton.
    const button = document.createElement("button")
    button.type = "button"
    button.id = "open-modal"
    button.classList.add("btn", "btn-dark")
    button.textContent = "Détails"

    // Ajout des éléments à l'overlay.
    overlayDiv.appendChild(movieTitle)
    overlayDiv.appendChild(button)

    // Ajout des éléments à la colonne.
    colDiv.appendChild(img)
    colDiv.appendChild(overlayDiv)

    return colDiv
}

function createShowMoreButton(indexSection) {
    const btnShowMore = document.createElement("button")
    btnShowMore.textContent = "Voir plus"
    btnShowMore.classList.add("btn", "btn-danger", "col-5", "btn-lg", "mx-auto", "d-lg-none")
    btnShowMore.id = "btn-show-more-" + indexSection
    return btnShowMore
}

function eventShowMore(elementToListen, section) {
    elementToListen.addEventListener("click", () => {
        allCols = section.querySelectorAll("div.col")
        for (let i = 0; i < allCols.length; i++) {
            if (allCols[i].classList.contains("d-none")) {
                allCols[i].classList.remove("d-none")
            }
        elementToListen.classList.add("d-none")
        }
    })
}

function eventChangeCategory() {
    const selectionDiv = document.getElementById("selection")
    selectionDiv.addEventListener("change", () => {
        defaultSelectedCategory = allCategories[selectionDiv.value]
        showMoviesOfACategory(freeCategoryMoviesHTMLId)
    })
}

function createAllCategories() {
    let allSections = document.querySelectorAll("section")
    for (let indexSection = 0; indexSection < allSections.length; indexSection++)
        if (allSections[indexSection].id !== bestMovieHTMLId) {
            const rowDiv = document.createElement("div")
            rowDiv.classList.add("row", "row-cols-1", "row-cols-md-2", "row-cols-lg-3", "grid", "gap-0", "row-gap-5", "align-items-center")
            for (let i = 0; i < nbMovieByCategory; i++) {
                let movieColumns = createMovieColumn(i)
                rowDiv.appendChild(movieColumns)
            }
            const btnShowMore = createShowMoreButton(indexSection)
            eventShowMore(btnShowMore, allSections[indexSection])
            rowDiv.appendChild(btnShowMore)
            allSections[indexSection].appendChild(rowDiv)
        }
}

async function modifySelectedCategories() {
    await fetchAllCategories()
    let options = ""
    let sectionInHTML = document.querySelector("#selection")
    for (let i = 0; i < allCategories.length; i++) {
        if (allCategories[i] === defaultSelectedCategory) {
            options += `<option value="${i}" selected>${defaultSelectedCategory}</option>`
        } else {
            options += `<option value="${i}">${allCategories[i]}</option>`
        }
    }
    sectionInHTML.innerHTML = options
    eventChangeCategory()
}

function addCloseModalOption(modal, button, mainOverlay) {
    button.onclick = function() {
        mainOverlay.classList.add("d-none")
        modal.classList.remove("d-block")
    }
}

function addOpenModalOption(modal, button, mainOverlay) {
    button.onclick = function() {
        mainOverlay.classList.remove("d-none")
        modal.classList.add("d-block")
    }
}

function modifyModalButtons() {
    const modal = document.getElementById("movie-modal")
    const mainOverlay = document.getElementById("main-overlay")
    const buttonsModalOpen = document.querySelectorAll("#open-modal")
    const buttonsModalClose = modal.querySelectorAll("#close-modal")    

    // Ajoute la fonctionnalité de d'ouverture de la fenêtre lors du clique sur chaque bouton
    for (let i = 0; i < buttonsModalOpen.length; i++) {
        addOpenModalOption(modal, buttonsModalOpen[i], mainOverlay)
    }

    for (let i = 0; i < buttonsModalClose.length; i++) {
        addCloseModalOption(modal, buttonsModalClose[i], mainOverlay)
    }


    // Ajoute la fonctionnalité de fermeture de la fenêtre lors du clique sur chaque bouton
    // for (let i = 0; i < buttonsModalClose.length; i++) {
    //     buttonsModalClose[i].onclick = function() {
    //         modal.classList.remove("d-block")
    //         mainOverlay.classList.add("d-none")
    //     }
    // }

    // Ferme la fenêtre lorsque l'utilisteur clique autre part que la fenêtre.
    window.onclick = function(event) {
        if (event.target == modal) {
            console.log(event.target)
            modal.classList.remove("d-block")
            mainOverlay.classList.add("d-none")
        }
    }
}

function showAllMovies() {
    showMoviesOfACategory(bestMoviesHTMLId)
    showMoviesOfACategory(firstCategoryMoviesHTMLId)
    showMoviesOfACategory(secondCategoryMoviesHTMLId)
    showMoviesOfACategory(freeCategoryMoviesHTMLId)
}

function run() {
    createAllCategories()
    showAllMovies()
    modifySelectedCategories()
    modifyModalButtons()
}