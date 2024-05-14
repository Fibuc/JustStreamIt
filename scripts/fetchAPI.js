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

async function getMoviesDatas(requestObject, nbApiPageNeedCategories, category) {
    let requestForAPI = generateRequestForTitlesAPI(requestObject)
    arrayMovies = await fetchMoviesFromAPI(nbApiPageNeedCategories, requestForAPI)
    return await fetchMoviesDatasFromAPI(arrayMovies)
}

function getCategoryName(response) {
    for (let i = 0; i < response.length; i++) {
        allCategories.push(response[i].name)
    }
}

function removeDefaultCategoriesFromAllCategories() {
    allCategories = allCategories.filter(category => category !== defaultFirstCategory && category !== defaultSecondCategory)
}

async function fetchAllCategories() {
    let response = await fetchJsonFromApiPage(apiHTMLGenres)
    getCategoryName(response.results)
    while (response.next) {
        response = await fetchJsonFromApiPage(response.next)
        getCategoryName(response.results)
    }
    removeDefaultCategoriesFromAllCategories()

}
