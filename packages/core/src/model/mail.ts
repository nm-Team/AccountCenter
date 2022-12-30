import mailModel from '../schema/mail';
import bus from './bus';

class Mail {
    static async send(to: string, template: string, language: string, variables: any = {}) {
        const mail = {
            to,
            template,
            language,
            variables,
        };
        const doc = await mailModel.create(mail);
        await doc.save();
        bus.emit('mail/sent', mail);
    }
}

export default Mail;
