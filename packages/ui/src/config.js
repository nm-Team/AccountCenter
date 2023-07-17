export default {
    backEnd: import.meta.env.BACKEND ?? 'http://localhost:4000/graphql',
    oauthBackEnd: import.meta.env.OAUTH_BACKEND ?? 'http://localhost:4000/oauth',
};
