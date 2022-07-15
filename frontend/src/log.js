import '../public/css/common.css';
import '../public/css/log.css';

import { createApp } from 'vue';

import Log from './Log.vue';
import i18n from './i18n';
import { createRouter, createWebHashHistory } from 'vue-router';

import LabelInput from './components/LabelInput.vue';

import LogIn from './views/log/LogIn.vue';
import Register from './views/log/Register.vue';
import ForgetPassword from './views/log/ForgetPassword.vue';

// import routes
const routes = [
    { path: '/', component: LogIn },
    { path: '/register', component: Register },
    { path: '/forget-password', component: ForgetPassword },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

createApp(Log).use(i18n).use(router).component("LabelInput", LabelInput).mount('#app');
