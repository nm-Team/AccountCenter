import { createHash } from 'crypto';

const encrypt = (algo: string, text: string) => {
    const hash = createHash(algo);
    hash.update(text);
    return hash.digest('hex');
}

const sha1 = (text: string) => {
    return encrypt('sha1', text);
}

export { encrypt, sha1 };
