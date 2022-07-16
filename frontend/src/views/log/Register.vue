<template>
    <h1>{{ $t("log.register_page.title") }}</h1>
    <p class="h1then">{{ $t('log.register_page.tip') }}</p>
    <div class="form">
        <label-input v-for="item in form" :key="item.id" :model="item.id" :type="item.type" :label="item.label"
            :autofocus="item.autofocus" @getdata="setData">
        </label-input>
        <label class="checkbox">
            <input v-model="agreeTerms" type="checkbox">
            <span v-html="$t('log.register_page.accept_terms.text', {
                terms: `<a href='https://nmteam.xyz/legal/network-service-protocol' target='_blank'>${$t('log.register_page.accept_terms.terms')}</a>`,
                privacy: `<a href='https://nmteam.xyz/legal/privacy_policy' target='_blank'>${$t('log.register_page.accept_terms.privacy')}</a>`
            })">
            </span>
        </label>
        <button @click="register">{{ $t("log.register_page.submit") }}</button>
    </div>
    <div class="related">
        <router-link v-for="item in related" :to="item.path" :key="item.name">{{ $t('log.link.' + item.name) }}
        </router-link>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

import LabelInput from '../../components/LabelInput.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Register',
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
        register() {
            // eslint-disable-next-line no-alert
            // alert(`${this.username} ${this.password}`);
            apolloClient.query({
                query: gql`query Query($user: String, $pass: String, $mail: String) {
  User {
    register(user: $user, pass: $pass, mail: $mail)
  }
}`,
                variables: {
                    user: this.username,
                    pass: this.password,
                    mail: this.email,
                },
            }).then(({ data }) => {
                console.log(data);
            });
        },
        setData(name, data) {
            this[name] = data;
        },
    },
    components: { LabelInput },
};
</script>
