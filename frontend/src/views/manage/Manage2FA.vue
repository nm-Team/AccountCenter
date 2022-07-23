<template>
    <h1>{{ $t('manage.setup_2fa.title') }}</h1>
    <p>{{ $t('manage.setup_2fa.tip_a') }}</p>
    <p>{{ $t('manage.setup_2fa.tip_b') }}</p>
    <div class="block" v-if="!tfaEnabled && inStep == 0">
        <p class="title">{{ $t('manage.setup_2fa.setup.title') }}</p>
        <div class="tfaSelector">
            <button @click="inStep = 1; vType = 'app'; getAppSecure();">
                <font-awesome-icon :icon="['fas', 'mobile-screen-button']"></font-awesome-icon>
                <div>
                    <b>{{ $t('manage.setup_2fa.setup.using_app_title') }}</b>
                    <p>{{ $t('manage.setup_2fa.setup.using_app') }}</p>
                </div>
            </button>
        </div>
    </div>
    <div class="block" v-if="!tfaEnabled && inStep == 1 && vType == 'app'">
        <p class="title">{{ $t('manage.setup_2fa.setup.app.title') }}</p>
        <p><b>{{ $t('manage.setup_2fa.setup.app.scan_qrcode_title') }}</b></p>
        <p>{{ $t('manage.setup_2fa.setup.app.scan_qrcode', {
                secure: appSecure !== '' ? appSecure : this.$t('loading')
            })
        }}
        </p>
        <vue-qr class="tfaQrCode" :text="appQr" :size="600"></vue-qr>
        <p><b>{{ $t('manage.setup_2fa.setup.app.enter_code_title') }}</b></p>
        <p>{{ $t('manage.setup_2fa.setup.app.enter_code') }}</p>
        <label-input model="appUserCode" type="text" :label="$t('manage.setup_2fa.setup.app.enter_code_placeholder')"
            @getdata="setData"></label-input>
        <div class="btns">
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
            @getdata="setData"></label-input>
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
            tfaEnabled: false,
            inStep: 0,
            disableStep: 0,
            vType: '',
            appSecure: '',
            appUserCode: 0,
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
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
                alert(this.$t('manage.setup_2fa.setup.app.get_code_error'));
            });
        },
        appCheckCode() {
            if (Number.isNaN(this.appUserCode) || this.appUserCode.toString().length !== 6) {
                alert(this.$t('manage.setup_2fa.setup.app.code_format_error'));
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
                    this.inStep = 0;
                }, (error) => {
                    console.log(error);
                    alert(this.$t('manage.setup_2fa.setup.app.set_error'));
                    this.inStep = 0;
                });
            }
        },
        disable2FA() {
            if (Number.isNaN(this.appUserCode) || this.appUserCode.toString().length !== 6) {
                alert(this.$t('manage.setup_2fa.setup.app.code_format_error'));
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
                    this.tfaEnabled = false;
                    this.inStep = 0;
                }, (error) => {
                    console.log(error);
                    alert(this.$t('manage.setup_2fa.setup.app.set_error'));
                    this.inStep = 0;
                    this.disableStep = 0;
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
