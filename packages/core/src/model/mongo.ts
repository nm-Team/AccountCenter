import mongoose from 'mongoose';

import { mongo } from '../config';
import bus from './bus';

class MongoModel {
    public mongoose!: mongoose.Mongoose;

    private mongourl: string;

    private mongodb: string;

    constructor(mongourl: string, mongodb: string) {
        this.mongourl = mongourl;
        this.mongodb = mongodb;
    }

    public async init() {
        mongoose.connect(this.mongourl + this.mongodb);

        // auto reconnect
        mongoose.connection.on('disconnected', () => {
            mongoose.connect(this.mongourl + this.mongodb);
        });

        this.mongoose = mongoose;

        return new Promise((resolve, reject) => {
            this.mongoose.connection.on('error', (err) => {
                console.log('mongo connect error', err);
                reject(err);
            });
            this.mongoose.connection.once('open', () => {
                bus.emit('mongo/connected');
                resolve(true);
            });
        });
    }

    public schema(schema: mongoose.SchemaDefinition) {
        return new this.mongoose.Schema(schema, { versionKey: false });
        // remove __v field
    }

    public model(name: string, schema: mongoose.Schema) {
        return this.mongoose.model(name, schema);
    }
}

const db = new MongoModel(mongo.url, mongo.db);
db.init();
export default db;
