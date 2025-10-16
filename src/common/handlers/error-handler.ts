import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { NotFoundException } from "../exceptions/not-found-exception";
import { BadRequestException } from "../exceptions/bad-request-exception";
import { NetworkErrorException } from "../exceptions/network-error-exception";
import { PermissionDeniedException } from "../exceptions/permission-denied-exception";
import { ConflictException } from "../exceptions/conflict-exception";

export async function errorHandler(
    err: FastifyError, 
    request: FastifyRequest, 
    reply: FastifyReply
) {
    if(err.validation) {
        return reply.status(400).send({
            statusCode: 400,
            error: "BadRequest",
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
    } else if(err instanceof BadRequestException) {
        return replyError(400)
    } else if(err instanceof NetworkErrorException) {
        return replyError(503)
    } else if(err instanceof PermissionDeniedException) {
        return replyError(401)
    } else if(err instanceof ConflictException) {
        return replyError(409)
    }

    return reply.code(500).send({
        error: "Internal Server Error"
    })
}