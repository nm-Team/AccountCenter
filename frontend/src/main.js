import '../css/common.scss';
import '../css/log.scss';
import '../css/manage.scss';

import { DefaultApolloClient } from '@vue/apollo-composable';
import ApolloClient from 'apollo-boost';
import { createApp } from 'vue';
import MenuIcon from 'vue-material-design-icons/Menu.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import LabelInput from './components/LabelInput.vue';
import UserButton from './components/UserButton.vue';
import { i18n, languages } from './i18n';
import Main from './Main.vue';
import Active from './views/log/Active.vue';
import ForgetPassword from './views/log/ForgetPassword.vue';
import LogIn from './views/log/LogIn.vue';
import NotFound from './views/log/NotFound.vue';
import Register from './views/log/Register.vue';
import Manage from './views/manage/Manage.vue';
import ManageIndex from './views/manage/ManageIndex.vue';
import ManageInfos from './views/manage/ManageInfos.vue';
import ManageNotFound from './views/manage/ManageNotFound.vue';
import ManageSafety from './views/manage/ManageSafety.vue';

// import routes
const routes = [
    { path: '/', name: 'login', component: LogIn },
    { path: '/register', name: 'register', component: Register },
    { path: '/forget-password', name: 'forget_password', component: ForgetPassword },
    { path: '/active', name: 'active', component: Active },
    {
        path: '/manage',
        name: 'manage',
        component: Manage,
        children: [
            { path: '', name: 'manage_index', component: ManageIndex },
            { path: 'safety', name: 'manage_safety', component: ManageSafety },
            { path: 'infos', name: 'manage_infos', component: ManageInfos },
            { path: ':pathMatch(.*)*', name: 'manage_notfound', component: ManageNotFound },
        ],
    },
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
    .component('menu-icon', MenuIcon)
    .component('UserButton', UserButton)
    .mount('#app');

// eslint-disable-next-line import/prefer-default-export
export {
    apolloClient, languages, i18n, router,
};
