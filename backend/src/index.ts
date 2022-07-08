import bus from './model/bus';
import db from './model/mongo';
import { UserDoc, UserModel } from './model/user';
import { TokenModel, TokenType } from './model/token';

async function main() {
    await new Promise((resolve) => {
        bus.on('mongo/connected', () => {
            resolve(undefined);
        });
    });
    const tok = new TokenModel();
    console.log(await tok.add(TokenType.REGISTER, 3600, { 'nm': 'sl' }));
    // console.log(db);

}
bus.on('mongo/connected', () => {
    console.log('mongo/connect');
});
bus.on('token/add', (...data) => {
    console.log(...data);
});
main();
