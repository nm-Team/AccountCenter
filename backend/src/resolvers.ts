import { UserModel } from "./model/user";

const resolvers = {
    Query: {
        User(): number {
            return 0;
        }
    },
    UserResolvers: {
        async register(_: any, args: any): Promise<string> {
            if (args.user === undefined || args.mail === undefined || args.pass === undefined) {
                throw new Error("Invalid parameters.");
            }
            try {
                return await UserModel.register(args.user, args.pass, args.mail);
            } catch (e) {
                throw e;
            }
        },
        async active(_: any, args: any): Promise<boolean> {
            if (args.mailId === undefined || args.token === undefined) {
                throw new Error("Invalid parameters.");
            }
            try {
                await UserModel.active(args.mailId, args.token);
                return true;
            } catch (e) {
                throw e;
                return false;
            }
        }
    }
};

export default resolvers;
