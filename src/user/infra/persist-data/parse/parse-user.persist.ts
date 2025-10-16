import Parse from "parse/node.js";
import { User } from "src/user/app/entities/user";
import { toParseUserPersist, toUserPersistDomain } from "./mappers/parse-user-persist.mapper";
import { FastifyBaseLogger } from "fastify";
import { parseServerErrorHandler } from "src/common/handlers/parse-server-error-handler";
import { UserPersistData } from "src/user/app/persist-data/user.persist";

const CLASS = Parse.User
const UserObject = Parse.User

export class ParseUserPersist implements UserPersistData {

    constructor(
        private readonly log: FastifyBaseLogger
    ) {}
    
    async create(user: User): Promise<{ sessionToken: string | null, email: string }> {
        try {
            const userObject = toParseUserPersist(user, Parse.User)
            userObject.set("username", user.email)

            await userObject.signUp({ useMasterKey: true })

            const sessionToken = userObject.getSessionToken()

            if(!sessionToken) return { sessionToken: null, email: "" }
            return {
                sessionToken,
                email: userObject.get("email"),
            }
        }catch(err) {
            parseServerErrorHandler({
                err, log: this.log, className: CLASS.name, action: "create user"
            })
            throw err
        }
    }

    async verifyUserCredentials(email: string, password: string): Promise<{ sessionToken: string | null, email: string }> {
        try {
            const user = await Parse.User.logIn(email, password);
            const sessionToken = user.getSessionToken()
            if(!sessionToken) return { sessionToken: null, email: "" }
            return {
                sessionToken,
                email: user.get("email"),
            }
        }catch(err) {
            parseServerErrorHandler({
                err, log: this.log, className: CLASS.name, action: "verify user credentials"
            })
            throw err
        }
    }

    async deleteUserSession(id: string): Promise<void> {
        try {
            const query = new Parse.Query(Parse.Session)
            query.equalTo("user", Parse.User.createWithoutData(id))
            const sessions = await query.find({ useMasterKey: true })

            if(sessions.length) {
                await Parse.Object.destroyAll(sessions, { useMasterKey: true })
            }
        }catch(err) {
            parseServerErrorHandler({
                err, log: this.log, className: CLASS.name, action: "delete user session"
            })
            throw err
        }
    }

    async findById(id: string): Promise<User | null> {
        try {
            const query = new Parse.Query(Parse.User)
            const result = await query.get(id, { useMasterKey: true })
            if(!result) return null
            return toUserPersistDomain(result)
        }catch(err) {
            if(err.code === Parse.Error.OBJECT_NOT_FOUND) {
                return null
            }
            parseServerErrorHandler({
                err, log: this.log, className: CLASS.name, action: "find user"
            })
            throw err
        }
    }
}