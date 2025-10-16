import Parse from "parse/node"
import { Movie } from "src/movies/app/entities/movie"
import { PersistMovieData } from "src/movies/app/persist-data/movie.persist"
import { toParseMoviePersist, toPersistMovieDomain } from "./mapper/parse-movie-persist.mapper"
import { FastifyBaseLogger } from "fastify"
import { parseServerErrorHandler } from "src/common/handlers/parse-server-error-handler"

const CLASS = "Movie"
const MovieObject = Parse.Object.extend(CLASS) as new () => Parse.Object

export class ParseMoviePersist implements PersistMovieData {

    constructor(
        private readonly log: FastifyBaseLogger
    ) {}

    async create(movies: Movie[]): Promise<Movie[]> {
        try {
            const moviesObjects = movies.map((m) => toParseMoviePersist(m, MovieObject))
            
            const movieObject = await Parse.Object.saveAll(moviesObjects, { useMasterKey: true })
            return movieObject.map(toPersistMovieDomain)
        } catch (err) {
            parseServerErrorHandler({
                err, log: this.log, className: "MOVIE", action: "create movie"
            })
            throw err
        }
    }

    async findAll(
        page: number, limit: number, title?: string, year?: number, genres?: string
    ): Promise<Movie[]> {
        try {
            const query = new Parse.Query(CLASS)

            query.skip((page - 1) * limit)
            query.limit(limit)

            if(title) query.contains("title", title)
            if(year) query.equalTo("year", year)
            if(genres) query.contains("genres", genres)

            const result = await query.find({ useMasterKey: true })

            return result.map(toPersistMovieDomain)
        }catch(err) {
            parseServerErrorHandler({
                err, log: this.log, className: "MOVIE", action: "find all movies"
            })
            throw err
        }
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
            parseServerErrorHandler({
                err, log: this.log, className: "MOVIE", action: "find movie"
            })
            throw err
        }
    }

    async update(
        id: string, 
        movie: Partial<Pick<Movie, "title" | "description" | "director" | "genres" | "year">>
    ): Promise<void> {
        try {
            const movieParse = new MovieObject()

            movieParse.set("id", id)

            Object.keys(movie).forEach((key) => {
                if(movie[key] !== undefined) {
                    movieParse.set(key, movie[key])
                }
            })

            await movieParse.save({ useMasterKey: true })
        } catch(err) {
            parseServerErrorHandler({
                err, log: this.log, className: "MOVIE", action: "update movie"
            })
            throw err
        }
    }

    async delete(id: string): Promise<void> {
        try{
            const movieParse = new MovieObject()
            movieParse.set("id", id)
            await movieParse.destroy({ useMasterKey: true })
        }catch(err) {
            parseServerErrorHandler({
                err, log: this.log, className: "MOVIE", action: "delete movie"
            })
            throw err
        }
    }
}