import { Movie } from "src/movies/app/entities/movie";

export function toParseMoviePersist(
    movies: Movie[], 
    MovieObject: new () => Parse.Object
) {
    return movies.map((movie) => {
        const object = new MovieObject()
        object.set("title", movie.title)
        object.set("description", movie.description)
        if(movie.year) object.set("year", movie.year)
        if(movie.director) object.set("director", movie.director)
        if(movie.genres) object.set("genres", movie.genres)
        object.set("createdAt", movie.createAt)
        object.set("updatedAt", movie.updatedAt)
        return object
    })
}

export function toPersistMovieDomain(
    parseObject: Parse.Object
): Movie {
    return new Movie({
        id: parseObject.id,
        title: parseObject.get("title"),
        description: parseObject.get("description"),
        year: parseObject.get("year"),
        director: parseObject.get("director"),
        genres: parseObject.get("genres"),
        createAt: parseObject.get("createdAt"),
        updatedAt: parseObject.get("updatedAt"),
    })
}