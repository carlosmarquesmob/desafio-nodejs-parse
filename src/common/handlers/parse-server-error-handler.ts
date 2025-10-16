import { FastifyBaseLogger } from "fastify";
import { PermissionDeniedException } from "../exceptions/permission-denied-exception";
import { NetworkErrorException } from "../exceptions/network-error-exception";
import { BadRequestException } from "../exceptions/bad-request-exception";
import { ConflictException } from "../exceptions/conflict-exception";

interface ParseServerErrorHandlerProps {
    err: any
    className: string
    log: FastifyBaseLogger
    action?: string
}

export function parseServerErrorHandler(
    { err, className, log, action }: ParseServerErrorHandlerProps
): void {
    log.error({
        message: err.message,
        parseServerCode: err.code,
        className,
        action,
        stack: err.stack
    })
    switch(err.code) {
        case 103:
            throw new BadRequestException("Invalid JSON format")
        case 141:
            throw new BadRequestException("Invalid query parameters")
        case 142:
            throw new BadRequestException("Invalid key name")
        case 150:
            throw new PermissionDeniedException(`permission denied to ${action}`)
        case 160:
            throw new ConflictException(`${className.toLowerCase().charAt(0).toUpperCase()} already exists`)
        case 100:
            throw new NetworkErrorException("Network error. Please try again latter")
        case 200:
            throw new Error("An unexpected error ocurred. Please try again latter")
        default:
            throw new Error(err.message)
    }
}