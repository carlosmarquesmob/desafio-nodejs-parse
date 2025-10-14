import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { NotFoundException } from "../exceptions/not-found-exception";

export async function errorHandler(
    err: FastifyError, 
    request: FastifyRequest, 
    reply: FastifyReply
) {

    if(err.validation) {
        return reply.status(400).send({
            statusCode: 400,
            error: "Bad Request",
            message: "Validating error in the data provided",
            details: err.validation
        })
    }

    const replyError = (code: number) => {
        return reply.code(code).send({
            statusCode: code,
            error: err.name,
            message: err.message
        })
    }

    if(err instanceof NotFoundException) {
        return replyError(404)
    }

    return reply.code(500).send({
        error: "Internal Server Error"
    })
}