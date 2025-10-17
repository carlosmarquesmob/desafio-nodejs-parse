export class Movie {

    id: string
    title: string
    description: string
    userId: string
    year?: number
    director?: string
    genres?: string
    coverImage?: string
    createdAt: Date
    updatedAt: Date

    constructor(data: Partial<Movie>) {
        Object.assign(this, data)
    }
}