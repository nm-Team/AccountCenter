import crypto_ from 'crypto';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import {
    OAuthAccessTokenModel, OAuthClientModel, OAuthCodeModel, OAuthRefreshTokenModel,
} from '../schema/oauth';

export interface OAuthClient extends Document {
    name: string;
    description: string;
    icon: string;
    regTime: Date;
    clientId: string;
    clientSecret: string;
    redirectUris: string[];
    ownerId: string;
}

export interface OAuthCode extends Document {
    code: string;
    userId: string;
    clientId: string;
    scope: string;
    ttl: {
        type: Date,
        expires: 60,
    };
}

export interface OAuthAccessToken extends Document {
    accessToken: string;
    userId: string;
    clientId: string;
    scope: string;
    ttl: Date;
}

export interface OAuthRefreshToken extends Document {
    refreshToken: string;
    userId: string;
    clientId: string;
    scope: string;
    ttl: Date;
}

const day = 1000 * 60 * 60 * 24;
const codeTTL = day / 24;
const accessTTL = day;
const refreshTTL = day * 7;

export default class OAuth {
    static async generateAuthCode(client: string, userId: string, scope: string): Promise<string> {
        const authCode = uuidv4();

        await OAuthCodeModel.create({
            code: authCode,
            clientId: client,
            userId,
            scope,
            ttl: new Date(Date.now() + codeTTL),
        });

        return authCode;
    }

    static getAccessToken = async (authCode: string) => {
        const code = await OAuthCodeModel.findOne({ code: authCode }).exec();

        if (!code) {
            throw new Error('Invalid auth code');
        }

        if (code.ttl.getTime() < Date.now()) {
            throw new Error('Auth code has expired');
        }

        const client = await OAuthClientModel.findOne({ clientId: code.clientId }).exec();
        if (!client) {
            throw new Error('Invalid client');
        }

        const accessToken = uuidv4();
        const refreshToken = uuidv4();

        const date = Date.now();

        await OAuthAccessTokenModel.create({
            accessToken,
            clientId: code.clientId,
            userId: code.userId,
            scope: code.scope,
            ttl: new Date(date + accessTTL),
        });

        await OAuthRefreshTokenModel.create({
            refreshToken,
            clientId: code.clientId,
            userId: code.userId,
            scope: code.scope,
            ttl: new Date(date + refreshTTL),
        });

        await code.remove();

        return {
            accessToken,
            refreshToken,
            accessTTL: new Date(date + accessTTL),
            refreshTTL: new Date(date + refreshTTL),
        };
    };

    static verifyAccessToken = async (accessToken: string): Promise<boolean> => {
        const token = await OAuthAccessTokenModel.findOne({ accessToken }).exec();

        return !!token && token.ttl.getTime() > Date.now();
    };

    static refreshAccessToken = async (refreshToken: string) => {
        const token = await OAuthRefreshTokenModel.findOne({ refreshToken }).exec();

        if (!token) {
            throw new Error('Invalid refresh token');
        }

        if (token.ttl.getTime() < Date.now()) {
            throw new Error('Refresh token has expired');
        }

        const client = await OAuthClientModel.findOne({ clientId: token.clientId }).exec();
        if (!client) {
            throw new Error('Invalid client');
        }

        const date = Date.now();

        const newAccessToken = uuidv4();
        const newRefreshToken = uuidv4();

        await OAuthAccessTokenModel.remove({ userId: token.userId, clientId: token.clientId }).exec();
        await OAuthRefreshTokenModel.remove({ userId: token.userId, clientId: token.clientId }).exec();

        await OAuthAccessTokenModel.create({
            accessToken: newAccessToken,
            clientId: token.clientId,
            userId: token.userId,
            scope: token.scope,
            ttl: new Date(date + accessTTL),
        });

        await OAuthRefreshTokenModel.create({
            refreshToken: newRefreshToken,
            clientId: token.clientId,
            userId: token.userId,
            scope: token.scope,
            ttl: new Date(date + refreshTTL),
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            accessTTL: new Date(date + accessTTL),
            refreshTTL: new Date(date + refreshTTL),
        };
    };

    static verifyClient = async (clientId: string, clientSecret?: string): Promise<string | boolean> => {
        let client;
        if (clientSecret) {
            client = await OAuthClientModel.findOne({ clientId, clientSecret }).exec();
        } else {
            client = await OAuthClientModel.findOne({ clientId }).exec();
        }
        if (!client) {
            return false;
        }
        return client.name;
    };

    static verifyRedirectUri = async (clientId: string, redirectUri: string): Promise<boolean> => {
        const client = await OAuthClientModel.findOne({ clientId }).exec();

        if (!client) {
            return false;
        }

        const redirectUris = client?.redirectUris || [];
        return redirectUris.includes(redirectUri);
    };

    static createClient = async (
        name: string,
        description: string,
        redirectUris: string[],
        ownerId: string,
    ) => {
        if (!name || !redirectUris || !ownerId) {
            return false;
        }

        const clientId = uuidv4();
        const clientSecret = crypto_.createHash('sha256').update(uuidv4()).digest('hex');
        await OAuthClientModel.create({
            name,
            description,
            icon: '',
            regTime: new Date(),
            clientId,
            clientSecret,
            redirectUris,
            ownerId,
        });

        return { clientId, clientSecret };
    };

    static updateClient = async (
        clientId: string,
        name: string | undefined,
        description: string | undefined,
        icon: string | undefined,
        redirectUris: string[] | undefined,
    ) => {
        if (!clientId) {
            return false;
        }

        const info = await OAuth.getClient(clientId);
        if (!info) {
            return false;
        }

        if (!name && !redirectUris && !description && !icon) {
            return false;
        }

        await OAuthClientModel.updateOne({ clientId }, {
            name: name || info.name,
            redirectUris: redirectUris || info.redirectUris,
            description: description || info.description,
            icon: icon || info.icon,
        });

        return true;
    };

    static getClient = async (clientId: string) => {
        const client = await OAuthClientModel.findOne({ clientId }).exec();

        if (!client) {
            return false;
        }

        return client;
    };

    static getClientByUser = async (userId: string) => {
        const clients = await OAuthClientModel.find({ ownerId: userId }).exec();

        if (!clients) {
            return false;
        }

        return clients;
    };

    static getClientList = async () => {
        const clients = await OAuthClientModel.find().exec();

        if (!clients) {
            return false;
        }

        const clientList = clients.map((e) => ({
            name: e.name,
            description: e.description,
            icon: e.icon,
            clientId: e.clientId,
            ownerId: e.ownerId,
            redirectUris: e.redirectUris,
        }));

        return clientList;
    };
}
