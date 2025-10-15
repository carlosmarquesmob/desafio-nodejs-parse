import Parse from "parse/node"
import { Movie } from "src/movies/app/entities/movie"
import { PersistMovieData } from "src/movies/app/persist-data/movie.persist"
import { toParseMoviePersist, toPersistMovieDomain } from "./mapper/parse-movie-persist.mapper"

export class ParseMoviePersist implements PersistMovieData {

    private CLASS = "Movie"
    private MovieObject = Parse.Object.extend(this.CLASS)

    async create(movies: Movie[]): Promise<Movie[]> {
        try {
            const moviesObjects = movies.map((m) => toParseMoviePersist(m, this.MovieObject))
            
            const movieObject = await Parse.Object.saveAll(moviesObjects, { useMasterKey: true })
            return movieObject.map(toPersistMovieDomain)
        } catch (err) {
            throw err
        }
    }

    async findAll(limit: number): Promise<Movie[]> {
        const query = new Parse.Query(this.CLASS)
        query.limit(limit)

        const result = await query.find({ useMasterKey: true })
        return result.map(toPersistMovieDomain)
    }
    
    async findById(id: string): Promise<Movie | null> {
        try {
            const query = new Parse.Query(this.CLASS)
            const result = await query.get(id, { useMasterKey: true })
            if(!result) return null
            return toPersistMovieDomain(result) 
        } catch(err) {
            if(err.code === 101) {
                return null // not found
            }
            throw err
        }
    }

    async update(
        id: string, 
        movie: Partial<Pick<Movie, "title" | "description" | "director" | "genres" | "year">>
    ): Promise<void> {
        try {
            const movieParse = new this.MovieObject()

            movieParse.set("id", id)

            Object.keys(movie).forEach((key) => {
                if(movie[key] !== undefined) {
                    movieParse.set(key, movie[key])
                }
            })

            await movieParse.save({ useMasterKey: true })
        } catch(err) {
            throw err
        }
    }
}