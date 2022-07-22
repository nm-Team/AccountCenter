<template>
    <div class="block">
        <div style="display: flex; ">
            <div style="flex: 1 1;">
                <h2 class="title">{{ $t('manage.account_safety_block.stay_safe', { name: user.nick }) }}</h2>
                <p v-html="$t('manage.account_safety_block.stay_safe_text')"></p>
                <router-link to="/manage/safety" v-if="!insafetypage">
                    <LinkA :text="$t('manage.account_safety_block.turn_to_safety_page')"></LinkA>
                </router-link>
            </div>
            <div style="width: 130px; height: 110px; flex-shrink: 0; background-image: url(../../public/privacy.png); background-size: 130px; background-position: center; background-repeat: no-repeat;"
                :alt="$t('manage.account_safety_block.stay_safe_img_alt')"></div>
        </div>
        <p><b>{{ $t('manage.account_safety_block.level.point', { point: this.rate })
                + ' - ' + $t('manage.account_safety_block.level.' + (rate > 79 ? 'high' : (rate > 59 ? 'medium' :
                    'low')))
        }}</b>
        </p>
        <p style="margin-top: .5em"><i>{{ $t('manage.account_safety_block.improve') }}</i></p>
        <router-link to="/manage/change-password">
            <LinkA :text="$t('manage.account_safety_block.improve_ways.change_password.title')"></LinkA>
        </router-link>
        <p>{{ $t('manage.account_safety_block.improve_ways.change_password.tip') }}</p>
        <router-link to="/manage/two-factor-authentication-setup">
            <LinkA :text="$t('manage.account_safety_block.improve_ways.enable_2fa.title')"></LinkA>
        </router-link>
        <p>{{ $t('manage.account_safety_block.improve_ways.enable_2fa.tip') }}</p>
    </div>
</template>

<script>

export default {
    name: 'SafetyChecker',
    data() {
        return {
            rate: 60,
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
    },
    methods: {
    },
};
</script>
