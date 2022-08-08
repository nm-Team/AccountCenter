<!-- eslint-disable max-len -->
<template>
    <h1>{{ $t('manage.change_avatar.title') }}</h1>
    <p v-if="(changeStep == 0)">{{ $t('manage.change_avatar.tip_0') }}<br />{{ $t('manage.change_avatar.tip_1') }}</p>
    <div class="block" v-if="!avatarEnabled && changeStep == 0">
        <p class="title">{{ $t('manage.change_avatar.type.title') }}</p>
        <div class="typeSelecterA">
            <button class="type" @click="avatarType = 'gravatar'; changeStep = 1; ">
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
            <button class="type" @click="avatarType = 'qq'; changeStep = 1; ">
                <svg style="transform: scale(1.2)" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"
                        p-id="3700"></path>
                </svg>
                <div>
                    <b>{{ $t('manage.change_avatar.type.qq') }}</b>
                    <p>{{ $t('manage.change_avatar.type.qq_description') }}</p>
                </div>
            </button>
            <button class="type" @click="avatarType = 'github'; changeStep = 1; ">
                <svg style="transform: scale(1.1)" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M960 512c0 97.76-28.704 185.216-85.664 263.264-56.96 78.016-130.496 131.84-220.64 161.856-10.304 1.824-18.368 0.448-22.848-4.032a22.4 22.4 0 0 1-7.2-17.504v-122.88c0-37.632-10.304-65.44-30.464-82.912a409.856 409.856 0 0 0 59.616-10.368 222.752 222.752 0 0 0 54.72-22.816c18.848-10.784 34.528-23.36 47.104-38.592 12.544-15.232 22.848-35.904 30.912-61.44 8.096-25.568 12.128-54.688 12.128-87.904 0-47.072-15.232-86.976-46.208-120.16 14.368-35.456 13.024-74.912-4.48-118.848-10.752-3.616-26.432-1.344-47.072 6.272s-38.56 16.16-53.824 25.568l-21.984 13.888c-36.32-10.304-73.536-15.232-112.096-15.232s-75.776 4.928-112.096 15.232a444.48 444.48 0 0 0-24.672-15.68c-10.336-6.272-26.464-13.888-48.896-22.432-21.952-8.96-39.008-11.232-50.24-8.064-17.024 43.936-18.368 83.424-4.032 118.848-30.496 33.632-46.176 73.536-46.176 120.608 0 33.216 4.032 62.336 12.128 87.456 8.032 25.12 18.368 45.76 30.496 61.44 12.544 15.68 28.224 28.704 47.072 39.04 18.848 10.304 37.216 17.92 54.72 22.816a409.6 409.6 0 0 0 59.648 10.368c-15.712 13.856-25.12 34.048-28.704 60.064a99.744 99.744 0 0 1-26.464 8.512 178.208 178.208 0 0 1-33.184 2.688c-13.024 0-25.568-4.032-38.144-12.544-12.544-8.512-23.296-20.64-32.256-36.32a97.472 97.472 0 0 0-28.256-30.496c-11.232-8.064-21.088-12.576-28.704-13.92l-11.648-1.792c-8.096 0-13.92 0.928-17.056 2.688-3.136 1.792-4.032 4.032-2.688 6.72s3.136 5.408 5.376 8.096 4.928 4.928 7.616 7.168l4.032 2.688c8.544 4.032 17.056 11.232 25.568 21.984 8.544 10.752 14.368 20.64 18.4 29.6l5.824 13.44c4.928 14.816 13.44 26.912 25.568 35.872 12.096 8.992 25.088 14.816 39.008 17.504 13.888 2.688 27.36 4.032 40.352 4.032s23.776-0.448 32.288-2.24l13.472-2.24c0 14.784 0 32.288 0.416 52.032 0 19.744 0.48 30.496 0.48 31.392a22.624 22.624 0 0 1-7.648 17.472c-4.928 4.48-12.992 5.824-23.296 4.032-90.144-30.048-163.68-83.84-220.64-161.888C92.256 697.216 64 609.312 64 512c0-81.152 20.192-156.064 60.096-224.672s94.176-122.88 163.232-163.232C355.936 84.192 430.816 64 512 64s156.064 20.192 224.672 60.096 122.88 94.176 163.232 163.232C939.808 355.488 960 430.848 960 512">
                    </path>
                </svg>
                <div>
                    <b>{{ $t('manage.change_avatar.type.github') }}</b>
                    <p>{{ $t('manage.change_avatar.type.github_description') }}</p>
                </div>
            </button>
            <button class="type" @click="avatarType = 'upload'; changeStep = 1; ">
                <font-awesome-icon :icon="['fas', 'upload']"></font-awesome-icon>
                <div>
                    <b>{{ $t('manage.change_avatar.type.upload') }}</b>
                    <p>{{ $t('manage.change_avatar.type.upload_description') }}</p>
                </div>
            </button>
            <button class="type" @click="avatarType = 'default'; setAvatar(); ">
                <font-awesome-icon :icon="['fas', 'ban']"></font-awesome-icon>
                <div>
                    <b>{{ $t('manage.change_avatar.type.default') }}</b>
                    <p>{{ $t('manage.change_avatar.type.default_description') }}</p>
                </div>
            </button>
            <br />
            <p><a href="https://gravatar.com" onclick="" target="_blank">{{
                    $t('manage.change_avatar.type.gravatar_knowledge')
            }}</a></p>

            <p>{{ $t('manage.change_avatar.public_warning') }}</p>
            <p>{{ $t('manage.change_avatar.legal_warning') }} <a href="javascript:" @click="showLegal = true">{{
                    $t('manage.change_avatar.legal_more')
            }}</a></p>
        </div>
    </div>
    <div class="block" v-if="changeStep == 1 && avatarType == 'gravatar'">
        <p class="title">{{ $t('manage.change_avatar.gravatar.title') }}</p>
        <div class="typeSelecterA">
            <label class="type">
                <input type="radio" v-model="gravatarType" name="gType" value="default" />
                <font-awesome-icon :icon="['fas', 'user']"></font-awesome-icon>
                <div>
                    <b>{{ $t('manage.change_avatar.gravatar.use_my_email') }}</b>
                    <p>{{ $t('manage.change_avatar.gravatar.use_my_email_description', { email: user.mail }) }}</p>
                </div>
            </label>
            <label class="type">
                <input type="radio" v-model="gravatarType" name="gType" value="custom" />
                <font-awesome-icon :icon="['fas', 'at']"></font-awesome-icon>
                <div>
                    <b>{{ $t('manage.change_avatar.gravatar.use_another_email') }}</b>
                    <p>{{ $t('manage.change_avatar.gravatar.use_another_email_description') }}</p>
                    <label-input type="text" model="customValue" :readonly="gravatarType == 'custom' ? false : true"
                        :label="$t('manage.change_avatar.gravatar.custom_placeholder')" @getdata="setData">
                    </label-input>
                </div>
            </label>
        </div>
        <p>{{ avatarError }}</p>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="this.changeStep = 0">
                    {{ $t('manage.change_avatar.type.choose_another') }}</button>
            </div>
            <div class="right">
                <button class="blockButton" @click="setAvatar()">
                    {{ $t('next_step') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="changeStep == 1 && avatarType == 'qq'">
        <p class="title">{{ $t('manage.change_avatar.qq.title') }}</p>
        <label-input type="text" model="customValue" :label="$t('manage.change_avatar.qq.custom_placeholder')"
            @getdata="setData">
        </label-input>
        <p>{{ avatarError }}</p>
        <p>{{ $t('manage.change_avatar.qq.your_qq_might_be_visible') }}</p>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="this.changeStep = 0">
                    {{ $t('manage.change_avatar.type.choose_another') }}</button>
            </div>
            <div class="right">
                <button class="blockButton" @click="setAvatar()">
                    {{ $t('next_step') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="changeStep == 1 && avatarType == 'github'">
        <p class="title">{{ $t('manage.change_avatar.github.title') }}</p>
        <label-input type="text" model="customValue" :label="$t('manage.change_avatar.github.custom_placeholder')"
            @getdata="setData">
        </label-input>
        <p>{{ avatarError }}</p>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="this.changeStep = 0">
                    {{ $t('manage.change_avatar.type.choose_another') }}</button>
            </div>
            <div class="right">
                <button class="blockButton" @click="setAvatar()">
                    {{ $t('next_step') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="changeStep == 1 && avatarType == 'github'">
        <img src="/how_to_get_gthub_username.png" :alt="$t('manage.change_avatar.github.help_alt')"
            style="border-radius: 4px">
    </div>
    <div class="block" v-if="changeStep == 1 && avatarType == 'upload'">
        <p class="title">{{ $t('manage.change_avatar.upload.title') }}</p>
        <input type="file" :model="uploadAvatarOrigin" @change="goCut()" />
        <div class="btns">
            <button class="blockButton" @click="0">
                {{ $t('manage.change_avatar.upload.upload_button') }}</button>
        </div>
        <vueCropper ref="cropper" :img="uploadAvatarOrigin" :outputSize="1" :outputType="png">
        </vueCropper>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="this.changeStep = 0">
                    {{ $t('manage.change_avatar.type.choose_another') }}</button>
            </div>
            <div class="right">
                <button class="blockButton" @click="0">
                    {{ $t('next_step') }}</button>
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
        <p>{{ errorMsg }}</p>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="changeStep = 0">
                    {{ $t('manage.change_avatar.error.retry') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="showLegal">
        <p class="title">{{ $t('manage.change_avatar.legal.title') }}</p>
        <li>{{ $t('manage.change_avatar.legal.no_illegal') }}</li>
        <li>{{ $t('manage.change_avatar.legal.no_discriminate') }}</li>
        <li>{{ $t('manage.change_avatar.legal.no_porn') }}</li>
        <li>{{ $t('manage.change_avatar.legal.no_politics') }}</li>
        <li>{{ $t('manage.change_avatar.legal.no_other') }}</li>
        <p>{{ $t('manage.change_avatar.legal.our_action') }}</p>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';
import md5 from 'js-md5';

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
            gravatarType: 'default',
            showLegal: false,
            customValue: '',
            avatarError: '',
            uploadAvatarOrigin: '',
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
    methods: {
        setAvatar() {
            switch (this.avatarType) {
                case 'gravatar':
                    // eslint-disable-next-line no-case-declarations, prefer-regex-literals
                    const emailArg = new RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/);
                    if (this.gravatarType === 'default') {
                        this.newAvatarCode = `mail:${md5(this.user.mail)}`;
                    } else if (this.customValue === '' || this.customValue == null || !emailArg.test(this.customValue)) {
                        this.avatarError = this.$t('manage.change_avatar.gravatar.error_email');
                        return;
                    } else {
                        this.newAvatarCode = `mail:${md5(this.customValue)}`;
                    }
                    break;
                case 'qq':
                    // eslint-disable-next-line no-restricted-globals
                    if (this.customValue === '' || this.customValue == null || isNaN(this.customValue)) {
                        this.avatarError = this.$t('manage.change_avatar.qq.error_invalid');
                        return;
                    }
                    this.newAvatarCode = `qq:${this.customValue}`;
                    break;
                case 'github':
                    // eslint-disable-next-line no-restricted-globals
                    if (this.customValue === '' || this.customValue == null) {
                        this.avatarError = this.$t('manage.change_avatar.github.error_invalid');
                        return;
                    }
                    this.newAvatarCode = `github:${this.customValue}`;
                    break;
                case 'default':
                    this.newAvatarCode = 'mail:00000000000000000000000000000000';
                    break;
                default:
                    window.this.defaultSwal.fire(this.$t('manage.change_avatar.type.unknown'));
            }
            this.sendRequest();
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
                this.$emit('updateuser', this.user);
            }, (error) => {
                console.log(error);
                this.changeStep = 10;
                this.errorMsg = this.$t(`error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'network_error'}`);
            });
        },
        setData(name, data) {
            this[name] = data;
        },
    },
    components: {},
};
</script>
