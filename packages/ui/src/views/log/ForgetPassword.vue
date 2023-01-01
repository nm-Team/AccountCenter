<template>
    <div v-if="step == 0">
        <h1>{{ $t("log.forget_password_page.step0.title") }}</h1>
        <p class="h1then">{{ $t('log.forget_password_page.step0.tip') }}</p>
        <form class="form" @submit.prevent="submit">
            <label-input v-for="item in form" :key="item.id" :model="item.id" :type="item.type" :label="item.label"
                :autofocus="item.autofocus" @getdata="setData">
            </label-input>
            <p v-if="serviceMsg" :class="{ error: isError, serviceMsg }">{{ serviceMsg }}</p>
            <button>{{ $t("log.forget_password_page.nextstep") }}</button>
        </form>
    </div>
    <div v-if="step == 1">
        <h1>{{ $t("log.forget_password_page.step1.title") }}</h1>
        <p class="h1then">{{ $t('log.forget_password_page.step1.tip') }}</p>
    </div>
    <div class="related">
        <router-link v-for="item in related" :to="{ path: item.path, query: $route.query }" :key="item.name">{{ $t('log.link.' + item.name) }}
        </router-link>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    name: 'ForgetPassword',
    data() {
        return {
            form: [
                { id: 'username', type: 'text', label: 'log.username' },
                {
                    id: 'email', type: 'text', label: 'log.email', autofocus: true,
                },
            ],
            step: 0,
            related: [
                {
                    name: 'login',
                    path: '/',
                },
                {
                    name: 'register',
                    path: '/register',
                },
                {
                    name: 'support',
                    path: '/support',
                },
            ],
            serviceMsg: '',
            processing: false,
        };
    },
    methods: {
        submit() {
            this.isError = true;
            if (!this.username || this.username === '') {
                this.serviceMsg = this.$t('error.username_empty');
                return;
            }
            if (!this.email || this.email === '') {
                this.serviceMsg = this.$t('error.email_empty');
                return;
            }
            this.serviceMsg = '';
            this.isError = false;
            this.processing = true;

            apolloClient.query({
                query: gql`query User($user: String, $mail: String, $language: String) {
  User {
    resetPassQuery(user: $user, mail: $mail, language: $language)
  }
}`,
                variables: {
                    user: this.username,
                    mail: this.email,
                    language: this.$i18n.locale,
                },
            }).then(({ data }) => {
                console.log(data);
                this.step = 1;
            }, (error) => {
                console.log(error);
                this.serviceMsg = this.$t(`error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'network_error'}`);
                this.isError = true;
            }).then(() => {
                this.processing = false;
            });
        },
        setData(name, data) {
            this[name] = data;
        },
    },
};
</script>
