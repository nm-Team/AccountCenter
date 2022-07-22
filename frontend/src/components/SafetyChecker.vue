<template>
    <div class="block">
        <div style="display: flex; ">
            <div style="flex: 1 1;">
                <h2 class="title">{{ $t('manage.account_safety_block.stay_safe', { name: user.nick }) }}</h2>
                <p v-html="$t('manage.account_safety_block.stay_safe_text')"></p>
            </div>
            <div style="width: 130px; height: 110px; flex-shrink: 0; background-image: url(../../public/privacy.png); background-size: 130px; background-position: center; background-repeat: no-repeat;"
                :alt="$t('manage.account_safety_block.stay_safe_img_alt')"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SafetyChecker',
    data() {
        return {
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
    },
};
</script>
