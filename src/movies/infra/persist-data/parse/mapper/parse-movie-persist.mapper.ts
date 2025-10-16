import { Movie } from "src/movies/app/entities/movie";

export function toParseMoviePersist(
    movie: Movie, 
    MovieObject: new () => Parse.Object
) {
    const object = new MovieObject()
    object.set("title", movie.title)
    object.set("description", movie.description)
    if(movie.year) object.set("year", movie.year)
    if(movie.director) object.set("director", movie.director)
    if(movie.genres) object.set("genres", movie.genres)
    object.set("createdAt", movie.createdAt)
    object.set("updatedAt", movie.updatedAt)
    return object
}

export function toPersistMovieDomain(
    parseObject: Parse.Object
): Movie {
    const { title, description, year, director, genres, createdAt, updatedAt } = parseObject.attributes
    return new Movie({
        id: parseObject._getId(),
        title,
        description,
        year,
        director,
        genres,
        createdAt,
        updatedAt,
    })
}