/* eslint-disable camelcase */
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser, { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { centerUrl, port } from './config';
import bus from './model/bus';
import log from './model/logger';
import * as OAuth from './model/oauth';
import { TokenModel, TokenType } from './model/token';
import resolvers from './resolvers';
import typeDefs from './schema';
import { isMail } from './utils';

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

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

const init = async () => {
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

    app.get('/oauth/authorize', async (req, res) => {
        const {
            client_id, redirect_uri, scope,
        } = req.query;

        if (typeof client_id !== 'string'
            || typeof redirect_uri !== 'string'
            || typeof scope !== 'string') {
            res.status(400).json({
                status: 'error',
                info: 'Invalid request',
            });
            return;
        }

        const client = await OAuth.verifyClient(client_id);
        if (!client) {
            res.status(400).json({
                status: 'error',
                info: 'Invalid client',
            });
            return;
        }

        res.redirect(
            302,
            `${centerUrl}/#/authorize?client_id=${client_id}&client_name=${client}&redirect_uri=${redirect_uri}&scope=${scope}`,
        );
    });

    app.post('/oauth/authorize', async (req, res) => {
        const {
            client_id, redirect_uri, scope, session_id,
        } = req.body;

        if (typeof client_id !== 'string'
            || typeof redirect_uri !== 'string'
            || typeof scope !== 'string'
            || typeof session_id !== 'string') {
            res.status(400).json({
                status: 'error',
                info: 'Invalid request',
            });
            return;
        }

        const client = await OAuth.verifyClient(client_id);
        if (!client) {
            res.status(400).json({
                status: 'error',
                info: 'Invalid client',
            });
            return;
        }

        const token = await TokenModel.get(session_id, TokenType.SESSION);
        if (!token) {
            res.status(400).json({
                status: 'error',
                info: 'Invalid session',
            });
            return;
        }

        const t = await OAuth.verifyRedirectUri(client_id, redirect_uri);
        if (t === false) {
            res.status(400).json({
                status: 'error',
                info: 'Invalid redirect uri',
            });
            return;
        }

        const user_id = token.data.uuid;
        const code = await OAuth.generateAuthCode(client_id, user_id, scope);

        res.redirect(
            302,
            `${redirect_uri}?code=${code}`,
        );
    });

    app.post('/oauth/token', async (req, res) => {
        let {
            client_id, client_secret,
        } = req.body;
        const { code } = req.body;

        const basic = req.get('Authorization');
        if (basic?.includes('Basic ')) {
            const [id, secret] = Buffer.from(basic.split(' ')[1], 'base64').toString().split(':');
            client_id = id;
            client_secret = secret;
        }

        if (typeof client_id !== 'string'
            || typeof client_secret !== 'string'
            || typeof code !== 'string') {
            res.status(400).json({
                status: 'error',
                info: 'Invalid request',
            });
            return;
        }

        const client = await OAuth.verifyClient(client_id, client_secret);
        if (!client) {
            res.status(400).json({
                status: 'error',
                info: 'Invalid client',
            });
            return;
        }

        try {
            const {
                accessToken,
                refreshToken,
                accessTTL,
                refreshTTL,
            } = await OAuth.getAccessToken(code);

            res.json({
                status: 'success',
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    access_ttl: accessTTL,
                    refresh_ttl: refreshTTL,
                },
            });
        } catch (e) {
            res.status(400).json({
                status: 'error',
                info: e,
            });
        }
    });

    app.post('/oauth/refresh', async (req, res) => {
        const {
            client_id, client_secret, refresh_token,
        } = req.body;

        if (typeof client_id !== 'string'
            || typeof client_secret !== 'string'
            || typeof refresh_token !== 'string') {
            res.status(400).json({
                status: 'error',
                info: 'Invalid request',
            });
            return;
        }

        const client = await OAuth.verifyClient(client_id, client_secret);
        if (!client) {
            res.status(400).json({
                status: 'error',
                info: 'Invalid client',
            });
            return;
        }

        try {
            const {
                accessToken,
                refreshToken,
                accessTTL,
                refreshTTL,
            } = await OAuth.refreshAccessToken(refresh_token);

            res.json({
                status: 'success',
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    access_ttl: accessTTL,
                    refresh_ttl: refreshTTL,
                },
            });
        } catch (e) {
            res.status(400).json({
                status: 'error',
                info: e,
            });
        }
    });

    app.post('/cb', async (req) => {
        console.log(req.query, req.body);
    });

    app.listen({ port }, () => {
        bus.emit('app/started');
    });
};

bus.on('app/prepared', async () => {
    log('SYS', 'Server starting.');
    await init();
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
