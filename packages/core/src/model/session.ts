import tokenModel from '../schema/token';
import { TokenModel, TokenType } from './token';

export interface SessionDoc extends Object {
    createAt: Date,
    updateAt: Date,
    data: {
        ua: String,
        ip: String,
    }
}

export class SessionModel {
    static async getSessions(tokenId: string) {
        const token: any = await TokenModel.get(tokenId, TokenType.SESSION);
        if (token === null) {
            throw new Error('invalid_token');
        }
        const { uuid } = token.data;
        const sessions = await tokenModel.find({ 'data.uuid': uuid });
        return sessions.map((session) => ({
            uuid: session.uuid,
            createAt: session.createAt,
            updateAt: session.updateAt,
            ip: session.data.ip,
            ua: session.data.ua,
        }));
    }

    static async deleteSession(tokenId: string, sessionId: string) {
        const token: any = await TokenModel.get(tokenId, TokenType.SESSION);
        if (token === null) {
            throw new Error('invalid_token');
        }
        const session: any = await TokenModel.get(sessionId, TokenType.SESSION);
        if (session === null) {
            throw new Error('invalid_session');
        }
        if (token.data.uuid === session.uuid) {
            await TokenModel.delete(sessionId, TokenType.SESSION);
        }
    }

    static async deleteAll(tokenId: string) {
        const sessionList = await SessionModel.getSessions(tokenId);
        // eslint-disable-next-line no-restricted-syntax
        for (const session of sessionList) {
            TokenModel.delete(session.uuid, TokenType.SESSION);
        }
    }
}
