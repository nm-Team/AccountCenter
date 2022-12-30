import { v4 as uuidv4 } from 'uuid';

import tokenModel from '../schema/token';
import bus from './bus';

enum TokenType {
    SESSION,
    REGISTER,
    RESET_PASSWORD,
    SUDOMODE,
}

class TokenModel {
    static async add(tokenType: TokenType, expire: number, data: Object): Promise<string> {
        const time = new Date();
        const uuid_ = uuidv4();
        const doc = await tokenModel.create({
            uuid: uuid_,
            tokenType,
            createAt: time,
            updateAt: time,
            expireAt: new Date(time.getTime() + expire * 1000),
            data,
        });
        await doc.save();
        bus.emit('token/add', uuid_, tokenType);
        return uuid_;
    }

    static get(tokenId: string, tokenType: TokenType): Promise<any> {
        bus.emit('token/get', tokenId, tokenType);
        return TokenModel.update(tokenId, tokenType, 24 * 60 * 60, undefined);
    }

    static query(tokenType: TokenType, query: Object) {
        bus.emit('token/query', tokenType, query);
        return tokenModel.find({
            tokenType,
            query,
        });
    }

    static async update(tokenId: string, tokenType: TokenType, expire: number, data: Object | undefined) {
        bus.emit('token/update', tokenId, tokenType);
        const time = new Date();
        let set;
        if (data) {
            set = {
                data,
                updateAt: time,
                expireAt: new Date(time.getTime() + expire * 1000),
            };
        } else {
            set = {
                updateAt: time,
                expireAt: new Date(time.getTime() + expire * 1000),
            };
        }
        const res = await tokenModel.findOneAndUpdate(
            { uuid: tokenId, tokenType },
            set,
            { new: true },
        );
        return res;
    }

    static delete(tokenId: string, tokenType: TokenType) {
        bus.emit('token/delete', tokenId, tokenType);
        return tokenModel.deleteOne({ uuid: tokenId, tokenType });
    }
}
bus.once('mongo/connected', () => {
    bus.emit('token/inited');
});

export { TokenType, TokenModel };
