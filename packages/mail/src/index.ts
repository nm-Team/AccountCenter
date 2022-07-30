import { mail } from './config';
import bus from './model/bus';
import log from './model/logger';
import { Mailer } from './model/mailer';
import db from './model/mongo';
import { Render } from './model/render';

(async () => {
    log('SYS', 'Server preparing.');
    await new Promise((resolve) => {
        bus.on('mongo/connected', () => {
            resolve(undefined);
        });
    });
    bus.emit('app/prepared');
})();

let timer: any;

bus.on('app/prepared', async () => {
    log('SYS', 'Server starting.');

    const coll = db.collection('mail');
    const render = new Render();
    const mailer = new Mailer(
        mail.host,
        mail.port,
        mail.user,
        mail.pass,
    );
    timer = setInterval(async () => {
        try {
            const mailList = await coll.find().toArray();
            log('INFO', `Found ${mailList.length} mail(s).`);
            for (let i = 0; i < mailList.length; i += 1) {
                const mail_ = mailList[i];
                const {
                    to,
                    template,
                    language,
                    variables,
                } = mail_;
                // eslint-disable-next-line no-await-in-loop
                const [html, subject] = await render.render(template, language, variables);
                const option = mailer.createOption(
                    to,
                    subject,
                    html,
                );
                mailer.send(option).then(() => {
                    coll.deleteOne({ _id: mail_._id });
                    log('INFO', `Mail sent ${mail_._id}`);
                });
            }
        } catch (e) {
            log('ERROR', e);
        }
    }, 5000);

    bus.emit('app/started');
});

bus.on('app/started', async () => {
    log('SYS', 'Server started.');
});

process.on('exit', (code) => {
    clearInterval(timer);
    log('SYS', `Server exit with code ${code}`);
});

process.on('SIGINT', () => {
    clearInterval(timer);
    log('SYS', 'Server exit with SIGINT');
});
