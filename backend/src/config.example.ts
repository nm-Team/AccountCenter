const mongo = {
    url: 'mongodb://localhost:27017/',
    db: 'accountcenter',
};
const rabbitmq = {
    url: 'amqp://localhost',
};
const port = 4000;
export { mongo, rabbitmq, port };
