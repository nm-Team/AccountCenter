import { generateSecret, generateToken, verifyToken } from 'node-2fa';

class twoFactorAuth {
    static generateSecret(name: string, account: string) {
        return generateSecret({ name, account });
    }

    static generateToken(secret: string) {
        return generateToken(secret);
    }

    static verifyToken(secret: string, token: string) {
        const ret = verifyToken(secret, token);
        if (ret === null) {
            return -2;
        }
        const { delta } = ret;
        return delta;
    }
}

export default twoFactorAuth;
