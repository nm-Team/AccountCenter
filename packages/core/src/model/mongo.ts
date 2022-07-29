import { Db, MongoClient } from 'mongodb';

import { mongo } from '../config';
import bus from './bus';

class MongoModel {
    public client!: MongoClient;

    public db!: Db;

    private mongourl: string;

    private mongodb: string;

    constructor(mongourl: string, mongodb: string) {
        this.mongourl = mongourl;
        this.mongodb = mongodb;
    }

    public async init() {
        this.client = await MongoClient.connect(this.mongourl);
        this.db = this.client.db(this.mongodb);
        bus.emit('mongo/connected');
    }

    public collection(name: string) {
        return this.db.collection(name);
    }
}

const db = new MongoModel(mongo.url, mongo.db);
db.init();
export default db;
