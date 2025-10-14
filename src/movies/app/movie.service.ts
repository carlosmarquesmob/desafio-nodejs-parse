import { CreateMovieDTO } from "./dto/create-movie.dto";
import { MovieDTO } from "./dto/movie.dto";
import { Movie } from "./entities/movie";
import { PersistMovieData } from "./persist-data/movie.persist";

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

    async listMovies(limit: number = 10): Promise<MovieDTO[]> {
        return await this.persistMovie.findAll(limit)
    }

}