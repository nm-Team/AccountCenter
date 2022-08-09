class Permission {
    public permBlack: string[];

    static permList = [
        'user.all',

        'user.doc.all',
        'user.doc.avatar',
        'user.doc.nick',
        'user.doc.mood',
        'user.doc.role',
        'user.doc.tfa',
        'user.doc.pass',
        'user.doc.mail',

        'user.login',

        'admin.all',
        'admin.user.doc.avatar',
        'admin.user.doc.nick',
        'admin.user.doc.mood',
        'admin.user.doc.role',
        'admin.user.doc.tfa',
        'admin.user.doc.pass',
        'admin.user.doc.mail',

        'admin.user.ban',
        'admin.user.unban',
        'admin.user.delete',
    ];

    constructor(
        permBlack: string[],
    ) {
        this.permBlack = permBlack;
    }

    static checkIn(perm: string, list: string[]) {
        const stack: string[] = perm.split('.');
        let now: string = '';
        for (let i = 0; i < stack.length; i++) {
            if (i) {
                now += '.';
            }
            now += stack[i];
            if (list.includes(`${now}.all`)) {
                return true;
            }
        }
        return list.includes(now);
    }

    check(perm: string) {
        if (!Permission.permList.includes(perm)) {
            return false;
        }
        return !Permission.checkIn(perm, this.permBlack);
    }
}
export { Permission };
