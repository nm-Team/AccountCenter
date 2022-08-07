<template>
    <div class="block">
        <div style="display: flex; ">
            <div style="flex: 1 1;">
                <p class="title">{{ $t('manage.account_safety_block.stay_safe', { name: user.nick }) }}</p>
                <p v-html="$t('manage.account_safety_block.stay_safe_text')"></p>
                <router-link to="/manage/safety" v-if="!insafetypage">
                    <LinkA :text="$t('manage.account_safety_block.turn_to_safety_page')"></LinkA>
                </router-link>
            </div>
            <div style="width: 130px; height: 110px; flex-shrink: 0; background-image: url(/privacy.png); background-size: 130px; background-position: center; background-repeat: no-repeat;"
                :alt="$t('manage.account_safety_block.stay_safe_img_alt')"></div>
        </div>
        <p v-if="rate"><b>{{ $t('manage.account_safety_block.level.point', { point: this.rate })
                + ' - ' + $t('manage.account_safety_block.level.' + (rate > 79 ? 'high' : (rate > 59 ? 'medium' :
                    'low')))
        }}</b>
        </p>
        <p v-else>{{ $t('manage.account_safety_block.level.undefined') }}</p>
        <p style="margin-top: .5em"><i>{{ $t('manage.account_safety_block.improve') }}</i></p>
        <router-link to="/manage/change-password">
            <LinkA :text="$t('manage.account_safety_block.improve_ways.change_password.title')"></LinkA>
        </router-link>
        <p>{{ $t('manage.account_safety_block.improve_ways.change_password.tip') }}</p>
        <div v-if="user.tfa == false">
            <router-link to="/manage/two-factor-authentication-setup">
                <LinkA :text="$t('manage.account_safety_block.improve_ways.enable_2fa.title')"></LinkA>
            </router-link>
            <p>{{ $t('manage.account_safety_block.improve_ways.enable_2fa.tip') }}</p>
        </div>
        <div v-else>
            <router-link to="/manage/two-factor-authentication-setup">
                <LinkA :text="$t('manage.account_safety_block.improve_ways.enable_2fa.manage')"></LinkA>
            </router-link>
            <p>{{ $t('manage.account_safety_block.improve_ways.enable_2fa.manage_tip') }}</p>
        </div>
                    <router-link to="/manage/authorization">
                <LinkA :text="$t('manage.account_safety_block.improve_ways.manage_authorization.title')"></LinkA>
            </router-link>
            <p>{{ $t('manage.account_safety_block.improve_ways.manage_authorization.tip') }}</p>
    </div>
</template>

<script>

export default {
    name: 'SafetyChecker',
    data() {
        return {
            rate: null,
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
        insafetypage: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        this.countSafetyRate();
    },
    watch: {
        user: {
            handler() {
                this.countSafetyRate();
            },
            deep: true,
        },
    },
    methods: {
        countSafetyRate() {
            if (this.user.tfa) this.rate = 100;
            else this.rate = 60;
        },
    },
};
</script>
