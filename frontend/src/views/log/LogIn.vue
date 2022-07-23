<template>
    <h1>{{ $t("log.login_page.title") }}</h1>
    <p class="h1then" v-if="oauth.name">{{ $t('log.login_page.continue', { app: oauth.name }) }}</p>
    <form class="form" @submit.prevent="login">
        <label-input model="username" type="text" label="log.username" enablescale=false autofocus="true"
            @getdata="setData">
        </label-input>
        <label-input model="password" type="password" label="log.password" enablescale=false @getdata="setData">
        </label-input>
        <!-- I'm not sure if it's useful -->
        <label class="checkbox" style="display: none;">
            <input v-model="keepLog" type="checkbox">
            <span>{{ $t("log.login_page.keep_me_logged_in") }}</span>
        </label>
        <p v-if="serviceMsg" :class="{ error: isError, serviceMsg }">{{ serviceMsg }}</p>
        <button :class="{ processing: processing }">{{ $t("log.login_page.submit") }}</button>
    </form>
    <router-link v-if="sessions.length > 0" class="useAnotherAccount" to="/choose-account">
        <LinkA :text="$t('log.login_page.logged_account')"></LinkA>
    </router-link>
    <div class="related">
        <router-link v-for="item in related" :to="item.path" :key="item.name">{{ $t('log.link.' + item.name) }}
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
            sessions: [],
        };
    },
    mounted() {
        this.sessions = getSessions();
    },
    methods: {
        login() {
            this.isError = true;
            if (!this.username || this.username === '') {
                this.serviceMsg = this.$t('log.error.username_empty');
                return;
            }
            if (!this.password || this.password === '') {
                this.serviceMsg = this.$t('log.error.password_empty');
                return;
            }
            this.serviceMsg = '';
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
                // get user detail
                const logToken = data.User.login;
                apolloClient.query({
                    query: gql`query Query($token: String) {
  User(token: $token) {
    getUser {
      uuid
      user
      mail
      nick
      avatar
      mood
      role
      regat
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
                    // oauth in the near future
                    // go to manage page
                    this.$router.push('/manage');
                    this.$emit('getdata', 'inManagePage', true);
                }, (error) => {
                    console.log(error);
                    this.serviceMsg = this.$t('log.error.userinfo_get_failed')
                        + this.$t(`log.error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'unknown_error'}`);
                    this.isError = true;
                    this.processing = false;
                });
            }, (error) => {
                console.log(error);
                this.serviceMsg = this.$t(`log.error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'unknown_error'}`);
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
