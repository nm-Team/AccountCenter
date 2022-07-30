import { Collection } from 'mongodb';

import bus from './bus';
import db from './mongo';

class Mail {
    static coll: Collection;

    static async send(to: string, template: string, language: string, variables: any = {}) {
        const mail = {
            to,
            template,
            language,
            variables,
        };
        await Mail.coll.insertOne(mail);
        bus.emit('mail/sent', mail);
    }
}

bus.once('mongo/connected', () => {
    Mail.coll = db.collection('mail');
    bus.emit('mail/inited');
});

export default Mail;
