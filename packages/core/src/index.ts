import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

// import OAuthServer from 'express-oauth-server';
import { port } from './config';
import bus from './model/bus';
import log from './model/logger';
import resolvers from './resolvers';
import typeDefs from './schema';
import { isMail } from './utils';

const app: any = express();

app.use(cookieParser());

// app.oauth = new OAuthServer({
//     // eslint-disable-next-line global-require
//     model: require('./model/oauth'),
// });

// app.get('/oauth2/authorize', app.oauth.authorize());
// app.post('/oauth2/token', app.oauth.token());

const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
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
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        json(),
        expressMiddleware(apollo, {
            context: async ({ req }) => (
                {
                    ip: req.ip,
                    ua: req.headers['user-agent'],
                    cookies: req.cookies,
                }
            ),
        }),
    );
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
