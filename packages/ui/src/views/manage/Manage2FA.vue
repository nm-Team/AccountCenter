<template>
    <h1>{{ $t('manage.setup_2fa.title') }}</h1>
    <p v-if="(tfaEnabled == false && enableStep == 0) || (tfaEnabled && disableStep == 0)">{{
            $t('manage.setup_2fa.tip_a')
    }}
    </p>
    <p v-if="(tfaEnabled == false && enableStep == 0) || (tfaEnabled && disableStep == 0)">{{
            $t('manage.setup_2fa.tip_b')
    }}
    </p>
    <div class="block" v-if="tfaEnabled == false && enableStep == 0">
        <p class="title">{{ $t('manage.setup_2fa.setup.title') }}</p>
        <div class="typeSelecterA">
            <button class="type" @click="enableStep = 1; vType = 'app'; getAppSecure();">
                <font-awesome-icon :icon="['fas', 'mobile-screen-button']"></font-awesome-icon>
                <div>
                    <b>{{ $t('manage.setup_2fa.setup.using_app_title') }}</b>
                    <p>{{ $t('manage.setup_2fa.setup.using_app') }}</p>
                </div>
            </button>
        </div>
    </div>
    <div class="block" v-if="tfaEnabled == false && enableStep == 1 && vType == 'app'">
        <p class="title">{{ $t('manage.setup_2fa.setup.app.title') }}</p>
        <p><b>{{ $t('manage.setup_2fa.setup.app.scan_qrcode_title') }}</b></p>
        <p>{{ $t('manage.setup_2fa.setup.app.scan_qrcode') }}
        </p>
        <label-input type="text" :label="$t('manage.setup_2fa.setup.app.secret_box_placeholder')"
            :value="appSecure !== '' ? appSecure : this.$t('loading')" :readonly="true"></label-input>
        <vue-qr class="tfaQrCode" v-if="appQr != ''" :text="appQr" :size="600"></vue-qr>
        <p><b>{{ $t('manage.setup_2fa.setup.app.enter_code_title') }}</b></p>
        <p>{{ $t('manage.setup_2fa.setup.app.enter_code') }}</p>
        <p>{{ $t('manage.setup_2fa.setup.app.code_not_expire') }}</p>
        <label-input model="appUserCode" type="text" :label="$t('manage.setup_2fa.setup.app.enter_code_placeholder')"
            @getdata="setData" @keyup.enter="appCheckCode()" :value="appUserCode"></label-input>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="this.enableStep = 0">
                    {{ $t('cancel') }}</button>
            </div>
            <div class="right">
                <button class="blockButton" @click="appCheckCode()">
                    {{ $t('manage.setup_2fa.next_step') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="tfaEnabled && disableStep == 0">
        <p class="title">{{ $t('manage.setup_2fa.enabled.title') }}</p>
        <p>{{ $t('manage.setup_2fa.enabled.tip') }}</p>
        <div class="btns">
            <div class="right">
                <button class="blockButton" @click="this.disableStep = 1">
                    {{ $t('manage.setup_2fa.enabled.disable') }}</button>
            </div>
        </div>
    </div>
    <div class="block" v-if="tfaEnabled && disableStep == 1">
        <p class="title">{{ $t('manage.setup_2fa.disable.title') }}</p>
        <p>{{ $t('manage.setup_2fa.disable.tip') }}</p>
        <label-input model="appUserCode" type="text" :label="$t('manage.setup_2fa.setup.app.enter_code_placeholder')"
            @getdata="setData" :value="appUserCode" @keyup.enter="disable2FA()"></label-input>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="this.disableStep = 0">
                    {{ $t('cancel') }}</button>
            </div>
            <div class="right">
                <button class="blockButton" @click="disable2FA()">
                    {{ $t('manage.setup_2fa.disable.submit') }}</button>
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
    name: 'Manage2FA',
    data() {
        return {
            tfaEnabled: undefined,
            enableStep: 0,
            disableStep: 0,
            vType: '',
            appSecure: '',
            appUserCode: '',
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    inject: ['defaultSwal'],
    watch: {
        user: {
            handler() {
                if (this.user.tfa) {
                    this.tfaEnabled = true;
                } else {
                    this.tfaEnabled = false;
                }
            },
            deep: true,
        },
    },
    mounted() {
        if (this.user.tfa) {
            this.tfaEnabled = true;
        } else {
            this.tfaEnabled = false;
        }
    },
    methods: {
        getAppSecure() {
            apolloClient.query({
                query: gql`query TwoFactorAuth($token: String) {
  twoFactorAuth(token: $token) {
    generate
  }
}`,
                variables: {
                    token: this.user.token,
                },
            }).then(({ data }) => {
                console.log(data);
                this.appQr = data.twoFactorAuth.generate;
                // eslint-disable-next-line prefer-destructuring
                this.appSecure = data.twoFactorAuth.generate.split('?secret=')[1].split('&')[0];
            }, (error) => {
                console.log(error);
                this.defaultSwal.fire(this.$t('manage.setup_2fa.setup.app.get_code_error'));
            });
        },
        appCheckCode() {
            if (Number.isNaN(this.appUserCode) || this.appUserCode.toString().length !== 6) {
                this.defaultSwal.fire(this.$t('manage.setup_2fa.setup.app.code_format_error'));
            } else {
                apolloClient.query({
                    query: gql`query TwoFactorAuth($secret: String, $code: String, $token: String) {
  twoFactorAuth(token: $token) {
    enable(secret: $secret, code: $code)
  }
}`,
                    variables: {
                        token: this.user.token,
                        secret: this.appSecure,
                        code: this.appUserCode,
                    },
                }).then(({ data }) => {
                    console.log(data);
                    this.tfaEnabled = true;
                    this.user.tfa = true;
                    this.enableStep = 0;
                    this.$emit('updateuser', this.user);
                }, (error) => {
                    console.log(error);
                    this.defaultSwal.fire(this.$t('manage.setup_2fa.setup.app.set_error'));
                    this.appUserCode = '';
                });
            }
        },
        disable2FA() {
            if (Number.isNaN(this.appUserCode) || this.appUserCode.toString().length !== 6) {
                this.defaultSwal.fire(this.$t('manage.setup_2fa.setup.app.code_format_error'));
            } else {
                apolloClient.query({
                    query: gql`query TwoFactorAuth($token: String, $code: String) {
  twoFactorAuth(token: $token) {
    disable(code: $code)
  }
}`,
                    variables: {
                        token: this.user.token,
                        code: this.appUserCode,
                    },
                }).then(({ data }) => {
                    console.log(data);
                    this.user.tfa = false;
                    this.tfaEnabled = false;
                    this.$emit('updateuser', this.user);
                    this.enableStep = 0;
                    window.location.reload(); // user info will be reload after page refresh. Maybe hot reload in the future.
                }, (error) => {
                    console.log(error);
                    this.defaultSwal.fire(this.$t('manage.setup_2fa.setup.app.set_error'));
                    this.appUserCode = '';
                });
            }
        },
        setData(name, data) {
            this[name] = data;
        },
    },
    components: {},
};
</script>
<style lang="scss" scoped>
.tfaQrCode {
    width: 200px;
    border: 1px solid var(--block-border);
    margin: 1px 0 15px 0;
    padding: 2px;
    background: #fff;
    border-radius: 5px;
}
</style>
