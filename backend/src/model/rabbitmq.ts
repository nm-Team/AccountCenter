import { rabbitmq } from '../config';
import bus from './bus';

const amqp = require('amqplib');

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

    public createChannel() {
        return this.connection.createChannel();
    }
}

const queue = new RabbitMQModel(rabbitmq.url);
queue.init();
export default { queue };
