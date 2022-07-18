import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import express from 'express';

import { port } from './config';
import bus from './model/bus';
import resolvers from './resolvers';
import typeDefs from './schema';
import { isMail } from './utils';

const app = express();
app.use(cookieParser());

const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: (expressContext) => ({
        ip: expressContext.req.ip,
        ua: expressContext.req.headers['user-agent'],
        cookies: expressContext.req.cookies,
    }),
});

(async () => {
    console.log('[INFO] Server starting.');
    await new Promise((resolve) => {
        bus.on('mongo/connected', () => {
            resolve(undefined);
        });
    });
    bus.emit('app/prepared');
})();

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
