import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

import bus from './model/bus';
import db from './model/mongo';
import { UserDoc, UserModel } from './model/user';
import { TokenModel, TokenType } from './model/token';
import { port } from './config';
import typeDefs from './schema';
import resolvers from './resolvers';
import { isMail } from './utils';
// Provide resolver functions for your schema fields
const app = express();
const apollo = new ApolloServer({
    typeDefs,
    resolvers,
});

async function main() {
    console.log('[INFO] Server starting...');
    await new Promise((resolve) => {
        bus.on('mongo/connected', () => {
            resolve(undefined);
        });
    });
    bus.emit('app/prepared');

}

bus.on('app/prepared', async () => {
    await apollo.start();
    apollo.applyMiddleware({ app });
    app.listen({ port }, () => {
        bus.emit('app/started');
    });
});

bus.on('mail/send', async (mail, context) => {
    if (!isMail(mail)) {
        throw new Error('Not a valid email');
    }
    console.log(`[MAIL] ${mail} ${context}`);
});

main();
