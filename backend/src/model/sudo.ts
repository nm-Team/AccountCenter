import twoFactorAuth from './2fa';
import { sha1 } from './crypto';
import { TokenModel, TokenType } from './token';
import { UserModel } from './user';

/* eslint-disable lines-between-class-members */

class SudoModel {
    public inited: boolean = false;
    public uuid: string = '';

    private token: string;
    private user: any;

    constructor(token: string) {
        this.token = token;
    }

    public async init() {
        const tokenDoc: any = await TokenModel.get(this.token, TokenType.SESSION);
        if (tokenDoc === null) {
            throw new Error('invalid_token');
        }
        this.uuid = tokenDoc.uuid;
        this.user = await UserModel.getByUUID(this.uuid);
        this.inited = true;
    }

    public async check(method?: string) {
        if (!this.inited) {
            await this.init();
        }
        let ret;
        if (method === undefined) {
            ret = await TokenModel.query(TokenType.SUDOMODE, {
                uuid: this.uuid,
                _uuid: this.token,
            });
        } else {
            ret = await TokenModel.query(TokenType.SUDOMODE, {
                uuid: this.uuid,
                _uuid: this.token,
                method,
            });
        }
        return ret.length !== 0;
    }

    public async enableByPass(pass: string) {
        if (!this.inited) {
            await this.init();
        }
        if (sha1(this.user.uuid + pass) !== this.user._pass) {
            throw new Error('wrong_pass');
        }
        const ret = await TokenModel.add(TokenType.SUDOMODE, 30 * 60, {
            uuid: this.uuid,
            _uuid: this.token,
            method: 'pass',
        });
        return ret;
    }

    public async enableBy2FA(code: string) {
        if (!this.inited) {
            await this.init();
        }
        if (!this.user.tfa) {
            throw new Error('tfa_off');
        }
        if (twoFactorAuth.verifyToken(this.user._tfa, code) !== 0) {
            throw new Error('tfa_invalid_code');
        }
        const ret = await TokenModel.add(TokenType.SUDOMODE, 30 * 60, {
            uuid: this.uuid,
            token: this.token,
            method: '2fa',
        });
        return ret;
    }
}

export default SudoModel;
