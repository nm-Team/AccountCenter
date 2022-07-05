import { db } from './model/mongo';
import { bus } from './model/bus';

async function main() {
    await new Promise((resolve) => {
        bus.on('mongo/connected', () => {
            resolve(undefined);
        });
    });
    console.log(db);
}

main();