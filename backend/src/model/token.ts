import { Collection, Filter } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

import bus from './bus';
import db from './mongo';

enum TokenType {
    SESSION,
    REGISTER,
    SUDOMODE,
}

class TokenModel {
    static coll: Collection;

    static async add(tokenType: TokenType, expire: number, data: Object): Promise<string> {
        const time = new Date();
        const uuid_ = uuidv4();
        await TokenModel.coll.insertOne({
            _uuid: uuid_,
            tokenType,
            createAt: time,
            updateAt: time,
            expireAt: new Date(time.getTime() + expire * 1000),
            ...data,
        });
        bus.emit('token/add', uuid_, tokenType);
        return uuid_;
    }

    static get(tokenId: string, tokenType: TokenType): Promise<Object | null> {
        bus.emit('token/get', tokenId, tokenType);
        return TokenModel.update(tokenId, tokenType, 24 * 60 * 60, {});
    }

    static query(tokenType: TokenType, query: Filter<Object>) {
        bus.emit('token/query', tokenType, query);
        return TokenModel.coll.find({
            tokenType,
            ...query,
        }).toArray();
    }

    static async update(tokenId: string, tokenType: TokenType, expire: number, data: Object) {
        bus.emit('token/update', tokenId, tokenType);
        const time = new Date();
        const res = await TokenModel.coll.findOneAndUpdate(
            { _uuid: tokenId, tokenType },
            {
                $set: {
                    ...data,
                    updateAt: time,
                    expireAt: new Date(time.getTime() + expire * 1000),
                },
            },
        );
        return res.value;
    }

    static delete(tokenId: string, tokenType: TokenType) {
        bus.emit('token/delete', tokenId, tokenType);
        return TokenModel.coll.deleteOne({
            _uuid: tokenId,
            tokenType,
        });
    }
}
bus.once('mongo/connected', () => {
    TokenModel.coll = db.collection('token');
    TokenModel.coll.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
    bus.emit('token/inited');
});

export { TokenType, TokenModel };
