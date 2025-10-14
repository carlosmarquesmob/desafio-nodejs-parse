import { Movie } from "../entities/movie";

export interface PersistMovieData {

    create(movies: Movie[]): Promise<Movie[]>
    findAll(limit: number): Promise<Movie[]>
    findById(id: string): Promise<Movie | null>

}