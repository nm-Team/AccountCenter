<template>
    <h1>{{ $t('manage.pages.index') }}</h1>
    <div class="block specialBlockA">
        <div class="texts">
            <h2 class="title bigger">{{ $t('manage.index.title', { name: user.nick }) }}</h2>
            <p v-html="$t('manage.index.welcome_text')"></p>
        </div>
        <div class="img" style="background-image: url(../../../public/account_main.png)"
            :alt="$t('manage.index.welcome_photo_alt')"></div>
    </div>
    <SafetyChecker :user="user"></SafetyChecker>
    <div class="block">
        <h2 class="title">Debug</h2>
        Here's test user info:<br />
        {{ user }}
    </div>
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
