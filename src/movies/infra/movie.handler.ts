import { z } from "zod"
import { MovieService } from "../app/movie.service"
import { ParseMoviePersist } from "./persist-data/parse/parse-movie.persist"
import { ZodTypeProvider } from "fastify-type-provider-zod/dist/esm"
import { FastifyTypedInstance } from "src/common/@types/fastify-typed-instance"

const movieService = new MovieService(
    new ParseMoviePersist()
)

const swaggerTags = ["Movies"]

export async function movieRoutes(app: FastifyTypedInstance) {

    const r = app.withTypeProvider<ZodTypeProvider>()

    r.post("/", {
        schema: {
            tags: swaggerTags,
            summary: "Create movies",
            description: "Create one or more movies",
            body: z.array(
                z.object({
                    title: z.string(),
                    description: z.string(),
                    year: z.coerce.number().optional(),
                    genres: z.string().optional(),
                    director: z.string().optional()
                })
            ),
        }
    }, async (req, reply) => {
        const movies = req.body
        const moviesCreated = await movieService.createMovie(movies)

        return reply.code(201).send(moviesCreated)
    })

    r.get("/", {
        schema: {
            tags: swaggerTags,
            summary: "List All Movies",
            querystring: z.object({
                limit: z.coerce.number().optional(),
                page: z.coerce.number().optional(),
                title: z.string().optional(),
                year: z.coerce.number().optional(),
                genres: z.string().optional()
            })
        }
    }, async (req, reply) => {
        let { limit, genres, page, title, year } = req.query

        if(!limit || limit < 0) limit = 10
        if(!page || page < 0) page = 1

        const movies = await movieService.listMovies({
            page, limit, genres, title, year
        })

        return reply.code(200).send(movies)
    })

    r.get(":id", {
        schema: {
            tags: swaggerTags,
            summary: "Find Movie By Id",
            params: z.object({
                id: z.string()
            })
        }
    }, async (req, reply) => {
        const { id } = req.params
        const movie = await movieService.findMovieById(id)

        return reply.code(200).send(movie)
    })

    r.put(":id", {
        schema: {
            tags: swaggerTags,
            summary: "Update Movie",
            params: z.object({
                id: z.string()
            }),
            body: z.object({
                title: z.string().nonempty().optional(),
                description: z.string().nonempty().optional(),
                year: z.coerce.number().optional(),
                genres: z.string().nonempty().optional(),
                director: z.string().nonempty().optional()
            })
        }
    }, async (req, reply) => {
        const { id } = req.params
        const movieBody = req.body
        const movie = await movieService.updateMovie(id, movieBody)

        return reply.code(200).send(movie)
    })
}