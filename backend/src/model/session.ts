import { Collection } from 'mongodb';

import bus from './bus';
import db from './mongo';
import { TokenModel, TokenType } from './token';

let coll: Collection;

bus.once('mongo/connected', () => {
    coll = db.collection('token');
});

export interface SessionDoc extends Object {
    createAt: Date,
    updateAt: Date,
    ua: String,
    ip: String,
}

export class SessionModel {
    static async getSesions(tokenId: string) {
        const token: any = await TokenModel.get(tokenId, TokenType.SESSION);
        if (token === null) {
            throw new Error('Token is expired');
        }
        const { uuid } = token;
        const sessions = await coll.find({ uuid }).toArray();
        return sessions;
    }

    static async deleteSession(tokenId: string, sessionId: string) {
        const token: any = await TokenModel.get(tokenId, TokenType.SESSION);
        if (token === null) {
            throw new Error('Token is expired');
        }
        const session: any = await TokenModel.get(sessionId, TokenType.SESSION);
        if (session === null) {
            throw new Error('Session is expired');
        }
        if (token.uuid === session.uuid) {
            await TokenModel.delete(sessionId, TokenType.SESSION);
        }
    }

    static async deleteAll(tokenId: string) {
        const sessionList = await SessionModel.getSesions(tokenId);
        // eslint-disable-next-line no-restricted-syntax
        for (const session of sessionList) {
            TokenModel.delete(session._id.toString(), TokenType.SESSION);
        }
    }
}
