import { createTransport, Transporter } from 'nodemailer';

class Mailer {
    public host: string;

    public port: number;

    public user: string;

    private pass: string;

    private transporter: Transporter;

    constructor(host: string, port: number, user: string, pass: string) {
        this.host = host;
        this.port = port;
        this.user = user;
        this.pass = pass;

        this.transporter = createTransport({
            host,
            port,
            auth: {
                user,
                pass,
            },
        });
    }

    public createOption(to: string, subject: string, html: string) {
        return {
            from: `nmTeam AccountCenter<${this.user}>`,
            to,
            subject,
            text: '',
            html,
        };
    }

    public send(option: any) {
        return this.transporter.sendMail(option);
    }
}

export { Mailer };
