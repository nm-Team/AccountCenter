import { UserModel } from './model/user';

const resolvers = {
    Query: {
        User(): number {
            return 0;
        },
    },
    UserResolvers: {
        async register(_: any, args: any): Promise<string> {
            if (args.user === undefined || args.mail === undefined || args.pass === undefined) {
                throw new Error('Invalid parameters.');
            }
            const ret = await UserModel.register(args.user, args.pass, args.mail);
            return ret;
        },
        async active(_: any, args: any): Promise<boolean> {
            if (args.mailId === undefined || args.token === undefined) {
                throw new Error('Invalid parameters.');
            }
            await UserModel.active(args.mailId, args.token);
            return true;
        },
    },
};

export default resolvers;
