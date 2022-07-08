import { UUID } from 'bson';
import bus from './bus';
import db from './mongo';
import queue from './rabbitmq';

const coll_ = db.collection('user');

/* eslint-disable lines-between-class-members */

export interface UserDoc extends Object {
    _id: number;
    _salt: string;
    _pass: string;

    user: string;
    mail: string;
    nick: string;
    avatar: string;
    mood: string;
    role: string;

    regat: Date;
    loginat: Date;
    loginip: string;
}

export class UserModel {
    public user: UserDoc;

    private defaultUdoc: UserDoc = {
        _id: 0,
        _salt: '',
        _pass: '',

        user: 'guest',
        mail: 'guest@nmnm.fun',
        nick: 'Guest',
        avatar: 'gravatar:guest@nmnm.fun',
        mood: 'Welcome to nmTeam',
        role: 'guest',

        regat: new Date('2021-06-14'),
        loginat: new Date('2021-06-14'),
        loginip: '127.0.0.1',
    };

    constructor(udoc?: UserDoc) {
        this.user = udoc === undefined ? this.defaultUdoc : udoc;
    }

    async register(
        name: string,
        pass: string,
        mail: string
    ) {
        const uid: number = 0;
        return uid;
    }
}
