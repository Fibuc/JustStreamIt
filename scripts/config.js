// **** Liens pour accéder à l'API. ****
const apiHTMLTitles = "http://localhost:8000/api/v1/titles/"
const apiHTMLGenres = "http://localhost:8000/api/v1/genres/"


// **** Variables concernant les films. ****
const nbMovieByApiPage = 5
const nbMovieByCategory = 6
const nbMovieShowOnPhone = 2
const nbMovieShowOnTablet = 4

// Variables pour déterminer les valeurs par défaut d'affichage.
const movieHideOnPhone = nbMovieByCategory - nbMovieShowOnPhone
const movieHideOnTablet = nbMovieByCategory - nbMovieShowOnTablet

// Variables pour déterminer le nombre de pages d'API nécessaires.
const nbApiPageNeedCategories = Math.ceil(nbMovieByCategory / nbMovieByApiPage)
// Ajout de 1 car ne doit pas prendre en compte le premier film affiché.
const nbApiPageNeedBestFilms = Math.ceil((nbMovieByCategory + 1)/ nbMovieByApiPage)


// **** Catégories par défaut. ****
const numberOfCategoryShow = 4
const defaultFirstCategory = "Drama"
const defaultSecondCategory = "Sci-Fi"
let defaultSelectedCategory = "Comedy"


// **** Variables contenant les ID HTML des catégories. ****
let allSections = document.querySelectorAll("section")
const bestMovieHTMLId = "best-film"
const bestMoviesHTMLId = "best-category"
const firstCategoryMoviesHTMLId = "first-category"
const secondCategoryMoviesHTMLId = "second-category"
const freeCategoryMoviesHTMLId = "free-category"

