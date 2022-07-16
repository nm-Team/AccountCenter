import { gql } from 'apollo-server-express';

const typeDefs = gql`
"User Document type"
type User {
    id: Int!,
    user: String!,
    mail: String,
    nick: String,
    avatar: String,
    mood: String,
    role: String,

    regat: Int,
    loginat: Int,
    loginip: String,
}
type UserResolvers {
    "Register a account"
    register(user: String, pass: String, mail: String): String,
    "Activate a account"
    active(mailId: String, token: String): Boolean,
    login(user: String, mail: String, token: String): String,

}

type Query {
    User: UserResolvers,
}
`;

export default typeDefs;
