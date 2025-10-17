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
                err, log: this.log, className: CLASS, action: "create movie"
            })
            throw err
        }
    }

    async findAll(
        userId: string, page: number, limit: number, title?: string, year?: number, genres?: string
    ): Promise<Movie[]> {
        try {
            const query = new Parse.Query(CLASS)

            query.equalTo("userId", userId)

            query.skip((page - 1) * limit)
            query.limit(limit)

            if(title) query.contains("title", title)
            if(year) query.equalTo("year", year)
            if(genres) query.contains("genres", genres)

            const result = await query.find({ useMasterKey: true })

            return result.map(toPersistMovieDomain)
        }catch(err) {
            parseServerErrorHandler({
                err, log: this.log, className: CLASS, action: "find all movies"
            })
            throw err
        }
    }
    
    async findById(userId: string, id: string): Promise<Movie | null> {
        try {
            const query = new Parse.Query(CLASS)
            query.equalTo("userId", userId)
            const result = await query.get(id, { useMasterKey: true })
            if(!result) return null
            return toPersistMovieDomain(result) 
        } catch(err) {
            if(err.code === Parse.Error.OBJECT_NOT_FOUND) {
                return null
            }
            parseServerErrorHandler({
                err, log: this.log, className: CLASS, action: "find movie"
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
                err, log: this.log, className: CLASS, action: "update movie"
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
                err, log: this.log, className: CLASS, action: "delete movie"
            })
            throw err
        }
    }
    
    async addMovieImage(
        token: string,
        movieId: string,
        filename: string,
        buffer: Buffer,
        mimetype: string
    ): Promise<{ url: string }> {
        try {
            const parseFile = new Parse.File(filename, Array.from(buffer), mimetype);

            await parseFile.save({ sessionToken: token })

            const MovieClass = Parse.Object.extend("Movie")
            const query = new Parse.Query(MovieClass)
            const movieObject = await query.get(movieId, { useMasterKey: true, sessionToken: token })

            movieObject.set("coverImage", parseFile)
            await movieObject.save(null, { useMasterKey: true, sessionToken: token })

            return { url: parseFile.url()! }
        } catch (err) {
            parseServerErrorHandler({
                err, log: this.log, className: CLASS, action: "add movie image"
            })
            throw err
        }
    }
}