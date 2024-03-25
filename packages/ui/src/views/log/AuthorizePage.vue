<template>
    <h1 v-if="!isFatalError && oauth.client_name">{{ $t("log.authorize_page.title", { app: oauth.client_name }) }}</h1>
    <h1 v-else>{{ $t('log.authorize_page.title_error') }}</h1>
    <p class="h1then" v-if="oauth.client_name && !isFatalError"
        v-html="$t('log.authorize_page.continue', { app: `<b>${oauth.client_name}</b>` })">
    </p>
    <RoundedUser :user="user" :showswitch="true" :style="{ 'marginTop': '-6px', 'marginBottom': '20px' }"
        :title="$t('log.authorize_page.account_switch_button_title')" @click="goToPage('choose-account')">
    </RoundedUser>
    <form class="form" method="post" :action="oauthJump">
        <div class="authorize" v-if="!isFatalError && oauth">
            <p class="h1then">{{ $tc('log.authorize_page.app_permission_scope_title', oauth.scope?.length) }}</p>
        </div>
        <p v-if="serviceMsg" :class="{ error: isError, serviceMsg }">{{ serviceMsg }}</p>
        <div style="visibility: hidden; height: 0;">
            <input name="client_id" :value="oauth.client_id" />
            <input name="redirect_uri" :value="oauth.redirect_uri" />
            <input name="scope" :value="oauth.scope" />
            <input name="session_id" :value="user.token" />
        </div>
        <div class="scopesDisplayBox">
            <div class="scope" v-for="scope in oauth.scope" :key="scope">
                <font-awesome-icon class="icon"
                    :icon="[oauthAppScopes[scope].icon.split(' ')[0], oauthAppScopes[scope].icon.split(' ')[1]]" />
                <div class="scopeName">{{ $t('authorize_scope.' + scope) }}</div>
            </div>
        </div>
        <button :class="{ processing: processing }" v-if="!isFatalError">{{ $t("log.authorize_page.submit") }}</button>
    </form>
    <div class="related">
        <router-link v-for="item in related" :to="{ path: item.path, query: $route.query }" :key="item.name">{{
        $t('log.link.' + item.name)
    }}
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
            oauthAppScopes,
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
                if (!oauthAppScopes[scope]) {
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
                this.$router.push({
                    path: '/',
                    query: this.$route.query,
                });
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
                            this.$router.push({ name: 'login', query: this.$route.query });
                        } else {
                            // eslint-disable-next-line prefer-destructuring
                            this.user = this.avaliableSession[0];
                        }
                    }
                });
            });
        },
        goToPage(page) {
            this.$router.push({ name: page, query: this.$route.query });
        },
    },
};
</script>
<style lang="scss" scoped>
.scopesDisplayBox {
    display: flex;
    flex-direction: column;
    margin: -9px auto;
    padding-bottom: 13px;

    .scope {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 4px 0;

        .icon {
            font-size: 16px;
            width: 23px;
            margin-right: 5px;
            flex-shrink: 0;
        }

        .scopeName {
            font-size: 15px;
        }
    }
}
</style>
