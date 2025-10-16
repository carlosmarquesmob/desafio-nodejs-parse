import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyTypedInstance } from "src/common/@types/fastify-typed-instance";
import { UserService } from "../app/user.service";
import { ParseUserPersist } from "./persist-data/parse/parse-user.persist";
import { authMiddleware } from "src/common/middlewares/auth.middleware";

const swaggerTags = ["Users"]

export function userRoutes(app: FastifyTypedInstance) {

    const r = app.withTypeProvider<ZodTypeProvider>()
    
    const userService = new UserService(new ParseUserPersist(app.log))
    
    r.get("/me", {
        preHandler: [authMiddleware],
        schema: {
            tags: swaggerTags,
            summary: "Find User",
            security: [{ bearerAuth: [] }],
        }
    }, async (req, reply) => {
        const { currentUser } = req

        return reply.code(200).send({
            id: currentUser.id!,
            email: currentUser.get("email"),
            name: currentUser.get("name"),
            createdAt: currentUser.get("createdAt"),
            updatedAt: currentUser.get("updatedAt")
        })
    })

}