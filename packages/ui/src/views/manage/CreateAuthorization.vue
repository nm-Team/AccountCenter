<template>
    <h1>{{ $t('manage.create_oauth_app.title') }}</h1>
    <p>{{ $t('manage.create_oauth_app.page_description') }}</p>
    <div class="block">
        <label-input v-for="item in form" :key="item.id" :model="item.id" :type="item.type" :label="item.label"
            :autofocus="item.autofocus" @getdata="setData">
        </label-input>
        <p>{{ this.serviceMsg }}</p>
        <div class="btns">
            <div class="right">
                <button class="blockButton" @click="this.createOauthApp()">
                    {{ $t('manage.create_oauth_app.submit') }}</button>
            </div>
        </div>
    </div>
    <div class="block">
        <p class="title">{{ $t('manage.create_oauth_app.terms.title') }}</p>
        <p>{{ $t('manage.authorization.create_oauth_app.terms.content') }}</p>
    </div>
</template>

<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    name: 'CreateAuthorization',
    data() {
        return {
            form: [
                { id: 'name', type: 'text', label: 'manage.oauth_app.name' },
                { id: 'description', type: 'text', label: 'manage.oauth_app.description' },
                { id: 'redirectUri', type: 'text', label: 'manage.oauth_app.redirect_uri' },
            ],
            name: '',
            description: '',
            redirectUri: '',
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
    },
    watch: {
        user: {
            handler() {
            },
            deep: true,
        },
    },
    methods: {
        createOauthApp() {
            if (this.name === '') {
                this.serviceMsg = this.$t('manage.create_oauth_app.error_name_empty');
                return;
            }
            if (this.redirectUri === '') {
                this.serviceMsg = this.$t('manage.create_oauth_app.error_redirect_uri_invalid');
                return;
            }
            apolloClient.query({
                query: gql`query CreateClient($redirectUri: String, $name: String, $token: String, $description: String) {
  oauth(token: $token) {
    createClient(redirectUri: $redirectUri, name: $name, description: $description) {
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
                    name: this.name,
                    redirectUri: this.redirectUri,
                    description: this.description,
                },
            }).then(({ data }) => {
                console.log(data);
                this.defaultSwal.fire({
                    title: this.$t('manage.create_oauth_app.success.title'),
                    text: this.$t('manage.create_oauth_app.success.content', {
                        clientId: data.oauth.createClient.clientId,
                        clientSecret: data.oauth.createClient.clientSecret,
                    }),
                    icon: 'success',
                }).then(() => {
                    this.$router.push({ name: 'manage_authorization' });
                });
            }, (error) => {
                console.log(error);
                this.serviceMsg = this.$t('manage.create_oauth_app.error_unknown');
            });
        },
        setData(name, data) {
            this[name] = data;
        },
    },
};
</script>
<style lang="scss" scoped></style>
