<template>
    <div class="block" v-if="isSudo == undefined">
        <p>{{ $t('loading') }}</p>
    </div>
    <div class="block" v-if="isSudo == false">
        <p class="title">{{ $t("manage.sudo_mode_page.title") }}</p>
        <p>{{ $t('manage.sudo_mode_page.tip') }}</p>
        <form class="form" @submit.prevent="sudoMode()">
            <label-input model="password" type="password" label="log.password" enablescale="false" @getdata="setData">
            </label-input>
            <label-input v-if="user.tfa" model="tfaCode" type="text" label="log.2fa" enablescale="false"
                @getdata="setData">
            </label-input>
            <p v-if="serviceMsg" :class="{ error: isError, serviceMsg }">{{ serviceMsg }}</p>
            <div class="btns">
                <div class="right">
                    <button class="blockButton">
                        {{ $t('manage.sudo_mode_page.submit') }}</button>
                </div>
            </div>
        </form>
    </div>
    <div class="related">
        <router-link v-for="item in related" :to="item.path" :key="item.name">{{ $t('manage.link.' + item.name) }}
        </router-link>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ManageSudoMode',
    data() {
        return {
            related: [
            ],
            isSudo: undefined,
            serviceMsg: '',
            processing: false,
            password: '',
            tfaCode: '',
        };
    },
    props: {
        user: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        apolloClient.query({
            query: gql`query SudoMode($token: String) {
  sudoMode(token: $token) {
    info {
      uuid
      sudo
      pass
      tfa
    }
  }
}`,
            variables: {
                token: this.user.token,
            },
        }).then(({ data }) => {
            console.log(data);
            if (data.sudoMode.info.sudo) {
                this.passSuccess();
                this.isSudo = true;
            } else {
                this.isSudo = false;
            }
        }, (error) => {
            console.log(error);
            this.isSudo = false;
        });
    },
    methods: {
        sudoMode() {
            this.isError = true;
            if (!this.password || this.password === '') {
                this.serviceMsg = this.$t('error.password_empty');
                return;
            }
            if (this.user.tfa && (!this.tfaCode || this.tfaCode === '')) {
                this.serviceMsg = this.$t('error.2fa_empty');
                return;
            }
            this.serviceMsg = '';
            this.isError = false;
            this.processing = true;

            apolloClient.query({
                query: gql`query SudoMode($pass: String, $code: String, $token: String) {
  sudoMode(token: $token) {
    enable(pass: $pass, code: $code)
  }
}`,
                variables: {
                    token: this.user.token,
                    pass: this.password,
                    code: this.tfaCode,
                },
            }).then(({ data }) => {
                console.log(data);
                if (data.sudoMode.enable) {
                    this.isSudo = true;
                    this.passSuccess();
                } else {
                    this.isSudo = false;
                    this.serviceMsg = this.$t('error.unknown_error');
                }
            }, (error) => {
                console.log(error);
                this.serviceMsg = this.$t(`error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'unknown_error'}`);
                this.isError = true;
            }).then(() => {
                this.processing = false;
            });
        },
        setData(name, data) {
            this[name] = data;
        },
        passSuccess() {
            this.$emit('success');
        },
    },
};
</script>
