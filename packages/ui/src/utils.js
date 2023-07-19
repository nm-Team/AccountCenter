const gravatarAPI = 'https://gravatar.nmteam.xyz/avatar/';
const gravatarDefaultHash = '0c47eeb82f7124f9f1edf6cf98feded5';

function getAvatar(text, size = 100) {
    const type = text.split(':')[0];
    const attr = text.substring(text.indexOf(':') + 1);
    switch (type) {
        case 'mail':
            return `${gravatarAPI}${attr}?s=${size}&d=${encodeURI(gravatarAPI)}${gravatarDefaultHash}`;
        case 'qq':
            return `https://q1.qlogo.cn/g?b=qq&nk=${attr}&s=${size}`;
        case 'github':
            return `https://avatars.githubusercontent.com/${attr}?s=${size}`;
        case 'base':
            return `data:image/png;base64,${attr}`;
        default:
            return `${encodeURI(gravatarAPI)}${gravatarDefaultHash}?s=${size}`;
    }
}

export { getAvatar };
