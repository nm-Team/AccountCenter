import '../css/common.scss';
import '../css/log.scss';
import '../css/manage.scss';
import 'sweetalert2/dist/sweetalert2.min.css';
import '../css/sweetalert2.scss';
import 'vue-cropper/dist/index.css';

// import '@sweetalert2/themes/dark/dark.css';
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
import VueSweetalert2 from 'vue-sweetalert2';

import FooterItems from './components/FooterItems.vue';
import LabelInput from './components/LabelInput.vue';
import LinkA from './components/LinkA.vue';
import RoundedUser from './components/RoundedUser.vue';
import SafetyChecker from './components/SafetyChecker.vue';
import UserButton from './components/UserButton.vue';
import config from './config';
import { i18n, languages } from './i18n';
import Main from './Main.vue';
import Active from './views/log/Active.vue';
import AuthorizePage from './views/log/AuthorizePage.vue';
import ChooseAccount from './views/log/ChooseAccount.vue';
import ForgetPassword from './views/log/ForgetPassword.vue';
import GetSupport from './views/log/GetSupport.vue';
import LogIn from './views/log/LogIn.vue';
import NotFound from './views/log/NotFound.vue';
import Register from './views/log/Register.vue';
import ResetPassword from './views/log/ResetPassword.vue';
import AdminUsers from './views/manage/AdminUsers.vue';
import ChangeAvatar from './views/manage/ChangeAvatar.vue';
import ChangePassword from './views/manage/ChangePassword.vue';
import CreateAuthorization from './views/manage/CreateAuthorization.vue';
import EditAuthorization from './views/manage/EditAuthorization.vue';
import Manage from './views/manage/Manage.vue';
import Manage2FA from './views/manage/Manage2FA.vue';
// import ManageAdminOAuth from './views/manage/ManageAdminOAuth.vue';
import ManageAuthorization from './views/manage/ManageAuthorization.vue';
import ManageIndex from './views/manage/ManageIndex.vue';
import ManageInfos from './views/manage/ManageInfos.vue';
import ManageSafety from './views/manage/ManageSafety.vue';
import ManageNotFound from './views/manage/NotFound.vue';
import RelatedFrame from './views/manage/RelatedFrame.vue';
import SudoMode from './views/manage/SudoMode.vue';

library.add(fas);

// import routes
const routes = [
    {
        path: '/',
        name: 'login',
        component: LogIn,
        meta: {
            title: 'log.login_page.title',
        },
    },
    {
        path: '/choose-account',
        name: 'choose-account',
        component: ChooseAccount,
        meta: {
            title: 'log.choose_account_page.title',
        },
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            title: 'log.register_page.title',
        },
    },
    {
        path: '/forget-password',
        name: 'forget_password',
        component: ForgetPassword,
        meta: {
            title: 'log.forget_password_page.title',
        },
    },
    {
        path: '/reset-password',
        name: 'reset_password',
        component: ResetPassword,
        meta: {
            title: 'log.reset_password_page.title',
        },
    },
    {
        path: '/support',
        name: 'support',
        component: GetSupport,
        meta: {
            title: 'log.get_support_page.title',
        },
    },
    {
        path: '/active',
        name: 'active',
        component: Active,
        meta: {
            title: 'log.active_account.title',
        },
    },
    { path: '/authorize', name: 'authorize', component: AuthorizePage },
    {
        path: '/manage',
        name: 'manage',
        component: Manage,
        children: [
            {
                path: '',
                name: 'manage_index',
                component: ManageIndex,
                meta: {
                    title: 'manage.index.browser_title',
                },
            },
            {
                path: 'safety',
                name: 'manage_safety',
                component: ManageSafety,
                meta: {
                    title: 'manage.account_safety_block.title',
                },
            },
            {
                path: 'infos',
                name: 'manage_infos',
                component: ManageInfos,
                meta: {
                    title: 'manage.infos.title',
                },
            },
            {
                path: 'authorization',
                name: 'authorization',
                component: ManageAuthorization,
                meta: {
                    title: 'manage.authorization.title',
                },
            },
            {
                path: 'create_oauth_app',
                name: 'manage_create_oauth_app',
                component: CreateAuthorization,
                meta: {
                    title: 'manage.create_oauth_app.title',
                },
            },
            {
                path: 'manage_oauth_detail',
                name: 'manage_oauth_detail',
                component: EditAuthorization,
                meta: {
                    title: 'manage.manage.oauth_app_detail_page.title',
                },
            },
            {
                path: 'two-factor-authentication-setup',
                name: 'setup_2fa',
                component: Manage2FA,
                meta: {
                    title: 'manage.setup_2fa.title',
                },

            },
            {
                path: 'change-password',
                name: 'change_password',
                component: ChangePassword,
                meta: {
                    title: 'manage.change_password.title',
                },
            },
            {
                path: 'change-avatar',
                name: 'change_avatar',
                component: ChangeAvatar,
                meta: {
                    title: 'manage.change_avatar.title',
                },
            },
            {
                path: 'admin',
                name: 'admin',
                children:
                    [
                        // {
                        //     path: 'oauth',
                        //     name: 'oauth',
                        //     component: ManageAdminOAuth,
                        //     meta: {
                        //         title: 'manage.admin_oauth_manager.title',
                        //     },
                        // },
                        {
                            path: 'users',
                            name: 'users',
                            component: AdminUsers,
                            meta: {
                                title: 'manage.admin_users_list.title',
                            },
                        },
                    ],
            },
            {
                path: ':pathMatch(.*)*',
                name: 'manage_notfound',
                component: ManageNotFound,
                meta: {
                    title: 'log.not_found_page.title',
                },
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not_found',
        component: NotFound,
        meta: {
            title: 'log.not_found_page.title',
        },
    },
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
    .use(VueSweetalert2)
    .provide(DefaultApolloClient.DefaultApolloClient, apolloClient)
    .component('font-awesome-icon', FontAwesomeIcon)
    .component('vue-qr', vueQr)
    .component('i18n', i18n)
    .component('Footer', FooterItems)
    .component('LinkA', LinkA)
    .component('RoundedUser', RoundedUser)
    .component('LabelInput', LabelInput)
    .component('Footer', FooterItems)
    .component('UserButton', UserButton)
    .component('SafetyChecker', SafetyChecker)
    .component('sudo-mode', SudoMode)
    .component('RelatedFrame', RelatedFrame);
app.mount('#app');

// eslint-disable-next-line import/prefer-default-export
export {
    apolloClient, languages, i18n, router,
};
