import { Movie } from "../entities/movie";

export interface PersistMovieData {

    create(movies: Movie[]): Promise<Movie[]>
    findAll(
        userId: string, page: number, limit: number, title?: string, year?: number, genres?: string
    ): Promise<Movie[]>
    findById(userId: string, id: string): Promise<Movie | null>
    update(
        id: string, 
        movie: Partial<Pick<Movie, "title" | "description" | "director" | "genres" | "year">>
    ): Promise<void>
    delete(id: string): Promise<void>
    addMovieImage(
        token: string,
        movieId: string,
        filename: string,
        buffer: Buffer,
        mimetype: string
    ): Promise<{ url: string }>
}