import { NotFoundException } from "src/common/exceptions/not-found-exception";
import { CreateMovieDTO } from "./dto/create-movie.dto";
import { MovieDTO } from "./dto/movie.dto";
import { Movie } from "./entities/movie";
import { PersistMovieData } from "./persist-data/movie.persist";
import { UpdateMovieDTO } from "./dto/update-movie.dto";
import { ListMovidesDTO } from "./dto/list-movies.dto";

export class MovieService {

    constructor(
        private readonly persistMovie: PersistMovieData
    ) {}

    async createMovie(userId: string, dto: CreateMovieDTO[]): Promise<MovieDTO[]> {
        const movies = dto.map(d => {
            const { title, description, director, genres, year } = d
            const date = new Date()
            return new Movie({
                userId,
                title,
                description,
                director, 
                genres,
                year,
                createdAt: date,
                updatedAt: date
            })   
        })
        
        return await this.persistMovie.create(movies)
    }

    async listMovies(userId: string, dto: ListMovidesDTO): Promise<MovieDTO[]> {
        const { limit, page, genres, title, year } = dto
        return await this.persistMovie.findAll(
            userId, page, limit, title, year, genres
        )
    }

    async findMovieById(userId: string, id: string): Promise<Movie> {
        const movie = await this.persistMovie.findById(userId, id)
        if(!movie) {
            throw new NotFoundException("Movie not found")
        }
        return movie
    }

    async updateMovie(userId: string, movieId: string, dto: UpdateMovieDTO): Promise<void> {
        const movie = await this.persistMovie.findById(userId, movieId)
        if(!movie) {
            throw new NotFoundException("Movie not found")
        }

        const { title, description, director, genres, year } = dto

        await this.persistMovie.update(movieId, {
            title, description, director, genres, year
        })
    }

    async deleteMovie(userId: string, movieId: string) {
        const movie = await this.persistMovie.findById(userId, movieId)
        if(!movie) {
            throw new NotFoundException("Movie not found")
        }

        await this.persistMovie.delete(movieId)
    }
}