import bus from './bus';
import db from './mongo';
import { Collection, ObjectId, Filter } from 'mongodb';

enum TokenType {
    SESSION,
    REGISTER,
    CHANGEMAIL,
}

class TokenModel {
    static coll: Collection;

    add(tokenType: TokenType, expire: number, data: Object): string {
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

    get(tokenId: string, tokenType: TokenType): Promise<Object | null> {
        bus.emit('token/get', tokenId, tokenType);
        return TokenModel.coll.findOne({
            id: new ObjectId(tokenId),
            tokenType,
        });
    }

    query(tokenType: TokenType, query: Filter<Object>) {
        bus.emit('token/query', tokenType, query);
        return TokenModel.coll.find({
            tokenType,
            ...query,
        }).toArray();
    }

    async update(tokenId: string, tokenType: TokenType, expire: number, data: Object) {
        bus.emit('token/update', tokenId, tokenType);
        const time = new Date();
        const res = await TokenModel.coll.findOneAndUpdate(
            { id: new ObjectId(tokenId), tokenType },
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
}
bus.once('mongo/connected', () => {
    TokenModel.coll = db.collection('token');
    TokenModel.coll.createIndex({ "expireAt": 1 }, { expireAfterSeconds: 0 });
    bus.emit('token/inited');
});

export { TokenType, TokenModel };
