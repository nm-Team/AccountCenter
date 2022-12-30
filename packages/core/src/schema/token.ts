import db from '../model/mongo';

const tokenSchema = db.schema({
    uuid: String,
    tokenType: Number,
    createAt: Date,
    updateAt: Date,
    expireAt: {
        type: Date,
        expires: 0,
        // expire index
    },
    data: Object,
});

const tokenModel = db.model('token', tokenSchema);

export default tokenModel;
