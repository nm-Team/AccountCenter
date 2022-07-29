<template>
    <div v-if="regSuccess == undefined">
        <h1>{{ $t("log.ActiveAccount.title") }}</h1>
        <p class="h1then">{{ $t('log.ActiveAccount.tip') }}</p>
    </div>
    <div v-else-if="regSuccess == true">
        <h1>{{ $t("log.ActiveAccount.success_title") }}</h1>
        <p class="h1then">{{ $t('log.ActiveAccount.success_tip') }}</p>
    </div>
    <div v-else>
        <h1>{{ $t("log.ActiveAccount.error_title") }}</h1>
        <p class="h1then">{{ $t('log.ActiveAccount.error_tip') }}</p>
        <p class="h1then">{{ $t('log.ActiveAccount.error_code') }}{{ serviceMsg }}</p>
    </div>
    <div class="related">
        <router-link v-for="item in related" :to="item.path" :key="item.name">{{ $t('log.link.' + item.name) }}
        </router-link>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ActiveAccount',
    data() {
        return {
            related: [
                {
                    name: 'login',
                    path: '/',
                },
            ],
            serviceMsg: '',
            regSuccess: undefined,
        };
    },
    mounted() {
        this.activeAcount();
    },
    methods: {
        activeAcount() {
            if (!this.$route.query.token || this.$route.query.token === '') {
                this.serviceMsg = this.$t('error.email_verify_param_invalid');
                this.regSuccess = false;
                return;
            }

            apolloClient.query({
                query: gql`query User($token: String) {
  User {
    active(token: $token)
  }
}`,
                variables: {
                    token: this.$route.query.token,
                },
            }).then(({ data }) => {
                console.log(data);
                this.regSuccess = true;
            }, (error) => {
                console.log(error);
                this.serviceMsg = this.$t(`error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'unknown_error'}`);
                this.regSuccess = false;
            }).then(() => {
                this.processing = false;
            });
        },
    },
};
</script>
