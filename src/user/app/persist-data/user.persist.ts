import { User } from "../entities/user";

export interface UserPersistData {

    findById(id: string): Promise<User | null>

}