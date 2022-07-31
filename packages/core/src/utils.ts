const isMail = (mail: string) => {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return reg.test(mail);
};

const checkUser = (user: string) => {
    if (user.length < 4 || user.length > 16) {
        return false;
    }
    const reg = /^\w+$/;
    return reg.test(user);
};

const checkPass = (pass: string) => {
    if (pass.length < 8 || pass.length > 22) {
        return false;
    }
    const cnt = Number(/[a-z]/.test(pass))
        + Number(/[A-Z]/.test(pass))
        + Number(/[0-9]/.test(pass))
        + Number(/[^0-9A-Za-z]/.test(pass));
    return cnt >= 2;
};

export { isMail, checkUser, checkPass };
