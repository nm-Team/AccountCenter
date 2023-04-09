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
            readonly :autofocus="item.autofocus" :value="item.value" :button="['fas', 'copy']"
            :buttontitle="copyButtonTitle" @buttonOnClick="copy(item.value)">
        </label-input>
        <div class="btns">
            <div class="right">
                <button class="blockButton" @click="this.revokeSecret()">
                    {{ $t('manage.oauth_app_detail_page.client_info.revoke_secret') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="!detailLoading && oauthAppDetail">
        <p class="title">{{ $t('manage.oauth_app_detail_page.edit_block.title') }}</p>
        <p>{{ $t('manage.oauth_app_detail_page.edit_block.content') }}</p>
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
    <div class="block" v-if="!detailLoading && oauthAppDetail">
        <p class="title">{{ $t('manage.oauth_app_detail_page.edit_redirect_uris.title') }}</p>
        <p>{{ $t('manage.oauth_app_detail_page.edit_redirect_uris.content') }}</p>
        <label-input v-for="item in redirectUrisForm" :key="item.id" :model="item.id" :type="item.type" :label="item.label"
            :autofocus="item.autofocus" @getdata="redirectUrisOnEdit" :value="item.value">
        </label-input>
        <p>{{ this.redirectUrisServiceMsg }}</p>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="this.oauthAppRedirectUrisEdited.push('')">
                    {{ $t('manage.oauth_app_detail_page.add_redirect_uri') }}</button>
            </div>
            <div class="right">
                <button class="blockButton" @click="this.editOauthAppRedirectUris()">
                    {{ $t('manage.oauth_app_detail_page.update') }}</button>
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
            oauthAppRedirectUris: [],
            oauthAppRedirectUrisEdited: [],
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
    computed: {
        redirectUrisForm() {
            const redirectUrisForm = [];
            this.oauthAppRedirectUrisEdited.forEach((item, index) => {
                redirectUrisForm.push({
                    id: `${index}`, type: 'text', label: 'manage.oauth_app.redirect_uri', value: item,
                });
            });
            return redirectUrisForm;
        },
        copyButtonTitle() {
            return this.$t('manage.oauth_app_detail_page.client_info.copy');
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
                this.oauthAppRedirectUris = this.oauthAppDetail.redirectUris;
                this.oauthAppRedirectUrisEdited = this.oauthAppRedirectUris;
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
                query: gql`query Oauth($clientId: String, $name: String, $description: String, $icon: String, $token: String) {
  oauth(token: $token) {
    updateClient(clientId: $clientId, name: $name, description: $description, icon: $icon)
  }
}
`,
                variables: {
                    token: this.user.token,
                    clientId: this.oauthAppDetail.clientId,
                    name: this.oauthAppDetailEdited.name,
                    description: this.oauthAppDetailEdited.description,
                    icon: this.oauthAppDetailEdited.icon,
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
        redirectUrisOnEdit(id, data) {
            this.oauthAppRedirectUrisEdited[id] = data;
        },
        copy(value) {
            const el = document.createElement('textarea');
            el.value = value;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        },
    },
};
</script>
<style lang="scss" scoped></style>
