export class NetworkErrorException extends Error {
    constructor(message: string) {
        super(message)
        this.name = "NetworkError"
    }
}