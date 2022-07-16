const isMail = (mail: string) => {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return reg.test(mail);
}

const checkUser = (user: string) => {
    if (user.length < 4 || user.length > 16) {
        return false;
    }
    const reg = /^\w+$/;
    return reg.test(user);
}

export { isMail, checkUser };
