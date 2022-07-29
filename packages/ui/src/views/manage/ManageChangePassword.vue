<template>
    <h1>{{ $t('manage.change_password.title') }}</h1>
    <!-- <sudo-mode :user="user" @success="sudoSuccess = true"></sudo-mode> -->
    <div class="block" v-if="!changeSuccess">
        <p
            v-html="$t('manage.change_password.forget', { reset: `<a href='/#/forget-password'>${$t('manage.change_password.reset')}</a>` })">
        </p>
        <label-input v-for="item in form" :key="item.id" :model="item.id" :type="item.type" :label="item.label"
            :autofocus="item.autofocus" @getdata="setData">
        </label-input>
        <p>{{ this.serviceMsg }}</p>
        <div class="btns">
            <div class="right">
                <button class="blockButton" @click="this.changePassword()">
                    {{ $t('manage.change_password.submit') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="!changeSuccess">
        <p class="title">{{ $t('manage.change_password.tip.title') }}</p>
        <li v-for="n in 6" :key="n">{{ $t('manage.change_password.tip.t' + (n - 1)) }}</li>
    </div>
    <div class="block" v-if="changeSuccess">
        <p>{{ $t('manage.change_password.success') }}</p>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ManageChangePassword',
    data() {
        return {
            sudoSuccess: false,
            changeSuccess: false,
            form: [
                { id: 'oldpassword', type: 'password', label: 'manage.change_password.old_password' },
                { id: 'password', type: 'password', label: 'manage.change_password.new_password' },
                { id: 'confirmpassword', type: 'password', label: 'manage.change_password.confirm_password' },
            ],
            oldpassword: '',
            password: '',
            confirmpassword: '',
            serviceMsg: '',
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    methods: {
        changePassword() {
            if (!this.oldpassword || this.oldpassword === '') {
                this.serviceMsg = this.$t('error.password_empty');
                return;
            }
            if (!this.password || this.password === '') {
                this.serviceMsg = this.$t('error.password_empty');
                return;
            }
            if (!this.confirmpassword || this.confirmpassword === '') {
                this.serviceMsg = this.$t('error.confirm_password_empty');
                return;
            }
            if (this.password !== this.confirmpassword) {
                this.serviceMsg = this.$t('error.password_not_match');
                return;
            }
            this.serviceMsg = '';
            apolloClient.query({
                query: gql`query User($token: String, $oldPass: String, $newPass: String) {
  User(token: $token) {
    changePass(oldPass: $oldPass, newPass: $newPass)
  }
}`,
                variables: {
                    token: this.user.token,
                    oldPass: this.oldpassword,
                    newPass: this.password,
                },
            }).then(({ data }) => {
                console.log(data);
                if (data.User.changePass) {
                    this.changeSuccess = true;
                } else {
                    this.serviceMsg = this.$t('error.unknown_error');
                }
            }, (error) => {
                console.log(error);
                this.serviceMsg = this.$t(`error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'unknown_error'}`);
            });
        },
        setData(name, data) {
            this[name] = data;
        },
    },
    components: {},
};
</script>
