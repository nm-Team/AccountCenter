<template>
    <div class="block specialBlockA">
        <div class="texts">
            <h2 class="title bigger">{{ $t('manage.account_safety_block.stay_safe', { name: user.nick }) }}</h2>
            <p v-html="$t('manage.account_safety_block.stay_safe_text')"></p>
        </div>
        <div class="img" style="background-image: url(../../public/privacy.png)" :alt="$t('manage.account_safety_block.stay_safe_img_alt')"></div>
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
