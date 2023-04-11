import tokenModel from '../schema/token';
import userModel from '../schema/user';
import { sha1 } from './crypto';

class Admin {
    static async getUserList() {
        const list = await userModel.find();
        return list.map((doc) => ({
            uuid: doc.uuid,
            user: doc.user,
            nick: doc.nick,
            avatar: doc.avatar,
            mail: doc.mail,
            role: doc.role,
            permBlack: [], // unfinished
            regat: doc.regat,
            loginat: doc.loginat,
            tfa: doc.tfa,
        }));
    }

    static async resetPass(uuid: string, pass: string) {
        const user = await userModel.findOne({
            uuid,
        });

        if (user === null) {
            return false;
        }

        await userModel.updateOne(
            { uuid },
            {
                pass: sha1(user.uuid + pass),
            },
        );

        await tokenModel.deleteMany({ 'data.uuid': uuid });

        return true;
    }
}

export default Admin;
