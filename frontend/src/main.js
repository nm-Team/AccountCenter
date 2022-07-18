import '../css/common.css';
import '../css/log.css';

import { DefaultApolloClient } from '@vue/apollo-composable';
import ApolloClient from 'apollo-boost';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import LabelInput from './components/LabelInput.vue';
import { i18n, languages } from './i18n';
import Main from './Main.vue';
import Active from './views/log/Active.vue';
import ForgetPassword from './views/log/ForgetPassword.vue';
import LogIn from './views/log/LogIn.vue';
import NotFound from './views/log/NotFound.vue';
import Register from './views/log/Register.vue';

// import routes
const routes = [
    { path: '/', name: 'login', component: LogIn },
    { path: '/register', name: 'register', component: Register },
    { path: '/forget-password', name: 'forget_password', component: ForgetPassword },
    { path: '/active', name: 'active', component: Active },
    { path: '/:pathMatch(.*)*', name: 'not_found', component: NotFound },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

const apolloClient = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
});

createApp(Main).use(i18n).use(router)
    .provide(DefaultApolloClient.DefaultApolloClient, apolloClient)
    .component('LabelInput', LabelInput)
    .mount('#app');

// eslint-disable-next-line import/prefer-default-export
export { apolloClient, languages, i18n };
