import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import { fastify } from 'fastify'
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { movieRoutes } from './movies/infra/movie.handler'
import { errorHandler } from './common/handlers/error-handler'
import { userRoutes } from './user/infra/user.handler'
import { authRoutes } from './auth/infra/auth.handler'

const app = fastify({
    logger: true
}).withTypeProvider<ZodTypeProvider>()

app.addHook("onError", async (req, reply, err) => {
    req.log.error({
        type: err.name,
        errorMessage: err.message,
        stack: err.stack,
        statusCode: reply.statusCode
    })
})

app.addHook("preHandler", async (req, reply) => {
    let bodyLog = {}

    if(req.body) {
        const body = { ...req.body }
        if(body["password"]) body["password"] = ["*****"]
        bodyLog = body
    }

    req.log = req.log.child({
        payload: bodyLog,
        queryParams: req.query
    })
})


app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: "*" })

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Node.js + Parse Server",
            version: "1.0.0"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "SessionToken"
                }
            }
        }
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, { routePrefix: "/docs" })

app.register(movieRoutes, { prefix: "/movies" })
app.register(userRoutes, { prefix: "/users" })
app.register(authRoutes, { prefix: "/auth" })

app.setErrorHandler(errorHandler)

export default app