import Parse from "parse/node.js";
import { User } from "src/user/app/entities/user";
import { toParseUserPersist, toUserPersistDomain } from "./mappers/parse-user-persist.mapper";
import { FastifyBaseLogger } from "fastify";
import { parseServerErrorHandler } from "src/common/handlers/parse-server-error-handler";
import { UserPersistData } from "src/user/app/persist-data/user.persist";

const CLASS = "USER"
const UserObject = Parse.User

export class ParseUserPersist implements UserPersistData {

    constructor(
        private readonly log: FastifyBaseLogger
    ) {}

    async findById(id: string): Promise<User | null> {
        try {
            const query = new Parse.Query(CLASS)
            const result = await query.get(id, { useMasterKey: true })
            if(!result) return null
            return toUserPersistDomain(result)
        }catch(err) {
            if(err.code === Parse.Error.OBJECT_NOT_FOUND) {
                return null
            }
            parseServerErrorHandler({
                err, log: this.log, className: CLASS, action: "find user"
            })
            throw err
        }
    }
}