<template>
    <h1>{{ $t("log.authorize_page.title", { app: oauth.name }) }}</h1>
    <p class="h1then" v-if="oauth.client_name">{{ $t('log.authorize_page.continue', { app: oauth.client_name }) }}</p>
    <p class="h1then">{{ user.nick ?? $t('unknown') }}</p>
    <form class="form" method="post" :action="oauthJump">
        <div class="authorize" v-if="!isFatalError && oauth">
            <p class="h1then">{{ $t('log.authorize_page.app_permission_scope_title') }}</p>
            <p class="h1then">{{ oauth.scope }}</p>
        </div>
        <p v-if="serviceMsg" :class="{ error: isError, serviceMsg }">{{ serviceMsg }}</p>
        <div style="visibility: hidden;">
            <input name="client_id" :value="oauth.client_id" />
            <input name="redirect_uri" :value="oauth.redirect_uri" />
            <input name="scope" :value="oauth.scope" />
            <input name="session_id" :value="user.token" />
        </div>
        <button :class="{ processing: processing }">{{ $t("log.authorize_page.submit") }}</button>
    </form>
    <div class="related">
        <router-link v-for="item in related" :to="item.path" :key="item.name">{{ $t('log.link.' + item.name) }}
        </router-link>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

import config from '../../config';
// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';
import oauthAppScopes from '../../oauthAppScopes';
import { deleteSession, getSessions } from '../../sessions';
import { getAvatar } from '../../utils';

export default {
    name: 'AuthorizePage',
    data() {
        return {
            related: [],
            oauth: {
                client_id: '',
                client_name: '',
                redirect_uri: '',
                scope: [],
            },
            serviceMsg: '',
            processing: false,
            isFatalError: false,
            is2FA: false,
            sessions: [],
            avaliableSession: [],
            user: {},
            oauthJump: `${config?.oauthBackEnd}/authorize`,
        };
    },
    mounted() {
        this.trySessions();
        this.oauth = {
            client_id: this.$route.query.client_id,
            client_name: this.$route.query.client_name,
            redirect_uri: this.$route.query.redirect_uri,
            scope: this.$route.query.scope,
        };
        if (!this.oauth.client_id || !this.oauth.client_name || !this.oauth.redirect_uri || !this.oauth.scope) {
            this.serviceMsg = this.$t('error.authorize_page_invalid_request');
            this.isFatalError = true;
            this.oauth = {
                client_name: this.$t('log.authorize_page.unknown_app'),
                scope: [],
            };
        } else {
            this.oauth.scope = this.oauth.scope.split(' ');
            this.oauth.scope.forEach((scope) => {
                if (!oauthAppScopes.includes(scope)) {
                    this.serviceMsg = this.$t('error.authorize_page_invalid_scope');
                    this.isFatalError = true;
                    this.oauth = {
                        client_name: this.$t('log.authorize_page.unknown_app'),
                        scope: [],
                    };
                }
            });
        }
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
    },
};
</script>
