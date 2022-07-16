<template>
    <h1>{{ $t("log.register_page.title") }}</h1>
    <p class="h1then">{{ $t('log.register_page.tip') }}</p>
    <div class="form">
        <label-input v-for="item in form" :key="item.id" :model="item.id" :type="item.type" :label="item.label" :autofocus="item.autofocus" @getdata="setData">
        </label-input>
        <label class="checkbox">
            <input v-model="agreeTerms" type="checkbox">
            <span
                v-html="$t('log.register_page.accept_terms.text', { terms: `<a href='https://nmteam.xyz/legal/network-service-protocol' target='_blank'>${$t('log.register_page.accept_terms.terms')}</a>`, privacy: `<a href='https://nmteam.xyz/legal/privacy_policy' target='_blank'>${$t('log.register_page.accept_terms.privacy')}</a>` })"></span>
        </label>
        <button @click="register">{{ $t("log.register_page.submit") }}</button>
    </div>
    <div class="related">
        <router-link v-for="item in related" :to="item.path" :key="item.name">{{ $t('log.link.' + item.name) }}</router-link>
    </div>
</template>
<script>
import LabelInput from '../../components/LabelInput.vue';

export default {
    name: 'Register', // eslint-disable-line
    data() {
        return {
            form: [
                {
                    id: 'email', type: 'text', label: 'log.email', autofocus: true,
                },
                { id: 'username', type: 'text', label: 'log.username' },
                { id: 'password', type: 'password', label: 'log.password' },
                { id: 'confirmpassword', type: 'password', label: 'log.confirm_password' },
            ],
            related: [
                {
                    name: 'login',
                    path: '/',
                },
                {
                    name: 'forget_password',
                    path: '/forget-password',
                },
            ],
            oauth: {
                name: '3rd Party',
            },
        };
    },
    methods: {
        login() {
            alert(`${this.username} ${this.password}`); // eslint-disable-line
        },
        setData(name, data) {
            this[name] = data;
        },
    },
    components: { LabelInput },
};
</script>
