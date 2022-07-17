<template>
    <h1>{{ $t("log.login_page.title") }}</h1>
    <p class="h1then" v-if="oauth.name">{{ $t('log.login_page.continue', { app: oauth.name }) }}</p>
    <div class="form">
        <label-input model="username" type="text" label="log.username" enablescale=false autofocus="true"
            @getdata="setData">
        </label-input>
        <label-input model="password" type="password" label="log.password" enablescale=false @getdata="setData">
        </label-input>
        <label class="checkbox">
            <input v-model="keepLog" type="checkbox">
            <span>{{ $t("log.login_page.keep_me_logged_in") }}</span>
        </label>
        <p v-if="serviceMsg" :class="{ error: isError, serviceMsg }">{{ serviceMsg }}</p>
        <button v-if="!processing" @click="login">{{ $t("log.login_page.submit") }}</button>
    </div>
    <div class="related">
        <router-link v-for="item in related" :to="item.path" :key="item.name">{{ $t('log.link.' + item.name) }}
        </router-link>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

import LabelInput from '../../components/LabelInput.vue';
// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../log';

export default {
    name: 'LogIn',
    data() {
        return {
            keepLog: true,
            related: [
                {
                    name: 'register',
                    path: '/register',
                },
                {
                    name: 'forget_password',
                    path: '/forget-password',
                },
            ],
            oauth: {
                name: '3rd Party',
            },
            serviceMsg: '',
            processing: false,
        };
    },
    methods: {
        login() {
            // eslint-disable-next-line no-alert
            // alert(`${this.username} ${this.password}`);
            this.isError = true;
            if (!this.username || this.username === '') {
                this.serviceMsg = this.$t('log.error.username_empty');
                return;
            }
            if (!this.password || this.password === '') {
                this.serviceMsg = this.$t('log.error.password_empty');
                return;
            }
            this.serviceMsg = this.$t('log.login_page.processing');
            this.isError = false;
            this.processing = true;

            apolloClient.query({
                query: gql`query Query($user: String, $pass: String) {
  User {
    login(user: $user, pass: $pass)
  }
}`,
                variables: {
                    user: this.username,
                    pass: this.password,
                },
            }).then(({ data }) => {
                console.log(data);
            }, (error) => {
                console.log(error);
                this.serviceMsg = this.$t(`log.error.${error.graphQLErrors ? error.graphQLErrors[0].message : 'unknown_error'}`);
                this.isError = true;
            }).then(() => {
                this.processing = false;
            });
        },
        setData(name, data) {
            this[name] = data;
        },
    },
    components: { LabelInput },
};
</script>
