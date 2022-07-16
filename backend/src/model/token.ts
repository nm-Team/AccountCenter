import { Collection, Filter, ObjectId } from 'mongodb';

import bus from './bus';
import db from './mongo';

enum TokenType {
    SESSION,
    REGISTER,
    CHANGEMAIL,
}

class TokenModel {
    static coll: Collection;

    static add(tokenType: TokenType, expire: number, data: Object): string {
        const time = new Date();
        const _id = new ObjectId();
        const id = _id.toString();
        TokenModel.coll.insertOne({
            _id,
            tokenType,
            createAt: time,
            updateAt: time,
            expireAt: new Date(time.getTime() + expire * 1000),
            ...data,
        });
        bus.emit('token/add', id, tokenType);
        return id;
    }

    static get(tokenId: string, tokenType: TokenType): Promise<Object | null> {
        bus.emit('token/get', tokenId, tokenType);
        return TokenModel.coll.findOne({
            _id: new ObjectId(tokenId),
            tokenType,
        });
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
            { _id: new ObjectId(tokenId), tokenType },
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
            _id: new ObjectId(tokenId),
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
