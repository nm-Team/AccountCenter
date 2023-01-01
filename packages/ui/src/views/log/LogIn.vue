<template>
    <h1>{{ $t("log.login_page.title") }}</h1>
    <p class="h1then" v-if="oauth.name">{{ $t('log.login_page.continue', { app: oauth.name }) }}</p>
    <form class="form" @submit.prevent="login">
        <label-input model="username" type="text" label="log.username" enablescale="false" autofocus="true"
            @getdata="setData" @blur="check2FA()" @change="check2FA()">
        </label-input>
        <label-input model="password" type="password" label="log.password" enablescale="false" @getdata="setData">
        </label-input>
        <label-input v-if="is2FA" model="tfaCode" type="text" label="log.2fa" enablescale="false" @getdata="setData">
        </label-input>
        <!-- I'm not sure if it's useful -->
        <label class="checkbox" style="display: none;">
            <input v-model="keepLog" type="checkbox">
            <span>{{ $t("log.login_page.keep_me_logged_in") }}</span>
        </label>
        <p v-if="serviceMsg" :class="{ error: isError, serviceMsg }">{{ serviceMsg }}</p>
        <button :class="{ processing: processing }">{{ $t("log.login_page.submit") }}</button>
    </form>
    <router-link v-if="sessions.length > 0" class="useAnotherAccount"
        :to="{ path: '/choose-account', query: $route.query }">
        <LinkA :text="$t('log.login_page.logged_account')"></LinkA>
    </router-link>
    <div class="related">
        <router-link v-for="item in related" :to="{ path: item.path, query: $route.query }" :key="item.name">{{
        $t('log.link.' + item.name)
            }}
        </router-link>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';
import { addSession, getSessions } from '../../sessions';

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
            is2FA: false,
            sessions: [],
        };
    },
    mounted() {
        this.sessions = getSessions();
    },
    methods: {
        check2FA() {
            if (this.username && this.username !== '') {
                apolloClient.query({
                    query: gql`query User($user: String) {
  User(user: $user) {
    getUser {
      tfa
    }
  }
}
                    `,
                    variables: {
                        user: this.username,
                    },
                }).then(({ data }) => {
                    console.log(data);
                    this.is2FA = data.User.getUser.tfa;
                });
            }
        },
        login() {
            this.isError = true;
            if (!this.username || this.username === '') {
                this.serviceMsg = this.$t('error.username_empty');
                return;
            }
            if (!this.password || this.password === '') {
                this.serviceMsg = this.$t('error.password_empty');
                return;
            }
            this.serviceMsg = '';
            this.isError = false;
            this.processing = true;

            apolloClient.query({
                query: gql`query Query($user: String, $pass: String, $code: String) {
  User {
    login(user: $user, pass: $pass, code: $code)
  }
}`,
                variables: {
                    user: this.username,
                    pass: this.password,
                    code: this.tfaCode,
                },
            }).then(({ data }) => {
                console.log(data);
                // get user detail
                const logToken = data.User.login;
                apolloClient.query({
                    query: gql`query Query($token: String) {
  User(token: $token) {
    getUser {
      uuid
    }
  }
}`,
                    variables: {
                        token: data.User.login,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                }).then(({ data }) => {
                    const userInfoData = data.User.getUser;
                    console.log(data);
                    const newSession = userInfoData;
                    newSession.token = logToken;
                    addSession(newSession);
                    this.processing = false;
                    if (this.$route.query.client_id) {
                        this.$router.push({ name: 'authorize', query: this.$route.query });
                    } else {
                        this.$router.push('/manage');
                        this.$emit('getdata', 'inManagePage', true);
                    }
                }, (error) => {
                    console.log(error);
                    this.serviceMsg = this.$t('error.userinfo_get_failed')
                        + this.$t(`error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'network_error'}`);
                    this.isError = true;
                    this.processing = false;
                });
            }, (error) => {
                console.log(error);
                this.serviceMsg = this.$t(`error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'network_error'}`);
                this.isError = true;
                this.processing = false;
            });
        },
        setData(name, data) {
            this[name] = data;
        },
    },
};
</script>
