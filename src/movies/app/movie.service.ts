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

    async createMovie(dto: CreateMovieDTO[]): Promise<MovieDTO[]> {
        const movies = dto.map(d => {
            const { title, description, director, genres, year } = d
            const date = new Date()
            return new Movie({
                title,
                description,
                director, 
                genres,
                year,
                createAt: date,
                updatedAt: date
            })   
        })
        return await this.persistMovie.create(movies)
    }

    async listMovies(dto: ListMovidesDTO): Promise<MovieDTO[]> {
        const { limit, page, genres, title, year } = dto
        return await this.persistMovie.findAll(
            page, limit, title, year, genres
        )
    }

    async findMovieById(id: string): Promise<Movie> {
        const movie = await this.persistMovie.findById(id)
        if(!movie) {
            throw new NotFoundException("Movie not found")
        }
        return movie
    }

    async updateMovie(movieId: string, dto: UpdateMovieDTO): Promise<void> {
        const movie = await this.persistMovie.findById(movieId)
        if(!movie) {
            throw new NotFoundException("Movie not found")
        }

        const { title, description, director, genres, year } = dto

        await this.persistMovie.update(movieId, {
            title, description, director, genres, year
        })
    }
}