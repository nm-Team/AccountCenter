<template>
    <h1>{{ $t("log.choose_account_page.title") }}</h1>
    <p class="h1then" v-if="$route.query.client_name">{{ $t('log.choose_account_page.tip', {
        oauth: $t('log.login_page.continue', {
            app: $route.query.client_name
        })
    })
}}</p>
    <div class="uList">
        <div class="commonLoading" v-if="avaliableSession.length == 0"></div>
        <UserButton v-for="user, index in avaliableSession" :key="user.uuid" :user="user" force-border="true"
            @click="switchAccount(index)">
        </UserButton>
    </div>
    <router-link class="useAnotherAccount" :to="{ name: 'login', query: $route.query }">
        <LinkA :text="$t('log.choose_account_page.new')"></LinkA>
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
import { deleteSession, getSessions, useSession } from '../../sessions';
import { getAvatar } from '../../utils';

export default {
    name: 'ChooseAccount',
    data() {
        return {
            pageLoading: true,
            avaliableSession: [],
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
            serviceMsg: '',
            processing: false,
        };
    },
    mounted() {
        this.trySessions();
    },
    methods: {
        trySessions() {
            // eslint-disable-next-line prefer-const
            let sessions = getSessions();
            if (sessions.length === 0) {
                this.$router.push('/');
            }
            let sessionsCheckedCount = 0;
            sessions.forEach((session, index) => {
                apolloClient.query({
                    query: gql`query Query($token: String) {
  User(token: $token) {
    getUser {
      uuid
      user
      nick
      avatar
      tfa
      mail
    }
  }
}`,
                    variables: {
                        token: session.token,
                    },
                }).then(({ data }) => {
                    console.log(data);
                    const uData = data.User.getUser;
                    if (uData.user === 'guest') {
                        deleteSession(session);
                        this.avaliableSession[index] = false;
                    } else {
                        uData.token = session.token;
                        uData.avatarURL = getAvatar(uData.avatar);
                        this.avaliableSession[index] = uData;
                    }
                }, (error) => {
                    console.log(error);
                    if (error.graphQLErrors && error.graphQLErrors[0]) { deleteSession(session); }
                    this.avaliableSession[index] = false;
                }).then(() => {
                    sessionsCheckedCount++;
                    if (sessionsCheckedCount === sessions.length) {
                        this.pageLoading = false;
                        for (let i = 0; i < this.avaliableSession.length; i++) {
                            if (this.avaliableSession[i] === false) {
                                this.avaliableSession.splice(i, 1);
                                i--;
                            }
                        }
                        if (this.avaliableSession.length === 0) {
                            this.$router.push('/');
                        } else {
                            // eslint-disable-next-line prefer-destructuring
                            this.user = this.avaliableSession[0];
                        }
                    }
                });
            });
        },
        switchAccount(index) {
            useSession(this.avaliableSession[index]);
            if (this.$route.query.client_id) {
                this.$router.push({ name: 'authorize', query: this.$route.query });
            } else {
                this.$router.push('/manage');
                this.$emit('getdata', 'inManagePage', true);
            }
        },
    },
    components: {},
};
</script>
