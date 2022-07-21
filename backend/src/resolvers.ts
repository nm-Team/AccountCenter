import { SessionDoc, SessionModel } from './model/session';
import { TokenModel, TokenType } from './model/token';
import { UserDoc, UserModel } from './model/user';

const resolvers = {
    Query: {
        User(_: any, args: any): any {
            return args;
        },
    },
    UserResolvers: {
        async register(_: any, args: any): Promise<boolean> {
            if (args.user === undefined || args.mail === undefined || args.pass === undefined) {
                throw new Error('Invalid parameters');
            }
            const ret = await UserModel.register(args.user, args.pass, args.mail);
            return ret;
        },
        async active(_: any, args: any): Promise<boolean> {
            if (args.token === undefined) {
                throw new Error('Invalid parameters');
            }
            await UserModel.active(args.token);
            return true;
        },
        async logout(parent: any): Promise<boolean> {
            if (parent.token === undefined) {
                throw new Error('Invalid parameters');
            }
            await TokenModel.delete(parent.token, TokenType.SESSION);
            return true;
        },
        async logoutAll(parent: any): Promise<boolean> {
            if (parent.token === undefined) {
                throw new Error('Invalid parameters');
            }
            await SessionModel.deleteAll(parent.token);
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
                return ret;
            }
            if (parent.user !== undefined) {
                const ret = await UserModel.getByUser(parent.user);
                return ret;
            }
            if (parent.mail !== undefined) {
                const ret = await UserModel.getByMail(parent.mail);
                return ret;
            }
            if (parent.token !== undefined) {
                const token: any = await TokenModel.get(parent.token, TokenType.SESSION);
                if (token === null) {
                    return UserModel.defaultUdoc;
                }
                console.log(token);
                const ret = await UserModel.getByUUID(token.uuid);
                return ret;
            }
            return UserModel.defaultUdoc;
        },
        async getSession(parent: any): Promise<SessionDoc[]> {
            if (parent.token === undefined) {
                throw new Error('Invalid parameters');
            }
            // const token: any = TokenModel.get(parent.token, TokenType.SESSION);
            // if (token === null) {
            //     throw new Error('Token is expired');
            // }
            const ret: any = await SessionModel.getSesions(parent.token);
            return ret;
        },
    },
};
export default resolvers;
