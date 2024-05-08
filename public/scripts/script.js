// Objets contenant les informations des films.
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

function generateRequestForTitlesAPI(requestObject) {
    let requestForAPI = apiHTMLTitles + "?"
    for (const element in requestObject) {
        requestForAPI += element + "=" + requestObject[element] + "&"
    }
    return requestForAPI
}

function createRequestObject(category) {
    const requestObject = {}
    if (category) {
        requestObject.genre = category
    }
    requestObject.sort_by = "-imdb_score"
    return requestObject
}

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

async function fetchMoviesDatasFromAPI(arrayMovies) {
    let arrayMoviesInformations = []
    for (let i = 0; i < arrayMovies.length; i++) {
        arrayMoviesInformations.push(await fetchJsonFromApiPage(arrayMovies[i].url))
    }
    return arrayMoviesInformations
}

function modifyMoviesInformations(allMovies, categoryID) {
    allImages = document.querySelectorAll("#" + categoryID + " img")
    allTitles = document.querySelectorAll("#" + categoryID + " p")
    for (let i = 0; i < nbMovieByCategory; i++) {
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
    console.log(bestMovieDatas)
    imageInHTML = document.querySelector("#best-film img")
    titleInHTML = document.querySelector("#" + bestMovieHTMLId + " h2")
    descriptionInHTML = document.querySelector("#best-film p")
    descriptionInHTML.innerText = bestMovieDatas.description
    modifyMovieImage(imageInHTML, bestMovieDatas)
    modifyMovieTitle(titleInHTML, bestMovieDatas)
}

async function showMoviesOfACategory(category) {
    let requestObject = {}
    switch (category) {
        case bestMoviesHTMLId:
            requestObject = createRequestObject()
            requestForAPI = generateRequestForTitlesAPI(requestObject)
            arrayMovies =  await fetchMoviesFromAPI(nbApiPageNeedBestFilms, requestForAPI)
            bestMoviesDatas = await fetchMoviesDatasFromAPI(arrayMovies)
            bestMovieDatas = bestMoviesDatas.shift()
            modifyMoviesInformations(bestMoviesDatas, category)
            modifyBestFilmInformations()
            break
        case firstCategoryMoviesHTMLId:
            requestObject = createRequestObject(defaultFirstFreeCategory)
            requestForAPI = generateRequestForTitlesAPI(requestObject)
            arrayMovies = await fetchMoviesFromAPI(nbApiPageNeedCategories, requestForAPI)
            bestMoviesDatas = await fetchMoviesDatasFromAPI(arrayMovies)
            modifyMoviesInformations(bestMoviesDatas, category)
            break
        case secondCategoryMoviesHTMLId:
            requestObject = createRequestObject(defaultSecondFreeCategory)
            requestForAPI = generateRequestForTitlesAPI(requestObject)
            arrayMovies = await fetchMoviesFromAPI(nbApiPageNeedCategories, requestForAPI)
            bestMoviesDatas = await fetchMoviesDatasFromAPI(arrayMovies)
            modifyMoviesInformations(bestMoviesDatas, category)
            break
        case freeCategoryMoviesHTMLId:
            requestObject = createRequestObject(defaultSelectedCategory)
            requestForAPI = generateRequestForTitlesAPI(requestObject)
            arrayMovies = await fetchMoviesFromAPI(nbApiPageNeedCategories, requestForAPI)
            bestMoviesDatas = await fetchMoviesDatasFromAPI(arrayMovies)
            modifyMoviesInformations(bestMoviesDatas, category)
            break
    }
}

function showAllMovies() {
    showMoviesOfACategory(bestMoviesHTMLId)
    showMoviesOfACategory(firstCategoryMoviesHTMLId)
    showMoviesOfACategory(secondCategoryMoviesHTMLId)
    showMoviesOfACategory(freeCategoryMoviesHTMLId)
}

let requestObject = createRequestObject("Action")
let fullRequest = generateRequestForTitlesAPI(requestObject)
