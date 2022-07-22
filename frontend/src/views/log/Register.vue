<template>
    <div v-if="!regSuccess">
        <h1>{{ $t("log.register_page.title") }}</h1>
        <p class="h1then">{{ $t('log.register_page.tip') }}</p>
        <form class="form" @submit.prevent="register">
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
            <p v-if="serviceMsg" :class="{ error: isError, serviceMsg }">{{ serviceMsg }}</p>
            <button :class="{ processing: processing }">{{ $t("log.register_page.submit") }}</button>
        </form>
    </div>
    <div v-else>
        <h1>{{ $t("log.register_page.success_title") }}</h1>
        <p class="h1then">{{ $t('log.register_page.success_tip') }}</p>
    </div>
    <div class="related">
        <router-link v-for="item in related" :to="item.path" :key="item.name">{{ $t('log.link.' + item.name) }}
        </router-link>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

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
            serviceMsg: '',
            regSuccess: false,
            processing: false,
        };
    },
    methods: {
        register() {
            this.isError = true;
            if (!this.username || this.username === '') {
                this.serviceMsg = this.$t('log.error.username_empty');
                return;
            }
            if (!this.email || this.email === '') {
                this.serviceMsg = this.$t('log.error.email_empty');
                return;
            }
            if (!this.password || this.password === '') {
                this.serviceMsg = this.$t('log.error.password_empty');
                return;
            }
            if (!this.confirmpassword || this.confirmpassword === '') {
                this.serviceMsg = this.$t('log.error.confirm_password_empty');
                return;
            }
            if (this.password !== this.confirmpassword) {
                this.serviceMsg = this.$t('log.error.password_not_match');
                return;
            }
            if (!this.agreeTerms) {
                this.serviceMsg = this.$t('log.error.agree_terms');
                return;
            }
            this.serviceMsg = '';
            this.isError = false;
            this.processing = true;

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
                this.regSuccess = true;
            }, (error) => {
                console.log(error);
                this.serviceMsg = this.$t(`log.error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'unknown_error'}`);
                this.isError = true;
            }).then(() => {
                this.processing = false;
            });
        },
        setData(name, data) {
            this[name] = data;
        },
    },
};
</script>
