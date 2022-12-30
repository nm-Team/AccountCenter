import db from '../model/mongo';

const userSchema = db.schema({
    uuid: String,
    pass: String,

    user: String,
    mail: String,
    nick: String,
    avatar: String,
    mood: String,
    role: String,
    permBlack: Array<String>,

    regat: Date,
    loginat: Date,
    loginip: String,

    tfa: Boolean,
    _tfa: String,
});

const userModel = db.model('user', userSchema);

export default userModel;
