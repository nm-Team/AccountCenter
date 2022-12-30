import { v4 as uuidv4 } from 'uuid';

import {
    checkAvatar,
    checkNick,
    checkPass,
    checkUser,
    isMail,
    seeable,
} from '../utils';
import twoFactorAuth from './2fa';
import bus from './bus';
import { md5, sha1 } from './crypto';
import Mail from './mail';
import { Permission } from './permission';
import { SessionModel } from './session';
import { TokenModel, TokenType } from './token';
import userModel from '../schema/user';

/* eslint-disable lines-between-class-members */

export interface UserDoc extends Object {
    uuid: string;
    _pass: string;

    user: string;
    mail: string;
    nick: string;
    avatar: string;
    mood: string;
    role: string;
    permBlack: string[];

    regat: Date;
    loginat: Date;
    loginip: string;

    tfa: boolean;
    _tfa?: string;
}

export class UserModel {
    static defaultUdoc: UserDoc = {
        uuid: '12345678-90AB-CDEF-GHIJ-KLMNOPQR',
        _pass: '',

        user: 'guest',
        mail: 'guest@nmnm.fun',
        nick: 'Guest',
        avatar: 'mail:guest@nmnm.fun',
        mood: 'Welcome to nmTeam',
        role: 'guest',
        permBlack: [],

        regat: new Date('2021-06-14'),
        loginat: new Date('2021-06-14'),
        loginip: '127.0.0.1',

        tfa: false,
    };

    static async getByUUID(uuid: string): Promise<UserDoc> {
        const doc = await userModel.findOne({
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
            permBlack: doc.permBlack,

            regat: doc.regat,
            loginat: doc.logat,
            loginip: doc.loginip,

            tfa: doc.tfa !== undefined && doc.tfa !== null,
            _tfa: doc.tfa,
        };
    }

    static async getByUser(user: string): Promise<UserDoc> {
        const doc = await userModel.findOne({
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
            permBlack: doc.permBlack,

            regat: doc.regat,
            loginat: doc.logat,
            loginip: doc.loginip,

            tfa: doc.tfa !== undefined && doc.tfa !== null,
            _tfa: doc.tfa,
        };
    }

    static async getByMail(mail: string): Promise<UserDoc> {
        const doc = await userModel.findOne({
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
            permBlack: doc.permBlack,

            regat: doc.regat,
            loginat: doc.logat,
            loginip: doc.loginip,

            tfa: doc.tfa !== undefined && doc.tfa !== null,
            _tfa: doc.tfa,
        };
    }

    static async setByUUID(uuid: string, data: Partial<UserDoc>) {
        const ret = await userModel.updateOne(
            { uuid },
            data,
        );
        return ret;
    }

    static async setByUser(user: string, data: Partial<UserDoc>) {
        const ret = await userModel.updateOne(
            { user },
            data,
        );
        return ret;
    }

    static async setByMail(mail: string, data: Partial<UserDoc>) {
        const ret = await userModel.updateOne(
            { mail },
            data,
        );
        return ret;
    }

    static async register(
        user: string,
        pass: string,
        mail: string,
        language: string,
    ) {
        if (!isMail(mail)) {
            throw new Error('invalid_mail');
        }
        if (!checkUser(user)) {
            throw new Error('invalid_user');
        }
        if (await this.getByMail(mail) !== UserModel.defaultUdoc) {
            throw new Error('used_mail');
        }
        if (await this.getByUser(user) !== UserModel.defaultUdoc) {
            throw new Error('used_user');
        }

        const uuid = uuidv4();
        const tokenId = await TokenModel.add(TokenType.REGISTER, 1800, {
            uuid, user, pass, mail,
        });
        Mail.send(mail, 'register', language, {
            user,
            token: tokenId,
        });
        bus.emit('mail/send', mail, tokenId);
        return true;
    }

    static async active(tokenId: string) {
        let token: any = await TokenModel.get(tokenId, TokenType.REGISTER);

        if (token === null) {
            throw new Error('invalid_token');
        }

        token = token.data.data;

        const time = new Date();
        const doc = await userModel.create({
            uuid: token.data.uuid,
            user: token.data.user,
            pass: sha1(token.data.uuid + token.data.pass),
            mail: token.data.mail,
            nick: token.data.user,
            avatar: `mail:${md5(token.data.mail)}`,
            mood: 'Welcome to nmTeam',
            role: 'user',
            permBlack: [],
            regat: time,
            loginat: time,
        });
        await doc.save();

        await TokenModel.delete(tokenId, TokenType.REGISTER);
    }

    static async login(user: string, pass: string, code: string, ua: string, ip: string): Promise<string> {
        const doc = await UserModel.getByUser(user);

        if (doc === UserModel.defaultUdoc) {
            throw new Error('wrong_user');
        }

        if (sha1(doc.uuid + pass) !== doc._pass) {
            throw new Error('wrong_pass');
        }

        const perm = new Permission(doc.permBlack);
        if (!perm.check('user.login')) {
            throw new Error('no_permission');
        }

        if (doc.tfa && doc._tfa !== undefined) {
            if (twoFactorAuth.verifyToken(doc._tfa, code) !== 0) {
                throw new Error('tfa_invalid_code');
            }
        }
        const token = await TokenModel.add(TokenType.SESSION, 24 * 60 * 60, {
            uuid: doc.uuid,
            user: doc.user,
            ua,
            ip,
        });
        await userModel.updateOne(
            { uuid: doc.uuid },
            {
                loginat: new Date(),
                loginip: ip,
            },
        );
        return token;
    }

    static async changePass(
        uuid: string,
        oldPass: string,
        newPass: string,
    ) {
        const doc = await UserModel.getByUUID(uuid);
        if (doc === UserModel.defaultUdoc) {
            throw new Error('invalid_user');
        }
        if (sha1(doc.uuid + oldPass) !== doc._pass) {
            throw new Error('wrong_pass');
        }

        await userModel.updateOne(
            { uuid },
            {
                pass: sha1(doc.uuid + newPass),
            },
        );
        return true;
    }

    static async changeAvatar(uuid: string, avatar: string) {
        const doc = await UserModel.getByUUID(uuid);
        if (doc === UserModel.defaultUdoc) {
            throw new Error('invalid_user');
        }
        if (!checkAvatar(avatar)) {
            throw new Error('invalid_avatar');
        }
        UserModel.setByUUID(uuid, { avatar });
        return true;
    }

    static async changeNick(uuid: string, nick: string) {
        const doc = await UserModel.getByUUID(uuid);
        if (doc === UserModel.defaultUdoc) {
            throw new Error('invalid_user');
        }
        if (!checkNick(nick)) {
            throw new Error('invalid_nick');
        }

        UserModel.setByUUID(uuid, { nick });
        return true;
    }

    static async changeMood(uuid: string, mood: string) {
        const doc = await UserModel.getByUUID(uuid);
        if (doc === UserModel.defaultUdoc) {
            throw new Error('invalid_user');
        }
        if (!seeable(mood)) {
            throw new Error('invalid_mood');
        }

        UserModel.setByUUID(uuid, { mood });
        return true;
    }

    static async resetPassQuery(
        user: string,
        mail: string,
        language: string,
    ) {
        const doc = await UserModel.getByUser(user);
        if (doc === UserModel.defaultUdoc) {
            throw new Error('invalid_user');
        }
        if (doc.mail !== mail) {
            throw new Error('invalid_mail');
        }

        const tokenId = await TokenModel.add(
            TokenType.RESET_PASSWORD,
            1800,
            { uuid: doc.uuid },
        );
        Mail.send(mail, 'forgot_pass', language, {
            user,
            token: tokenId,
        });

        bus.emit('mail/send', mail, tokenId);
        return true;
    }

    static async resetPass(tokenId: string, pass: string) {
        const token: any = await TokenModel.get(tokenId, TokenType.RESET_PASSWORD);
        if (token === null) {
            throw new Error('invalid_token');
        }
        if (!checkPass(pass)) {
            throw new Error('invalid_pass');
        }

        userModel.updateOne(
            { uuid: token.data.uuid },
            {
                pass: sha1(token.data.uuid + pass),
            },
        );
        SessionModel.deleteAll(tokenId);
        TokenModel.delete(tokenId, TokenType.RESET_PASSWORD);

        return true;
    }
}
