<template>
    <h1>{{ $t('manage.change_avatar.title') }}</h1>
    <p v-if="(changeStep == 0)">{{ $t('manage.change_avatar.tip_0') }}<br />{{ $t('manage.change_avatar.tip_1') }}</p>
    <div class="block" v-if="!avatarEnabled && changeStep == 0">
        <p class="title">{{ $t('manage.change_avatar.type.title') }}</p>
        <div class="typeSelecter">
            <button @click="avatarType = 'gravatar'; setAvatar()">
                <!-- eslint-disable-next-line max-len -->
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M512.000427 0a102.4 102.4 0 0 0-102.4 102.4v358.4c0 56.490667 45.824 102.314667 102.4 102.314667s102.4-45.824 102.4-102.314667V222.293333a307.370667 307.370667 0 0 1 204.757333 289.664 307.2 307.2 0 1 1-524.373333-217.173333 102.4 102.4 0 1 0-144.896-144.896A511.061333 511.061333 0 0 0 0.000427 512c0 282.752 229.248 512 512 512s512-229.248 512-512S794.752427 0 512.000427 0"
                        p-id="1074"></path>
                </svg>
                <div>
                    <b>{{ $t('manage.change_avatar.type.gravatar') }}</b>
                    <p>{{ $t('manage.change_avatar.type.gravatar_description') }}</p>
                </div>
            </button>
            <button @click="changeStep = 1; avatarType = 'upload';">
                <font-awesome-icon :icon="['fas', 'upload']"></font-awesome-icon>
                <div>
                    <b>{{ $t('manage.change_avatar.type.upload') }}</b>
                    <p>{{ $t('manage.change_avatar.type.upload_description') }}</p>
                </div>
            </button>
            <br />
            <a href="https://gravatar.com" onclick="" target="_blank">{{
                    $t('manage.change_avatar.type.gravatar_knowledge')
            }}</a>
        </div>
    </div>
    <div class="block" v-if="changeStep == 1 && avatarType == 'upload'">
        <p class="title">{{ $t('manage.change_avatar.upload.title') }}</p>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="this.changeStep = 0">
                    {{ $t('manage.change_avatar.type.choose_another') }}</button>
            </div>
            <div class="right">
                <button class="blockButton" @click="appCheckCode()">
                    {{ $t('manage.change_avatar.next_step') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="changeStep == 8">
        <p class="title">{{ $t('manage.change_avatar.loading.title') }}</p>
        <p>{{ $t('manage.change_avatar.loading.tip') }}</p>
    </div>
    <div class="block" v-if="changeStep == 9">
        <p class="title">{{ $t('manage.change_avatar.success.title') }}</p>
        <p>{{ $t('manage.change_avatar.success.tip') }}</p>
        <div class="btns">
            <div class="left">
                <button class="blockButton" onclick="window.location.reload()">
                    {{ $t('manage.change_avatar.success.refresh') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="changeStep == 10">
        <p class="title">{{ $t('manage.change_avatar.error.title') }}</p>
        <p>{{ $t('manage.change_avatar.error.tip') }}</p>
        <p>{{ $t('error.' + errorMsg) }}</p>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="changeStep == 0">
                    {{ $t('manage.change_avatar.error.retry') }}</button>
            </div>
        </div>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ManageChangeAvatar',
    data() {
        return {
            changeStep: 0,
            avatarType: '',
            newAvatarCode: '',
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    mounted() {
    },
    methods: {
        setAvatar() {
            switch (this.avatarType) {
                case 'gravatar':
                    this.newAvatarCode = `email:${this.user.email}`;
                    break;
                default:
                    return window.alert(this.$t('manage.change_avatar.type.unknown'));
            }
            return this.sendRequest();
        },
        sendRequest() {
            this.changeStep = 8;
            apolloClient.query({
                query: gql`query User($avatar: String, $token: String) {
  User(token: $token) {
    changeAvatar(avatar: $avatar)
  }
}`,
                variables: {
                    token: this.user.token,
                    avatar: this.newAvatarCode,
                },
            }).then(({ data }) => {
                console.log(data);
                this.changeStep = 9;
            }, (error) => {
                console.log(error);
                this.changeStep = 10;
                this.errorMsg = this.$t(`error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'unknown_error'}`);
            });
        },
        setData(name, data) {
            this[name] = data;
        },
    },
    components: {},
};
</script>
