export class User {

    id: string
    name: string
    email: string
    password: string
    emailVerified: boolean
    createdAt: Date
    updatedAt: Date

    constructor(data: Partial<User>) {
        Object.assign(this, data)
    }
}