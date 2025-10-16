import { CreateUserDTO } from "../dto/create-user.dto"
import { SignInDTO } from "../dto/sign-in.dto"

export interface AuthService {

    signIn(dto: SignInDTO): Promise<any>
    signUp(dto: CreateUserDTO): Promise<any>

}