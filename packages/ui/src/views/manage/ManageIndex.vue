<template>
    <h1>{{ $t('manage.pages.index') }}</h1>
    <div class="block specialBlockA">
        <div class="texts">
            <p class="title bigger">{{ $t('manage.index.title', { name: user.nick }) }}</p>
            <p v-html="$t('manage.index.welcome_text')"></p>
        </div>
        <div class="img" style="background-image: url(/account_main.png)" :alt="$t('manage.index.welcome_photo_alt')">
        </div>
    </div>
    <SafetyChecker :user="user"></SafetyChecker>
</template>
<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ManageMain',
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
    methods: {
    },
    components: {},
};
</script>
