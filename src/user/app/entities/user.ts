export class User {

    id: string
    name: string
    username: string
    email: string
    password: string
    emailVerified: boolean
    createdAt: Date
    updatedAt: Date

    constructor(data: Partial<User>) {
        Object.assign(data, this)
    }
}