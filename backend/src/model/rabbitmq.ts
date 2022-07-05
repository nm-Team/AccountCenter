const amqp = require('amqplib');
import { bus } from './bus';
import { rabbitmq } from '../config';

class RabbitMQModel {
    public connection: any;
    private rabbiturl: string;

    constructor(rabbiturl: string) {
        this.rabbiturl = rabbiturl;
    }

    public async init() {
        this.connection = await amqp.connect(this.rabbiturl);
        bus.emit('mongo/connected');
    }

    public async createChannel() {
        return await this.connection.createChannel();
    }
}

const queue = new RabbitMQModel(rabbitmq.url);
queue.init();
export { queue };
