import { FastifyBaseLogger } from "fastify";
import { PermissionDeniedException } from "../exceptions/permission-denied-exception";
import { NetworkErrorException } from "../exceptions/network-error-exception";
import { BadRequestException } from "../exceptions/bad-request-exception";

interface ParseServerErrorHandlerProps {
    err: any
    className: string
    log: FastifyBaseLogger
    action?: string
}

export function parseServerErrorHandler(
    { err, className, log, action }: ParseServerErrorHandlerProps
): void {
    switch(err.code) {
        case 141: //Consulta inválida
            throw new BadRequestException("Invalid query parameters")
        case 150: //Permissão negada
            throw new PermissionDeniedException(`permission denied to ${action}`)
        case 100: //Erro ao conectar com o servidor ou timeout
            throw new NetworkErrorException("Network error. Please try again latter")
        default:
            throw new Error(err.message)
    }
}