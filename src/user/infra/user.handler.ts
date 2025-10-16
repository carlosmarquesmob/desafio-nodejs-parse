import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyTypedInstance } from "src/common/@types/fastify-typed-instance";
import { UserService } from "../app/user.service";
import { ParseUserPersist } from "./persist-data/parse/parse-user.persist";
import { z } from "zod";

const swaggerTags = ["Users"]

export function userRoutes(app: FastifyTypedInstance) {

    const r = app.withTypeProvider<ZodTypeProvider>()
    
    const userService = new UserService(new ParseUserPersist(app.log))
    
    r.get(":id", {
        schema: {
            tags: swaggerTags,
            summary: "Find User By Id",
            params: z.object({
                id: z.string()
            })
        }
    }, async (req, reply) => {
        const { id } = req.params
        const user = await userService.findUserById(id)

        return reply.code(200).send(user)
    })

}