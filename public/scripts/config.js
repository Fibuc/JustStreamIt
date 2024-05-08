// Liens pour accéder à l'API.
const apiHTMLTitles = "http://localhost:8000/api/v1/titles/"
const apiHTMLGenres = "http://localhost:8000/api/v1/genres/"


// Variables concernant les films.
const nbMovieByApiPage = 5
const nbMovieByCategory = 6
const nbApiPageNeedCategories = Math.ceil(nbMovieByCategory / nbMovieByApiPage)
// Ajout de 1 car ne doit pas prendre en compte le premier film affiché.
const nbApiPageNeedBestFilms = Math.ceil((nbMovieByCategory + 1)/ nbMovieByApiPage)


// Catégories par défaut.
const defaultFirstFreeCategory = "Action"
const defaultSecondFreeCategory = "Sci-Fi"
let defaultSelectedCategory = "Comedy"


// Variables contenant les ID HTML des catégories.
const bestMovieHTMLId = "best-film"
const bestMoviesHTMLId = "best-category"
const firstCategoryMoviesHTMLId = "first-category"
const secondCategoryMoviesHTMLId = "second-category"
const freeCategoryMoviesHTMLId = "free-category"
