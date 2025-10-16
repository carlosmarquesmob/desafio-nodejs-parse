import { z } from "zod"
import { MovieService } from "../app/movie.service"
import { ParseMoviePersist } from "./persist-data/parse/parse-movie.persist"
import { ZodTypeProvider } from "fastify-type-provider-zod/dist/esm"
import { FastifyTypedInstance } from "src/common/@types/fastify-typed-instance"
import { authMiddleware } from "src/common/middlewares/auth.middleware"

const swaggerTags = ["Movies"]

export async function movieRoutes(app: FastifyTypedInstance) {
    const r = app.withTypeProvider<ZodTypeProvider>()

    r.addHook("preHandler", authMiddleware)

    const movieService = new MovieService(new ParseMoviePersist(app.log))

    r.post("/", {
        schema: {
            tags: swaggerTags,
            summary: "Create movies",
            description: "Create one or more movies",
            security: [{ bearerAuth: [] }],
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
        const { currentUser } = req
        const moviesCreated = await movieService.createMovie(currentUser.id!, movies)

        return reply.code(201).send(moviesCreated)
    })

    r.get("/", {
        schema: {
            tags: swaggerTags,
            summary: "List All Movies",
            security: [{ bearerAuth: [] }],
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
        const { currentUser } = req

        if(!limit || limit < 1) limit = 10
        if(!page || page < 1) page = 1

        const movies = await movieService.listMovies(currentUser.id!, {
            page, limit, genres, title, year
        })

        return reply.code(200).send(movies)
    })

    r.get(":id", {
        schema: {
            tags: swaggerTags,
            summary: "Find Movie By Id",
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.string()
            })
        }
    }, async (req, reply) => {
        const { id } = req.params
        const { currentUser } = req
        const movie = await movieService.findMovieById(currentUser.id!, id)

        return reply.code(200).send(movie)
    })

    r.put(":id", {
        schema: {
            tags: swaggerTags,
            summary: "Update Movie",
            security: [{ bearerAuth: [] }],
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
        const { currentUser } = req

        await movieService.updateMovie(currentUser.id!, id, movieBody)

        return reply.code(200).send({ message: "Movie updated successfully" })
    })

    r.delete(":id", {
        schema: {
            tags: swaggerTags,
            summary: "Delete Movie",
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.string()
            })
        }
    }, async (req, reply) => {
        const { id } = req.params
        const { currentUser } = req

        await movieService.deleteMovie(currentUser.id!, id)

        return reply.code(204).send({ message: "Movie deleted successfully" })
    })
}