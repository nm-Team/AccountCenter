module.exports = {
    apps: [
        {
            name: 'account-core',
            script: 'yarn core:dev',
            watch: true,
        },
        {
            name: 'account-mail',
            script: 'yarn mail:dev',
            watch: true,
        },
    ],
};
