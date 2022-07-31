import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import OAuthServer from 'express-oauth-server';

import { port } from './config';
import bus from './model/bus';
import log from './model/logger';
import resolvers from './resolvers';
import typeDefs from './schema';
import { isMail } from './utils';

const app: any = express();
app.oauth = new OAuthServer({
    // eslint-disable-next-line global-require
    model: require('./model/oauth'),
});
app.use(cookieParser());
// app.use(app.oauth.authorize());

const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    // debug: false,
    context: (expressContext) => ({
        ip: expressContext.req.ip,
        ua: expressContext.req.headers['user-agent'],
        cookies: expressContext.req.cookies,
    }),
});

(async () => {
    log('SYS', 'Server preparing.');
    await new Promise((resolve) => {
        bus.on('mongo/connected', () => {
            resolve(undefined);
        });
    });
    bus.emit('app/prepared');
})();

bus.on('app/prepared', async () => {
    log('SYS', 'Server starting.');
    await apollo.start();
    apollo.applyMiddleware({ app });
    app.listen({ port }, () => {
        bus.emit('app/started');
    });
});

bus.on('app/started', () => {
    log('SYS', 'Server started.');
});

bus.on('mail/send', async (mail: string, context: string) => {
    if (!isMail(mail)) {
        throw new Error('invalid_email');
    }
    log('MAIL', `${mail} ${context}`);
});

process.on('exit', (code) => {
    log('SYS', `Server exit with code ${code}`);
});

process.on('SIGINT', () => {
    log('SYS', 'Server exit with SIGINT');
});
