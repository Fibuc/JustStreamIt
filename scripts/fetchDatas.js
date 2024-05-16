// Objets contenant les informations des films et catégories.
// Toutes les catégories
let allCategories = []

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
        jsonResponse.results.forEach((element) => {
            arrayMovies.push(element)
        })
        let requestNextPage = jsonResponse.next
        if (requestNextPage) {
            nbApiPageNeed--
            jsonResponse = await fetchJsonFromApiPage(requestNextPage)
        } else {
            break
        }
    }
    return arrayMovies
}

/**
 * Récupère les informations détaillées des films depuis l'URL présent dans les informations générales des films.
 *
 * @param {Array<Object>} arrayMovies - Tableau d'objets films contenant l'url de chacun des films.
 * @returns {Promise<Array<Object>>} Tableau d'objets comprenant toutes les informations détaillées des films.
 */
async function fetchMoviesDatasFromAPI(arrayMovies) {
    let arrayMoviesInformations = []
    for (let i = 0; i < arrayMovies.length; i++) {
        arrayMoviesInformations.push(await fetchJsonFromApiPage(arrayMovies[i].url))
    }
    return arrayMoviesInformations
}

/**
 * Récupère les données détaillées des films à partir de l'API en fonction du nombre de pages nécessaires.
 *
 * @param {object} requestObject - L'objet de requête pour l'API.
 * @param {number} nbApiPageNeed - Le nombre de pages nécessaires pour récupérer toutes les données.
 * @returns {Promise<Array<Object>>} Une promesse qui se résout avec un tableau d'objets contenant les informations détaillées des films.
 */
async function getMoviesDatas(requestObject, nbApiPageNeed) {
    const requestForAPI = generateRequestForTitlesAPI(requestObject)
    const arrayMovies = await fetchMoviesFromAPI(nbApiPageNeed, requestForAPI)
    return await fetchMoviesDatasFromAPI(arrayMovies)
}

/**
 * Récupère le nom de chaque catégorie à partir de la réponse de l'API et les ajoute au tableau allCategories.
 *
 * @param {Array<Object>} allResponsesArray - Un tableau comprenant toutes les réponses sur les catégories de l'API.
 */
function getCategoryName(allResponsesArray) {
    allResponsesArray.forEach((response) => {
        allCategories.push(response.name)
    })
}

/**
 * Supprime du tableau allCategories les catégories déjà affichées par défaut.
 */
function removeDefaultCategoriesFromAllCategories() {
    allCategories = allCategories.filter(
        (category) => category !== defaultFirstCategory && category !== defaultSecondCategory
    )
}

/**
 * Récupère toutes les catégories depuis l'API et les ajoute au tableau allCategories.
 */
async function fetchAllCategories() {
    let jsonResponse = await fetchJsonFromApiPage(apiHTMLGenres)
    getCategoryName(jsonResponse.results)
    while (jsonResponse.next) {
        jsonResponse = await fetchJsonFromApiPage(jsonResponse.next)
        getCategoryName(jsonResponse.results)
    }

    removeDefaultCategoriesFromAllCategories()
}

/**
 * Retourne le titre original du film si disponible, sinon renvoie le titre.
 *
 * @param {Object} movie - L'objet film.
 * @returns {string} Le titre original ou le titre.
 */
function getMovieName(movie) {
    if (movie.original_title) {
        return movie.original_title
    }

    return movie.title
}

/**
 * Récupère les informations d'un film en fonction de sa position dans la liste des films affichés.
 *
 * @param {number} value - La position du film dans la liste des films affichés.
 * @returns {object} Les informations du film correspondant à la position donnée.
 */
function getMovieInformations(value) {
    const bestMovie = 1
    let numberOfMoviesShow = numberOfCategoryShow * nbMovieByCategory + bestMovie

    let indexStartBestCategory = numberOfMoviesShow - nbMovieByCategory * 4
    let indexStartFirstCategory = numberOfMoviesShow - nbMovieByCategory * 3
    let indexStartSecondCategory = numberOfMoviesShow - nbMovieByCategory * 2
    let indexStartFreeCategory = numberOfMoviesShow - nbMovieByCategory

    // Sélectionne l'index dans la catégorie à sélectionner.
    if (value >= indexStartFreeCategory) {
        let index = value - indexStartFreeCategory
        return bestMoviesDatasOfSelectedCategory[index]
    }
    // Sélectionne l'index dans la seconde catégorie.
    else if (value >= indexStartSecondCategory) {
        let index = value - indexStartSecondCategory
        return bestMoviesDatasOfCategory2[index]
    }
    // Sélectionne l'index dans la première catégorie.
    else if (value >= indexStartFirstCategory) {
        let index = value - indexStartFirstCategory
        return bestMoviesDatasOfCategory1[index]
    }
    // Sélectionne l'index dans la catégorie des meilleurs films.
    else if (value >= indexStartBestCategory) {
        let index = value - indexStartBestCategory
        return bestMoviesDatas[index]
    }

    return bestMovieDatas
}
