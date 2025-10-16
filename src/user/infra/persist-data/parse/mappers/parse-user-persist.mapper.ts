import { User } from "src/user/app/entities/user";

export function toParseUserPersist(user: User, UserObject: new () => Parse.User) {
    const object = new UserObject()
    object.set("username", user.username)
    object.set("name", user.name)
    object.set("email", user.email)
    object.set("password", user.password)
    object.set("emailVerified", user.emailVerified)
    object.set("createdAt", user.createdAt)
    object.set("updatedAt", user.updatedAt)
    return object
} 

export function toUserPersistDomain(parseObject: Parse.Object) {
    const { name, username, email, password, emailVerified, createdAt, updatedAt } = parseObject.attributes
    return new User({
        id: parseObject._getId(),
        name,
        username,
        email,
        password,
        emailVerified,
        createdAt,
        updatedAt
    })
}