/* eslint-disable prefer-const */
/* eslint-disable no-undef */
function getAvatar(text) {
    let avatarUrl = '';
    let type = text.split(':')[0];
    let attr = text.substring(text.indexOf(':') + 1);
    switch (type) {
    case 'gravatar':
        avatarUrl = `https://gravatar.junbo.wang/avatar/${attr}?s=100`;
        break;
    default:
        avatarUrl = 'https://gravatar.junbo.wang/avatar/guest@nmnm.fun?s=100';
    }
    return avatarUrl;
}

export { getAvatar };
