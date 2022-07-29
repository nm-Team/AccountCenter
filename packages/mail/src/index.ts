import bus from './model/bus';
import log from './model/logger';
import db from './model/mongo';

(async () => {
    log('SYS', 'Server preparing.');
    await new Promise((resolve) => {
        bus.on('mongo/connected', () => {
            resolve(undefined);
        });
    });
    bus.emit('app/prepared');
})();

bus.on('app/prepared', async () => {
    log('SYS', 'Server starting.');
    bus.emit('app/started');
});

bus.on('app/started', () => {
    log('SYS', 'Server started.');
    console.log(db);
});

process.on('exit', (code) => {
    log('SYS', `Server exit with code ${code}`);
});

process.on('SIGINT', () => {
    log('SYS', 'Server exit with SIGINT');
});
