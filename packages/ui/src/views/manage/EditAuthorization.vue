<template>
    <h1>{{ $t('manage.oauth_app_detail_page.title') }}</h1>
    <div class="block" v-if="detailLoading">
        <p>{{ $t('manage.oauth_app_detail_page.loading') }}</p>
    </div>
    <div class="block" v-if="!detailLoading && !oauthAppDetail">
        <p>{{ $t('manage.oauth_app_detail_page.error') }}</p>
    </div>
    <div class="block" v-if="!detailLoading && oauthAppDetail">
        <p class="title">{{ $t('manage.oauth_app_detail_page.client_info.title') }}</p>
        <p>{{ $t('manage.oauth_app_detail_page.client_info.content') }}</p>
        <label-input v-for="item in clientConstForm" :key="item.id" :model="item.id" :type="item.type" :label="item.label"
            readonly :autofocus="item.autofocus" :value="item.value">
        </label-input>
        <div class="btns">
            <div class="right">
                <button class="blockButton" @click="this.revokeSecret()">
                    {{ $t('manage.oauth_app_detail_page.client_info.revoke_secret') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="!detailLoading && oauthAppDetail">
        <label-input v-for="item in appInfoForm" :key="item.id" :model="item.id" :type="item.type" :label="item.label"
            :autofocus="item.autofocus" @getdata="detailOnEdit" :value="item.value">
        </label-input>
        <p>{{ this.serviceMsg }}</p>
        <div class="btns">
            <div class="right">
                <button class="blockButton" @click="this.editOauthApp()">
                    {{ $t('manage.oauth_app_detail_page.edit') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    name: 'EditAuthorization',
    data() {
        return {
            detailLoading: true,
            clientConstForm: [
            ],
            appInfoForm: [
            ],
            oauthAppDetail: false,
            oauthAppDetailEdited: false,
            serviceMsg: '',
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
        this.getOauthAppDetail();
    },
    watch: {
        user: {
            handler() {
                this.getOauthAppDetail();
            },
            deep: true,
        },
    },
    methods: {
        getOauthAppDetail() {
            if (!this.$route.query.clientId) {
                this.loading = false;
                return;
            }
            apolloClient.query({
                query: gql`query Oauth($token: String, $clientId: String, $userId: String) {
  oauth(token: $token) {
    getClient(clientId: $clientId, userId: $userId) {
      clientId
      clientSecret
      description
      icon
      name
      ownerId
      redirectUris
    }
  }
}
`,
                variables: {
                    token: this.user.token,
                    clientId: this.$route.query.clientId,
                    userId: this.user.id,
                },
            }).then(({ data }) => {
                this.oauthAppDetail = data.oauth.getClient?.[0];
                this.oauthAppDetailEdited = this.oauthAppDetail;
                this.clientConstForm = [
                    {
                        id: 'clientId', type: 'text', label: 'manage.oauth_app.client_id', value: this.oauthAppDetail.clientId,
                    },
                    {
                        id: 'clientSecret', type: 'text', label: 'manage.oauth_app.client_secret', value: this.oauthAppDetail.clientSecret,
                    },
                ];
                this.appInfoForm = [
                    {
                        id: 'name', type: 'text', label: 'manage.oauth_app.name', value: this.oauthAppDetail.name,
                    },
                    {
                        id: 'description', type: 'text', label: 'manage.oauth_app.description', value: this.oauthAppDetail.description,
                    },
                    {
                        id: 'icon', type: 'text', label: 'manage.oauth_app.icon', value: this.oauthAppDetail.icon,
                    },
                ];
                this.detailLoading = false;
            }, (error) => {
                console.log(error);
                this.detailLoading = false;
            });
        },
        editOauthApp() {
            if (!this.oauthAppDetailEdited.name) {
                this.serviceMsg = this.$t('manage.create_oauth_app.error_name_empty');
                return;
            }
            if (!this.oauthAppDetailEdited.description) {
                this.serviceMsg = this.$t('manage.oauth_app.error_description_empty');
                return;
            }
            apolloClient.query({
                query: gql`query Oauth($clientId: String, $name: String, $description: String, $icon: String, $redirectUri: String, $token: String) {
  oauth(token: $token) {
    updateClient(clientId: $clientId, name: $name, description: $description, icon: $icon, redirectUri: $redirectUri)
  }
}
`,
                variables: {
                    token: this.user.token,
                    clientId: this.oauthAppDetail.clientId,
                    name: this.oauthAppDetailEdited.name,
                    description: this.oauthAppDetailEdited.description,
                    icon: this.oauthAppDetailEdited.icon,
                    redirectUri: this.oauthAppDetailEdited.redirectUri,
                },
            }).then(({ data }) => {
                console.log(data);
                this.defaultSwal.fire({
                    title: this.$t('manage.oauth_app_detail_page.edit_success'),
                    icon: 'success',
                });
                this.serviceMsg = '';
                this.oauthAppDetail = this.oauthAppDetailEdited;
            }, (error) => {
                console.log(error);
            });
        },
        setData(name, data) {
            this[name] = data;
        },
        detailOnEdit(name, data) {
            this.oauthAppDetailEdited[name] = data;
        },
    },
};
</script>
<style lang="scss" scoped></style>
