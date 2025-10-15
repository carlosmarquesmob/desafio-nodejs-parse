import { Movie } from "../entities/movie";

export interface PersistMovieData {

    create(movies: Movie[]): Promise<Movie[]>
    findAll(limit: number): Promise<Movie[]>
    findById(id: string): Promise<Movie | null>
    update(
        id: string, 
        movie: Partial<Pick<Movie, "title" | "description" | "director" | "genres" | "year">>
    ): Promise<void>

}