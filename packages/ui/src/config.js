export default {
    backEnd: import.meta.env.VITE_BACKEND ?? 'http://localhost:4000/graphql',
    oauthBackEnd: import.meta.env.VITE_OAUTH_BACKEND ?? 'http://localhost:4000/oauth',
};
