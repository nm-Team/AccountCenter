const isMail = (mail: string) => {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return reg.test(mail);
};

const isMD5 = (text: string) => /^[0-9a-f]{32}$/.test(text);

// eslint-disable-next-line no-control-regex
const seeable = (text: string) => /^[^\x00-\x1f\x7f]+$/.test(text);

const checkAvatar = (avatar: string) => {
    const type = avatar.split(':')[0];
    const attr = avatar.substring(avatar.indexOf(':') + 1);
    switch (type) {
        case 'mail':
            return isMD5(attr);
        case 'qq':
            return /^[1-9]\d{4,}$/.test(attr);
        case 'github':
            return /^[a-zA-Z0-9-_]+$/.test(attr);
        default:
            return false;
    }
};

const checkNick = (user: string) => {
    if (user.length < 4 || user.length > 24) {
        return false;
    }
    return seeable(user);
};

const checkUser = (user: string) => {
    if (user.length < 4 || user.length > 12) {
        return false;
    }
    const reg = /^[a-zA-Z0-9-_]+$/;
    return reg.test(user);
};

const checkPass = (pass: string) => {
    if (pass.length < 8 || pass.length > 24) {
        return false;
    }
    const cnt = Number(/[a-z]/.test(pass))
        + Number(/[A-Z]/.test(pass))
        + Number(/[0-9]/.test(pass))
        + Number(/[^0-9A-Za-z]/.test(pass));
    return cnt >= 2;
};

export {
    isMail, isMD5, checkAvatar, checkNick, checkUser, checkPass,
    seeable,
};
