/* eslint-disable arrow-body-style */
import { Collection } from 'mongodb';

import bus from './bus';
import db from './mongo';
import { UserDoc, UserModel } from './user';

let collTokens: Collection;
let collClients: Collection;

bus.once('mongo/connected', () => {
    collTokens = db.collection('OAuthTokens');
    collClients = db.collection('OAuthClients');
});

const getAccessToken = (bearerToken: string) => {
    return collTokens.findOne({
        accessToken: bearerToken,
    });
};

const getClient = (clientId: string, clientSecret: string) => {
    return collClients.findOne({
        clientId,
        clientSecret,
    });
};

const getRefreshToken = (refreshToken: string) => {
    return collTokens.findOne({
        refreshToken,
    });
};

const getUser = (user: string) => {
    return UserModel.getByUser(user);
};

const saveToken = (token: any, client: any, user: UserDoc) => {
    collTokens.insertOne({
        accessToken: token.accessToken,
        accessTokenExpiresOn: token.accessTokenExpiresOn,
        client,
        clientId: client.clientId,
        refreshToken: token.refreshToken,
        refreshTokenExpiresOn: token.refreshTokenExpiresOn,
        user,
        userId: user.uuid,
    }).then((res) => {
        const data: any = res;
        data.client = data.cliendId;
        data.user = data.userId;
    });
};

export {
    getAccessToken,
    getClient,
    getRefreshToken,
    getUser,
    saveToken,
};
