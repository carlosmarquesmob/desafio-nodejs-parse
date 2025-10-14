export class Movie {

    id: string
    title: string
    description: string
    year?: number
    director?: string
    genres?: string
    createAt: Date
    updatedAt: Date

    constructor(data: Partial<Movie>) {
        Object.assign(this, data)
    }
}