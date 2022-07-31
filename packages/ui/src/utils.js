function getAvatar(text, size = 100) {
    const type = text.split(':')[0];
    const attr = text.substring(text.indexOf(':') + 1);
    switch (type) {
        case 'mail':
            return `https://gravatar.nmteam.xyz/avatar/${attr}?s=${size}`;
        case 'qq':
            return `https://q1.qlogo.cn/g?b=qq&nk=${attr}&s=${size}`;
        case 'github':
            return `https://avatars.githubusercontent.com/${attr}?s=${size}`;
        default:
            return `https://gravatar.nmteam.xyz/avatar/0c47eeb82f7124f9f1edf6cf98feded5?s=${size}`;
    }
}

export { getAvatar };
