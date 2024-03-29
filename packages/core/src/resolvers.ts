import twoFactorAuth from './model/2fa';
import Admin from './model/admin';
import OAuth from './model/oauth';
import { SessionDoc, SessionModel } from './model/session';
import SudoModel from './model/sudo';
import { TokenModel, TokenType } from './model/token';
import { UserDoc, UserModel } from './model/user';

const resolvers = {
    Query: {
        User(_: any, args: any): any {
            return args;
        },
        twoFactorAuth(_: any, args: any): any {
            return args;
        },
        async oauth(_: any, args: any): Promise<any> {
            if (args.token === undefined) {
                throw new Error('invalid_parameters');
            }
            const token: any = await TokenModel.get(args.token, TokenType.SESSION);
            if (token === null) {
                throw new Error('invalid_token');
            }
            const user = await UserModel.getByUUID(token.data.uuid);
            if (user.role !== 'admin') {
                throw new Error('invalid_permissions');
            }
            return { user, ...args };
        },
        sudoMode(_any: any, args: any): any {
            return args;
        },
        async admin(_: any, args: any): Promise<any> {
            if (args.token === undefined) {
                throw new Error('invalid_parameters');
            }
            const token: any = await TokenModel.get(args.token, TokenType.SESSION);
            if (token === null) {
                throw new Error('invalid_token');
            }
            const user = await UserModel.getByUUID(token.data.uuid);
            if (user.role !== 'admin') {
                throw new Error('invalid_permissions');
            }
            return { user, ...args };
        },
    },
    UserResolvers: {
        async register(_: any, args: any): Promise<boolean> {
            if (args.user === undefined || args.mail === undefined || args.pass === undefined || args.language === undefined) {
                throw new Error('invalid_parameters');
            }
            const ret = await UserModel.register(args.user, args.pass, args.mail, args.language);
            return ret;
        },
        async active(_: any, args: any): Promise<boolean> {
            if (args.token === undefined) {
                throw new Error('invalid_parameters');
            }
            await UserModel.active(args.token);
            return true;
        },
        async login(_: any, args: any, context: any): Promise<string> {
            if (args.user === undefined || args.pass === undefined) {
                throw new Error('invalid_parameters');
            }
            const ret = await UserModel.login(args.user, args.pass, args.code, context.ua, context.ip);
            return ret;
        },
        async logout(parent: any): Promise<boolean> {
            if (parent.token === undefined) {
                throw new Error('invalid_parameters');
            }
            await TokenModel.delete(parent.token, TokenType.SESSION);
            return true;
        },
        async logoutAll(parent: any): Promise<boolean> {
            if (parent.token === undefined) {
                throw new Error('invalid_parameters');
            }
            await SessionModel.deleteAll(parent.token);
            return true;
        },
        async changePass(parent: any, args: any): Promise<boolean> {
            if (parent.token === undefined || args.oldPass === undefined || args.newPass === undefined) {
                throw new Error('invalid_parameters');
            }
            const token: any = await TokenModel.get(parent.token, TokenType.SESSION);
            if (token === null) {
                throw new Error('invalid_token');
            }
            await UserModel.changePass(token.data.uuid, args.oldPass, args.newPass);
            await SessionModel.deleteAll(parent.token);
            return true;
        },
        async changeAvatar(parent: any, args: any): Promise<boolean> {
            if (parent.token === undefined || args.avatar === undefined) {
                throw new Error('invalid_parameters');
            }
            const token: any = await TokenModel.get(parent.token, TokenType.SESSION);
            if (token === null) {
                throw new Error('invalid_token');
            }
            await UserModel.changeAvatar(token.data.uuid, args.avatar);
            return true;
        },
        async changeNick(parent: any, args: any): Promise<boolean> {
            if (parent.token === undefined || args.nick === undefined) {
                throw new Error('invalid_parameters');
            }
            const token: any = await TokenModel.get(parent.token, TokenType.SESSION);
            if (token === null) {
                throw new Error('invalid_token');
            }
            await UserModel.changeNick(token.data.uuid, args.nick);
            return true;
        },
        async changeMood(parent: any, args: any): Promise<boolean> {
            if (parent.token === undefined || args.mood === undefined) {
                throw new Error('invalid_parameters');
            }
            const token: any = await TokenModel.get(parent.token, TokenType.SESSION);
            if (token === null) {
                throw new Error('invalid_token');
            }
            await UserModel.changeMood(token.data.uuid, args.mood);
            return true;
        },
        async getUser(parent: any): Promise<UserDoc> {
            if (parent.uuid === undefined
                && parent.user === undefined
                && parent.mail === undefined
                && parent.token === undefined) {
                return UserModel.defaultUdoc;
            }
            if (parent.uuid !== undefined) {
                const ret = await UserModel.getByUUID(parent.uuid);
                ret.mail = '';
                return ret;
            }
            if (parent.user !== undefined) {
                const ret = await UserModel.getByUser(parent.user);
                ret.mail = '';
                return ret;
            }
            if (parent.mail !== undefined) {
                const ret = await UserModel.getByMail(parent.mail);
                ret.mail = '';
                return ret;
            }
            if (parent.token !== undefined) {
                const token: any = await TokenModel.get(parent.token, TokenType.SESSION);
                if (token === null) {
                    return UserModel.defaultUdoc;
                }
                const ret = await UserModel.getByUUID(token.data.uuid);
                return ret;
            }
            return UserModel.defaultUdoc;
        },
        async getSession(parent: any): Promise<SessionDoc[]> {
            if (parent.token === undefined) {
                throw new Error('invalid_parameters');
            }
            const ret: any = await SessionModel.getSessions(parent.token);
            return ret;
        },
        async logoutSession(parent: any, args: any): Promise<boolean> {
            if (parent.token === undefined || args.token === undefined) {
                throw new Error('invalid_parameters');
            }
            await SessionModel.deleteSession(parent.token, args.token);
            return true;
        },
        async resetPassQuery(_: any, args: any): Promise<boolean> {
            if (args.user === undefined || args.mail === undefined || args.language === undefined) {
                throw new Error('invalid_parameters');
            }
            await UserModel.resetPassQuery(args.user, args.mail, args.language);
            return true;
        },
        async resetPass(_: any, args: any): Promise<boolean> {
            if (args.token === undefined || args.pass === undefined) {
                throw new Error('invalid_parameters');
            }

            await UserModel.resetPass(args.token, args.pass);
            return true;
        },
    },
    twoFactorAuthResolvers: {
        async generate(parent: any) {
            if (parent.token === undefined) {
                throw new Error('invalid_parameters');
            }
            const token: any = await TokenModel.get(parent.token, TokenType.SESSION);
            if (token === null) {
                throw new Error('invalid_token');
            }
            return twoFactorAuth.generateSecret('nmTeam', token.data.user).uri;
        },
        async enable(parent: any, args: any): Promise<boolean> {
            if (parent.token === undefined || args.secret === undefined || args.code === undefined) {
                throw new Error('invalid_parameters');
            }
            const token: any = await TokenModel.get(parent.token, TokenType.SESSION);
            if (token === null) {
                throw new Error('invalid_token');
            }
            const user = await UserModel.getByUUID(token.data.uuid);
            if (user._tfa) {
                throw new Error('tfa_on');
            }
            if (twoFactorAuth.verifyToken(args.secret, args.code) !== 0) {
                throw new Error('tfa_invalid_code');
            }
            await UserModel.setByUUID(token.data.uuid, { _tfa: args.secret });
            return true;
        },
        async disable(parent: any, args: any): Promise<boolean> {
            if (parent.token === undefined) {
                throw new Error('invalid_parameters');
            }
            const token: any = await TokenModel.get(parent.token, TokenType.SESSION);
            if (token === null) {
                throw new Error('invalid_token');
            }
            const user = await UserModel.getByUUID(token.data.uuid);
            if (!user.tfa || user._tfa === undefined) {
                throw new Error('tfa_off');
            }
            if (twoFactorAuth.verifyToken(user._tfa, args.code) !== 0) {
                throw new Error('tfa_invalid_code');
            }
            await UserModel.setByUUID(token.data.uuid, { _tfa: undefined });
            return true;
        },
    },
    oauthResolvers: {
        async createClient(parent: any, args: any): Promise<boolean | { clientId?: string, clientSecret?: string }> {
            console.log(parent, args);
            if (args.name === undefined || args.redirectUri === undefined || args.description === undefined) {
                throw new Error('invalid_parameters');
            }
            if (!args.redirectUri.startsWith('https://') && !args.redirectUri.startsWith('http://')) {
                throw new Error('invalid_redirect_uri');
            }

            const client = await OAuth.createClient(args.name, args.description, [args.redirectUri], parent.user.uuid);
            return client;
        },
        async updateClient(_: any, args: any): Promise<boolean> {
            if (args.clientId === undefined
                || (args.redirectUri === undefined
                    && args.name === undefined
                    && args.icon === undefined
                    && args.description === undefined)) {
                throw new Error('invalid_parameters');
            }
            if (args.redirectUri !== undefined && !args.redirectUri.startsWith('https://') && !args.redirectUri.startsWith('http://')) {
                throw new Error('invalid_redirect_uri');
            }
            let { redirectUri } = args;
            if (redirectUri !== undefined) {
                redirectUri = [args.redirectUri];
            }
            const ret = await OAuth.updateClient(args.clientId, args.name, args.description, args.icon, redirectUri);
            return ret;
        },
        async getClient(_: any, args: any): Promise<any> {
            if (args.clientId === undefined && args.userId === undefined) {
                throw new Error('invalid_parameters');
            }
            if (args.clientId !== undefined) {
                const ret = await OAuth.getClient(args.clientId);
                return [ret];
            }
            if (args.userId !== undefined) {
                const ret = await OAuth.getClientByUser(args.userId);
                return ret;
            }
            return [];
        },
        async getClientList(): Promise<any> {
            const ret = await OAuth.getClientList();
            return ret;
        },
        async deleteClient(_: any, args: any): Promise<boolean> {
            if (args.clientId === undefined) {
                throw new Error('invalid_parameters');
            }
            const ret = await OAuth.deleteClient(args.clientId);
            return ret;
        },
    },
    sudoModeResolvers: {
        async enable(parent: any, args: any): Promise<boolean> {
            if (parent.token === undefined || (args.pass === undefined && args.code === undefined)) {
                throw new Error('invalid_parameters');
            }
            const sudo = new SudoModel(parent.token);
            await sudo.init();
            if (args.pass !== undefined) {
                if (await sudo.check('pass')) {
                    return true;
                }
                await sudo.enableByPass(args.pass);
            } else if (args.code !== undefined) {
                if (await sudo.check('2fa')) {
                    return true;
                }
                await sudo.enableBy2FA(args.code);
            }
            return true;
        },
        async info(parent: any): Promise<any> {
            if (parent.token === undefined) {
                throw new Error('invalid_parameters');
            }
            const sudo = new SudoModel(parent.token);
            await sudo.init();
            const pass = await sudo.check('pass');
            const code = await sudo.check('2fa');
            return {
                uuid: sudo.uuid,
                sudo: pass || code,
                pass,
                code,
            };
        },
    },
    adminResolvers: {
        async getUserList(parent: any): Promise<any> {
            if (parent.token === undefined) {
                throw new Error('invalid_parameters');
            }
            const ret = await Admin.getUserList();
            return ret;
        },
        async resetPass(parent: any, args: any): Promise<boolean> {
            if (parent.token === undefined || args.uuid === undefined || args.pass === undefined) {
                throw new Error('invalid_parameters');
            }
            const ret = await Admin.resetPass(args.uuid, args.pass);
            return ret;
        },
    },
};
export default resolvers;
