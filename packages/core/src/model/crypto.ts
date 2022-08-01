import { createHash } from 'crypto';

const encrypt = (algo: string, text: string) => {
    const hash = createHash(algo);
    hash.update(text);
    return hash.digest('hex');
};

const sha1 = (text: string) => encrypt('sha1', text);
const md5 = (text: string) => encrypt('md5', text);

export { encrypt, sha1, md5 };
