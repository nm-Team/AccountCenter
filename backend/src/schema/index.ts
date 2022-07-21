import { gql } from 'apollo-server-express';

const typeDefs = gql`
scalar BigInt

"User Document type"
type User {
    uuid: String!,
    user: String!,
    mail: String,
    nick: String,
    avatar: String,
    mood: String,
    role: String,

    regat: BigInt,
    loginat: BigInt,
    loginip: String,
}

type Session {
    createAt: BigInt,
    updateAt: BigInt,
    ua: String,
    ip: String,
}

type UserResolvers {
    "Register a account"
    register(user: String, pass: String, mail: String): Boolean,
    "Activate a account"
    active(token: String): Boolean,
    "Login"
    login(user: String, pass: String): String,
    "Logoug"
    logout: Boolean,
    "Logout all"
    logoutAll: Boolean,
    "Get user information by uuid, user, mail or token"
    getUser: User,
    "Get online sessions"
    getSession: [Session],
}

type Query {
    User(uuid: String, user: String, mail: String, token: String): UserResolvers,
}
`;

export default typeDefs;
