// Objets contenant les informations des films et catégories.
// Toutes les catégories
const allCategories = []

// Meilleurs films.
let bestMovieDatas = []
let bestMoviesDatas = []

// Meilleurs films des catégories définies.
let bestMoviesDatasOfCategory1 = []
let bestMoviesDatasOfCategory2 = []
let bestMoviesDatasOfSelectedCategory = []


/**
 * Effectue une requête GET de la page URL de l'API entrée en paramètre et
 * renvoie les données en format JSON.
 * 
 * @param {string} APIRequest - Adresse URL de la requête à l'API.
 * @returns {Promise<object>} Une promesse qui se résout avec les données
 * JSON de la réponse de l'API.
 */
async function fetchJsonFromApiPage(APIRequest) {
    let response = await fetch(APIRequest)
    return await response.json()
}

/**
 * Génère une URL de requête pour l'API Titles en fonction de l'objet entré en argument
 * et la retourne formaté sous forme de chaîne de caractères.
 * 
 * @param {object} requestObject - L'objet contenant les éléments de requête.
 * @returns {string} L'URL de requête générée et formaté pour l'API en chaîne de caractères.
 */
function generateRequestForTitlesAPI(requestObject) {
    let requestForAPI = apiHTMLTitles + "?"
    for (const element in requestObject) {
        requestForAPI += element + "=" + requestObject[element] + "&"
    }
    return requestForAPI
}

/**
 * Crée un objet de requête pour l'API en fonction de la catégorie fournie.
 * 
 * @param {string} category - La catégorie pour l'objet de requête.
 * @returns {object} L'objet de requête généré avec les propriétés genre et sort_by.
 */
function createRequestObject(category) {
    const requestObject = {}
    if (category) {
        requestObject.genre = category
    }
    requestObject.sort_by = "-imdb_score"
    return requestObject
}

/**
 * Récupère les informations générales des films depuis l'API en fonction du nombre de pages API nécessaires et de la requête API initiale.
 * 
 * @param {number} nbApiPageNeed - Le nombre de pages API à récupérer.
 * @param {string} APIRequest - L'URL de la requête API initiale.
 * @returns {Promise<Array>} Une promesse qui se résout avec un tableau des films récupérés depuis l'API.
 */
async function fetchMoviesFromAPI(nbApiPageNeed, APIRequest) {
    let arrayMovies = []
    let jsonResponse = await fetchJsonFromApiPage(APIRequest)
    while (nbApiPageNeed > 0) {
        for (element in jsonResponse.results) {
            arrayMovies.push(jsonResponse.results[element])
        }
        requestNextPage = jsonResponse.next
        nbApiPageNeed--
        jsonResponse = await fetchJsonFromApiPage(requestNextPage)
    }
    return arrayMovies
}

/**
 * Récupère les informations détaillées des films depuis l'URL présent dans les informations générales des films.
 * 
 * @param {Array<Object>} arrayMovies - Tableau d'objets de films contenant l'url de chacun des films.
 * @returns {Promise<Array<Object>>} - Tableau d'objets comprenant toutes les informations détaillées des films.
 */
async function fetchMoviesDatasFromAPI(arrayMovies) {
    let arrayMoviesInformations = []
    for (let i = 0; i < arrayMovies.length; i++) {
        arrayMoviesInformations.push(await fetchJsonFromApiPage(arrayMovies[i].url))
    }
    return arrayMoviesInformations
}
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


function modifyMovieTitle(titleInHTML, movie){
    let movieName = getMovieName(movie)
    titleInHTML.innerText = movieName
}

function getMovieName(movie) {
    if (movie.original_title) {
        return movie.original_title
    }
    return movie.title
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

async function getMoviesDatas(requestObject, nbApiPageNeedCategories, category) {
    let requestForAPI = generateRequestForTitlesAPI(requestObject)
    arrayMovies = await fetchMoviesFromAPI(nbApiPageNeedCategories, requestForAPI)
    return await fetchMoviesDatasFromAPI(arrayMovies)
    
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

function getCategoryName(response) {
    for (let i = 0; i < response.length; i++) {
        allCategories.push(response[i].name)
    }
}

async function fetchAllCategories() {
    let response = await fetchJsonFromApiPage(apiHTMLGenres)
    getCategoryName(response.results)
    while (response.next) {
        response = await fetchJsonFromApiPage(response.next)
        getCategoryName(response.results)
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
    console.log(classToAdd)
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

function createAllCategories() {
    let allSections = document.querySelectorAll("section")
    for (let currentSection = 0; currentSection < allSections.length; currentSection++)
        if (allSections[currentSection].id !== bestMovieHTMLId) {
            const rowDiv = document.createElement("div")
            rowDiv.classList.add("row", "row-cols-1", "row-cols-md-2", "row-cols-lg-3", "grid", "gap-0", "row-gap-5", "align-items-center")
            for (let i = 0; i < nbMovieByCategory; i++) {
                let movieColumns = createMovieColumn(i)
                rowDiv.appendChild(movieColumns)
            }
            allSections[currentSection].appendChild(rowDiv)
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
}