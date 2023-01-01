<template>
    <div v-if="step == 0">
        <h1>{{ $t("log.reset_password_page.title") }}</h1>
        <p class="h1then">{{ $t('log.reset_password_page.tip') }}</p>
        <form class="form" @submit.prevent="submit">
            <label-input v-for="item in form" :key="item.id" :model="item.id" :type="item.type" :label="item.label"
                :autofocus="item.autofocus" @getdata="setData">
            </label-input>
            <p v-if="serviceMsg" :class="{ error: isError, serviceMsg }">{{ serviceMsg }}</p>
            <button>{{ $t("log.reset_password_page.nextstep") }}</button>
        </form>
    </div>
    <div v-if="step == 1">
        <h1>{{ $t("log.reset_password_page.success.title") }}</h1>
        <p class="h1then">{{ $t('log.reset_password_page.success.tip') }}</p>
    </div>
    <div v-if="step == 2">
        <h1>{{ $t("log.reset_password_page.error.title") }}</h1>
        <p class="h1then">{{ $t('log.reset_password_page.error.msg.0') }}</p>
        <p class="h1then">{{ $t('log.reset_password_page.error.msg.1') }}</p>
        <p v-if="serviceMsg" :class="{ error: isError, serviceMsg }">{{ serviceMsg }}</p>
    </div>
    <div class="related">
        <router-link v-for="item in related" :to="{ path: item.path, query: $route.query }" :key="item.name">{{ $t('log.link.' + item.name) }}
        </router-link>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    name: 'ResetPassword',
    data() {
        return {
            form: [
                { id: 'password', type: 'password', label: 'log.password' },
                { id: 'confirmpassword', type: 'password', label: 'log.confirm_password' },
            ],
            step: 0,
            related: [
                {
                    name: 'login',
                    path: '/',
                },
                {
                    name: 'register',
                    path: '/register',
                },
                {
                    name: 'support',
                    path: '/support',
                },
            ],
            serviceMsg: '',
            processing: false,
        };
    },
    mounted() {
        if (!this.$route.query.token || this.$route.query.token === '') {
            this.serviceMsg = this.$t('error.token_not_found');
            this.step = 2;
        }
    },
    methods: {
        submit() {
            this.isError = true;
            if (!this.password || this.password === '') {
                this.serviceMsg = this.$t('error.password_empty');
                return;
            }
            if (!this.confirmpassword || this.confirmpassword === '') {
                this.serviceMsg = this.$t('error.confirm_password_empty');
                return;
            }
            if (this.password !== this.confirmpassword) {
                this.serviceMsg = this.$t('error.password_not_match');
                return;
            }
            this.serviceMsg = '';
            this.isError = false;
            this.processing = true;

            apolloClient.query({
                query: gql`query User($token: String, $pass: String) {
  User {
    resetPass(token: $token, pass: $pass)
  }
}`,
                variables: {
                    token: this.$route.query.token,
                    pass: this.password,
                },
            }).then(({ data }) => {
                console.log(data);
                this.step = 1;
            }, (error) => {
                console.log(error);
                this.serviceMsg = this.$t(`error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'network_error'}`);
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
