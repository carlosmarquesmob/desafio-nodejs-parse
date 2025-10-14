import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import { fastify } from 'fastify'
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { movieRoutes } from './movies/infra/movie.handler'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: "*" })

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Node.js + Parse Server",
            version: "1.0.0"
        }
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, { routePrefix: "/docs" })

app.register(movieRoutes, { prefix: "/movies" })

export default app