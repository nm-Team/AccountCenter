import { gql } from 'apollo-server-express';

const typeDefs = gql`
scalar BigInt

"User Document type"
type User {
    uuid: String!,
    user: String!,
    nick: String,
    avatar: String,
    mail: String,
    mood: String,
    role: String,

    regat: BigInt,
    loginat: BigInt,
    loginip: String,

    tfa: Boolean,
}

type Session {
    uuid: String,
    createAt: BigInt,
    updateAt: BigInt,
    ua: String,
    ip: String,
}

type UserResolvers {
    "Register a account"
    register(user: String, pass: String, mail: String, language: String): Boolean,
    "Activate a account"
    active(token: String): Boolean,
    "Login"
    login(user: String, pass: String, code: String): String,
    "Logoug"
    logout: Boolean,
    "Logout all"
    logoutAll: Boolean,
    "Change password"
    changePass(oldPass: String, newPass: String): Boolean,
    "Change avatar"
    changeAvatar(avatar: String): Boolean,
    "Change nick"
    changeNick(nick: String): Boolean,
    "Change mood"
    changeMood(mood: String): Boolean,
    "Get user information by uuid, user, mail or token"
    getUser: User,
    "Get online sessions"
    getSession: [Session],
    "Logout the specified session"
    logoutSession(token: String): Boolean,
    "Reset password query"
    resetPassQuery(user: String, mail: String, language: String): Boolean,
    "Reset password"
    resetPass(token: String, pass: String): Boolean,
}

type twoFactorAuthResolvers {
    "Generate a two factor auth secret"
    generate: String,
    "Turn on two factor authentication"
    enable(secret: String, code: String): Boolean,
    "Turn off two factor authentication"
    disable(code: String): Boolean,
}

type sudoModeInfo {
    uuid: String,
    sudo: Boolean,
    pass: Boolean,
    tfa: Boolean,
}

type sudoModeResolvers {
    "enable sudoMode"
    enable(pass: String, code: String): Boolean,
    "list sudoMode"
    info: sudoModeInfo,
}

type Query {
    User(uuid: String, user: String, mail: String, token: String): UserResolvers,
    twoFactorAuth(token: String): twoFactorAuthResolvers,
    sudoMode(token: String): sudoModeResolvers,
}
`;

export default typeDefs;
