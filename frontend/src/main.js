import '../css/common.scss';
import '../css/log.scss';
import '../css/manage.scss';

// import 'vue-cropper/dist/index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { DefaultApolloClient } from '@vue/apollo-composable';
import ApolloClient from 'apollo-boost';
import axios from 'axios';
import * as Vue from 'vue';
import VueAxios from 'vue-axios';
import VueCropper from 'vue-cropper';
import vueQr from 'vue-qr/src/packages/vue-qr.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import FooterItems from './components/FooterItems.vue';
import LabelInput from './components/LabelInput.vue';
import LinkA from './components/LinkA.vue';
import SafetyChecker from './components/SafetyChecker.vue';
import UserButton from './components/UserButton.vue';
import config from './config';
import { i18n, languages } from './i18n';
import Main from './Main.vue';
import Active from './views/log/Active.vue';
import ChooseAccount from './views/log/ChooseAccount.vue';
import ForgetPassword from './views/log/ForgetPassword.vue';
import LogIn from './views/log/LogIn.vue';
import NotFound from './views/log/NotFound.vue';
import Register from './views/log/Register.vue';
import Manage from './views/manage/Manage.vue';
import Manage2FA from './views/manage/Manage2FA.vue';
import ManageChangeAvatar from './views/manage/ManageChangeAvatar.vue';
import ManageChangePassword from './views/manage/ManageChangePassword.vue';
import ManageIndex from './views/manage/ManageIndex.vue';
import ManageInfos from './views/manage/ManageInfos.vue';
import ManageNotFound from './views/manage/ManageNotFound.vue';
import ManageSafety from './views/manage/ManageSafety.vue';
import ManageSudoMode from './views/manage/ManageSudoMode.vue';

library.add(fas);

// import routes
const routes = [
    { path: '/', name: 'login', component: LogIn },
    { path: '/choose-account', name: 'choose-account', component: ChooseAccount },
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
            { path: 'two-factor-authentication-setup', name: 'setup_2fa', component: Manage2FA },
            { path: 'change-password', name: 'change_password', component: ManageChangePassword },
            { path: 'change-avatar', name: 'change_avatar', component: ManageChangeAvatar },
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
    uri: config.backEnd,
});

const app = Vue.createApp(Main);
app.use(i18n).use(router)
    .use(VueAxios, axios)
    .use(vueQr)
    .use(VueCropper)
    .provide(DefaultApolloClient.DefaultApolloClient, apolloClient)
    .component('font-awesome-icon', FontAwesomeIcon)
    .component('vue-qr', vueQr)
    .component('i18n', i18n)
    .component('Footer', FooterItems)
    .component('LinkA', LinkA)
    .component('LabelInput', LabelInput)
    .component('Footer', FooterItems)
    .component('UserButton', UserButton)
    .component('SafetyChecker', SafetyChecker)
    .component('sudo-mode', ManageSudoMode);
app.mount('#app');

// eslint-disable-next-line import/prefer-default-export
export {
    apolloClient, languages, i18n, router,
};
