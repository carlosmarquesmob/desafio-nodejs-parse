import { FastifyRequest, FastifyReply } from "fastify";
import Parse from "parse/node.js";

declare module "fastify" {
    interface FastifyRequest {
        currentUser: Parse.User
        sessionToken: string
    }
}

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
       const auth = req.headers.authorization

    if (typeof auth !== "string" || !auth.startsWith("Bearer ")) {
        return reply.code(401).send({ message: "Missing or invalid Authorization header" });
    }

    const token = auth.replace("Bearer ", "").trim();
    try {
        const Session = Parse.Object.extend("_Session")
        const query = new Parse.Query(Session)

        query.equalTo("sessionToken", token)
        query.include("user")

        const session = await query.first({ useMasterKey: true })

        if(!session) {
            return reply.code(401).send({
                message: "Invalid or expired session"
            })
        }

        const user = session.get("user")

        if(!user) {
            return reply.code(401).send({
                message: "User associated with session not found"
            })
        }

        req.currentUser = user
        req.sessionToken = token
    }catch(err) {
        console.log(err)
        if(err.code === Parse.Error.INVALID_SESSION_TOKEN){
            return reply.code(401).send({ message: "Invalid or expired session" })
        } else if(err.code === 100) {
            return reply.code(503).send({ message: "Service unavailable, try again later" })
        }
            return reply.code(500).send({ message: "Authentication failed" })
    }
}
