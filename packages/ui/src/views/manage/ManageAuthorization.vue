<template>
    <h1>{{ $t('manage.authorization.title') }}</h1>
    <p>{{ $t('manage.authorization.description') }}</p>
    <div class="block">
        <p class="title">{{ $t('manage.authorization.nmteam_services') }}</p>
        <p>{{ $t('manage.authorization.nmteam_services_description') }}</p>
        <div class="oAppView" v-for="app in authorizedApp.nmTeam" :key="app.id">
            <div class="icon" :style="{ backgroundImage: `url(${app.icon})` }"></div>
            <div class="infos">
                <p class="appName">{{ app.name }}</p>
                <p class="appDescription" v-if="app.description">{{ app.description }}</p>
                <p class="appDescription" v-else>{{ $t('manage.authorization.no_description') }}</p>
                <p class="appTimes">
                    <span>{{ $t('manage.authorization.reg_at') }}</span>
                    ·
                    <span>{{ $t('manage.authorization.last_seen') }}</span>
                </p>
                <a class="action" :href="app.url" target="_blank">{{ $t('manage.authorization.open_app_website') }}</a>
                ·
                <a class="action" href="javascript:" target="_self">{{ $t('manage.authorization.cancel_authorization')
                }}</a>
            </div>
        </div>
    </div>
    <div class="block">
        <p class="title">{{ $t('manage.authorization.3rd_party_services') }}
            <button class="blockButton" style="float: right; margin-top: 0;" @click="0">
                {{ $t('manage.authorization.cancel_all_authorizations') }}</button>
        </p>
        <p>{{ $t('manage.authorization.3rd_party_services_description') }}</p>
        <label-input model="searchKeyword" type="text" label="manage.authorization.search" enablescale="false"
            autofocus="false" @getdata="setData" @keyup.enter="0">
        </label-input>
    </div>
    <div class="block">
        <p class="title">{{ $t('manage.authorization.manage_my_apps') }}
            <button class="blockButton" style="float: right; margin-top: 0;" @click="goToPage('manage_create_oauth_app')">
                {{ $t('manage.authorization.create_a_new_app') }}</button>
        </p>
        <p>{{ $t('manage.authorization.manage_my_apps_text') }}</p>
        <label-input model="searchKeyword" type="text" label="manage.authorization.search" enablescale="false"
            autofocus="false" @getdata="setData" @keyup.enter="0">
        </label-input>
        <div class="oAppView" v-for="app in myOauthAppsList" :key="app.clientId">
            <div class="icon" :style="{ backgroundImage: `url(${app.icon})` }"></div>
            <div class="infos">
                <p class="appName">{{ app.name }}</p>
                <p class="appDescription">{{ app.clientId }}</p>
                <p class="appDescription" v-if="app.description">{{ app.description }}</p>
                <p class="appDescription" v-else>{{ $t('manage.authorization.no_description') }}</p>
                <a class="action" href="javascript:" target="_self" @click="openOauthDetailPage(app.clientId)">{{
                    $t('manage.authorization.detail')
                }}</a>
            </div>
        </div>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    name: 'ManageAuthorization',
    data() {
        return {
            // for beta
            authorizedApp: {
                nmTeam: [
                    {
                        id: '1',
                        name: 'nmFun',
                        icon: 'https://websiteres.nmteam.xyz/producticon/nmTeam/logo@64.png',
                        description: 'nmFun is a forum for nmTeam users to spread their fun.',
                    },
                    {
                        id: '1',
                        name: 'nmFun',
                        icon: 'https://websiteres.nmteam.xyz/producticon/nmTeam/logo@64.png',
                        description: 'nmFun is a forum for nmTeam users to spread their fun.',
                    },
                ],
                thirdParty: [
                    {
                        id: '1',
                        name: 'nmFun',
                        icon: '',
                        description: 'nmFun is a forum for nmTeam users to spread their fun.',
                    },
                ],
            },
            myOauthAppsList: [],
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    inject: ['defaultSwal'],
    mounted() {
        this.getMyOauthApps();
    },
    watch: {
        user: {
            handler() {
                this.getMyOauthApps();
            },
            deep: true,
        },
    },
    methods: {
        getMyOauthApps() {
            apolloClient.query({
                query: gql`query Oauth($token: String) {
  oauth(token: $token) {
    getClientList {
      clientId
      name
      description
      icon
      redirectUris
      ownerId
    }
  }
}
`,
                variables: {
                    token: this.user.token,
                },
            }).then(({ data }) => {
                console.log(data);
                this.myOauthAppsList = data.oauth.getClientList;
            }, (error) => {
                console.log(error);
            });
        },
        goToPage(page) {
            this.$router.push({ name: page, query: this.$route.query });
        },
        openOauthDetailPage(clientId) {
            this.$router.push({ name: 'manage_oauth_detail', query: { clientId } });
        },
    },
};
</script>
<style lang="scss" scoped>
.oAppView {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 0;
    font-size: 15.2px;
    border-bottom: 1px solid var(--block-border);

    .icon {
        width: 50px;
        height: 50px;
        margin: 5px 10px 0px 0px;
        text-align: center;
        flex-shrink: 0;
        border-radius: 50%;

        background: {
            color: var(--avatar-skection);
            size: cover;
            repeat: no-repeat;
            position: center;
        }
    }

    .infos {
        flex: 1;

        .appName {
            font-size: 17px;
            font-weight: bold;
        }

        .appDescription {
            font-size: 15.2px;
        }

        .appTimes {
            font-size: 14px;
        }
    }
}

.oAppView:last-of-type {
    border: none;
    padding-bottom: 5px;
}
</style>
