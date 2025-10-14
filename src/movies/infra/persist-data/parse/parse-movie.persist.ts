import Parse from "parse/node"
import { Movie } from "src/movies/app/entities/movie"
import { PersistMovieData } from "src/movies/app/persist-data/movie.persist"
import { toParseMoviePersist, toPersistMovieDomain } from "./mapper/parse-movie-persist.mapper"

const CLASS = "Movie"
const MovieObject = Parse.Object.extend(CLASS)

export class ParseMoviePersist implements PersistMovieData {

    async create(movies: Movie[]): Promise<Movie[]> {
        try {
            const moviesObjects = toParseMoviePersist(movies, MovieObject)
            
            const movieObject = await Parse.Object.saveAll(moviesObjects, { useMasterKey: true })
            return movieObject.map(toPersistMovieDomain)
        } catch (err) {
            console.error("Parse save error:", err)
            throw err
        }
    }

    async findAll(limit: number): Promise<Movie[]> {
        const query = new Parse.Query(CLASS)
        query.limit(limit)

        const result = await query.find({ useMasterKey: true })
        return result.map(toPersistMovieDomain)
    }
    
    async findById(id: string): Promise<Movie | null> {
        try {
            const query = new Parse.Query(CLASS)
            const result = await query.get(id, { useMasterKey: true })
            if(!result) return null
            return toPersistMovieDomain(result) 
        } catch(err) {
            if(err.code === 101) {
                return null // not found
            }
            console.error("Parse save error:", err)
            throw err
        }
    }
}