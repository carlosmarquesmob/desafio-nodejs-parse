import { NotFoundException } from "src/common/exceptions/not-found-exception";
import { UserPersistData } from "./persist-data/user.persist";
import { UserDTO } from "./dto/user.dto";

export class UserService {

    constructor(
        private readonly userPersist: UserPersistData
    ) {}

    async findUserById(id: string): Promise<UserDTO> {
        const user = await this.userPersist.findById(id)
        if(!user) {
            throw new NotFoundException("User not found")
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.createdAt
        }
    }
}