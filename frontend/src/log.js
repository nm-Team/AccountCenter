import '../public/css/common.css';
import '../public/css/log.css';

import { ApolloComposable } from '@vue/apollo-composable';
import ApolloClient from 'apollo-boost';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import LabelInput from './components/LabelInput.vue';
import i18n from './i18n';
import Log from './Log.vue';
import ForgetPassword from './views/log/ForgetPassword.vue';
import LogIn from './views/log/LogIn.vue';
import NotFound from './views/log/NotFound.vue';
import Register from './views/log/Register.vue';

// import routes
const routes = [
    { path: '/', component: LogIn },
    { path: '/register', component: Register },
    { path: '/forget-password', component: ForgetPassword },
    { path: '/:pathMatch(.*)*', component: NotFound },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
const apolloClient = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
});

createApp(Log).use(i18n).use(router)
    .provide(ApolloComposable.DefaultApolloClient, apolloClient)
    .component('LabelInput', LabelInput)
    .mount('#app');
