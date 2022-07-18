import { Collection } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

import { checkUser, isMail } from '../utils';
import bus from './bus';
import { sha1 } from './crypto';
import db from './mongo';
import { TokenModel, TokenType } from './token';

/* eslint-disable lines-between-class-members */

let coll: Collection;

bus.once('mongo/connected', () => {
    coll = db.collection('user');
});

export interface UserDoc extends Object {
    uuid: string;
    _pass: string;

    user: string;
    mail: string;
    nick: string;
    avatar: string;
    mood: string;
    role: string;

    regat: Date;
    loginat: Date;
    loginip: string;
}

export class UserModel {
    static defaultUdoc: UserDoc = {
        uuid: '12345678-1234-1234-1234-123456789012',
        _pass: '',

        user: 'guest',
        mail: 'guest@nmnm.fun',
        nick: 'Guest',
        avatar: 'gravatar:guest@nmnm.fun',
        mood: 'Welcome to nmTeam',
        role: 'guest',

        regat: new Date('2021-06-14'),
        loginat: new Date('2021-06-14'),
        loginip: '127.0.0.1',
    };

    static async getByUUID(uuid: string): Promise<UserDoc> {
        const doc = await coll.findOne({
            uuid,
        });
        if (doc === null) {
            return UserModel.defaultUdoc;
        }
        return {
            uuid,
            _pass: doc.pass,

            user: doc.user,
            mail: doc.mail,
            nick: doc.nick,
            avatar: doc.avatar,
            mood: doc.mood,
            role: doc.role,

            regat: doc.regat,
            loginat: doc.logat,
            loginip: doc.loginip,
        };
    }

    static async getByUser(user: string): Promise<UserDoc> {
        const doc = await coll.findOne({
            user,
        });
        if (doc === null) {
            return UserModel.defaultUdoc;
        }
        return {
            uuid: doc.uuid,
            _pass: doc.pass,

            user,
            mail: doc.mail,
            nick: doc.nick,
            avatar: doc.avatar,
            mood: doc.mood,
            role: doc.role,

            regat: doc.regat,
            loginat: doc.logat,
            loginip: doc.loginip,
        };
    }

    static async getByMail(mail: string): Promise<UserDoc> {
        const doc = await coll.findOne({
            mail,
        });
        if (doc === null) {
            return UserModel.defaultUdoc;
        }
        return {
            uuid: doc.uuid,
            _pass: doc.pass,

            user: doc.user,
            mail,
            nick: doc.nick,
            avatar: doc.avatar,
            mood: doc.mood,
            role: doc.role,

            regat: doc.regat,
            loginat: doc.logat,
            loginip: doc.loginip,
        };
    }

    static async register(
        user: string,
        pass: string,
        mail: string,
    ) {
        if (!isMail(mail)) {
            throw new Error('Not a valid email');
        }
        if (!checkUser(user)) {
            throw new Error('Not a valid user');
        }
        if (await this.getByMail(mail) !== UserModel.defaultUdoc) {
            throw new Error('Mail already be used');
        }
        if (await this.getByUser(user) !== UserModel.defaultUdoc) {
            throw new Error('Username already be used');
        }

        const uuid = uuidv4();
        const mailId = uuidv4();
        bus.emit('mail/send', mail, mailId);
        const tokenId = TokenModel.add(TokenType.REGISTER, 1800, {
            uuid, user, pass, mail, mailId,
        });
        return tokenId;
    }

    static async active(mailId: string, tokenId: string) {
        const token: any = await TokenModel.get(tokenId, TokenType.REGISTER);

        if (token === null) {
            throw new Error('Token expired');
        }
        if (token.mailId !== mailId) {
            throw new Error('Verification failed');
        }

        const time = new Date();
        coll.insertOne({
            uuid: token.uuid,
            user: token.user,
            pass: sha1(token.uuid + token.pass),
            mail: token.mail,
            nick: token.user,
            avatar: 'mail:guest@nmnm.fun',
            moon: 'Welcome to nmTeam',
            role: 'user',
            regat: time,
            loginat: time,
        });
        TokenModel.delete(tokenId, TokenType.REGISTER);
    }

    static async login(user: string, pass: string, ua: string, ip: string): Promise<string> {
        const doc = await UserModel.getByUser(user);
        if (doc === UserModel.defaultUdoc) {
            throw new Error('User not found');
        }
        if (sha1(doc.uuid + pass) !== doc._pass) {
            throw new Error('Password is not correct');
        }
        const token = TokenModel.add(TokenType.SESSION, 24 * 60 * 60, {
            uuid: doc.uuid,
            user: doc.user,
            ua,
            ip,
        });
        coll.updateOne(
            { uuid: doc.uuid },
            {
                $set: {
                    loginat: new Date(),
                    loginip: ip,
                },
            },
        );
        return token;
    }
}
