import { Token } from 'graphql';
import { randomStr } from '../utils';
import bus from './bus';
import db from './mongo';

enum TokenType {
    SESSION,
    REGISTER,
    CHANGEMAIL,
}

class TokenModel {
    static coll = db.collection('token');

    async add(tokenType: TokenType, expire: number, data: any): Promise<string> {
        console.log(db);
        const time = new Date();
        const id = randomStr();
        await TokenModel.coll.insertOne({
            ...data,
            _id: id,
            tokenType,
            createAt: time,
            updateAt: time,
            expireAt: new Date(time.getTime() + expire * 1000),
        });
        bus.emit('token/add', tokenType, id);
        return id;
    }
}

bus.once('app/start', () => {
    TokenModel.coll.createIndex({ "expireAt": 1 }, { expireAfterSeconds: 0 });
});

export { TokenType, TokenModel };
