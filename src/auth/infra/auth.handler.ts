import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyTypedInstance } from "src/common/@types/fastify-typed-instance";
import z from "zod";
import { ParseAuthService } from "./services/parse-auth.service";
import { ParseUserPersist } from "src/user/infra/persist-data/parse/parse-user.persist";
import { authMiddleware } from "src/common/middlewares/auth.middleware";

const swaggerTags = ["auth"]

export async function authRoutes(app: FastifyTypedInstance) {

    const r = app.withTypeProvider<ZodTypeProvider>()

    const authService = new ParseAuthService(
        new ParseUserPersist(app.log)
    )

    r.post("/sign-in", {
        schema: {
            tags: swaggerTags,
            summary: "Sign In",
            security: [{ bearerAuth: [] }],
            body: z.object({
                email: z.email(),
                password: z.string()
            })
        }
    }, async (req, reply) => {
        const { email, password } = req.body
        const { email: userEmail, token } = await authService.signIn({ email, password })

        return reply.code(200).send({ 
            token, 
            user: { 
                email: userEmail 
            } 
        })
    })

    r.post("/sign-up", {
        schema: {
            tags: swaggerTags,
            summary: "Sign up",
            security: [{ bearerAuth: [] }],
            body: z.object({
                name: z.string(),
                email: z.string(),
                password: z.string()
            })
        }
    }, async (req, reply) => {
        const { email, name, password } = req.body
        const { email: emailCreated, token } = await authService.signUp({ email, name, password })
        
        return reply.code(201).send({ 
            token, 
            user: { 
                email: emailCreated, 
            } 
        })
    })

    r.post("/logout", {
        preHandler: [authMiddleware],
        schema: {
            tags: swaggerTags,
            summary: "Logout",
            security: [{ bearerAuth: [] }],
        }
    }, async (req, reply) => {
        const { currentUser } = req
        await authService.logout(currentUser.id!)

        return reply.code(200).send({ message: "sessions destroyed successfully" })
    })
}