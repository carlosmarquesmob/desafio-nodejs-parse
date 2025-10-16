import { AuthRespondeDTO } from "src/auth/app/dto/auth-response.dto";
import { CreateUserDTO } from "src/auth/app/dto/create-user.dto";
import { SignInDTO } from "src/auth/app/dto/sign-in.dto";
import { AuthService } from "src/auth/app/services/auth.service";
import { NotFoundException } from "src/common/exceptions/not-found-exception";
import { User } from "src/user/app/entities/user";
import { ParseUserPersist } from "src/user/infra/persist-data/parse/parse-user.persist";

export class ParseAuthService implements AuthService {

    constructor(
        private readonly userPersist: ParseUserPersist
    ) {}

    async signIn(dto: SignInDTO): Promise<AuthRespondeDTO> {
        const { email, password } = dto
        const { sessionToken, email: userEmail } = await this.userPersist.verifyUserCredentials(email, password)

        if(!sessionToken) {
            throw new Error("Authentication failed - missing session token")
        }

        return {
            token: sessionToken,
            email: userEmail,
        }
    }

    async signUp(dto: CreateUserDTO): Promise<AuthRespondeDTO> {
        const { email, name, password } = dto

        const now = new Date()
        const user = new User({
            name,
            password,
            email,
            createdAt: now,
            updatedAt: now
        })

        const { email: emailCreated, sessionToken } = await this.userPersist.create(user)

        if(!sessionToken) {
            throw new Error("Authentication failed - missing session token")
        }

        return {
            email: emailCreated,
            token: sessionToken
        }
    }

    async logout(id: string): Promise<void> {
        await this.userPersist.deleteUserSession(id)
    }
}