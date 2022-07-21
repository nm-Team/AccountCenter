<template>
    <h1>{{ $t('manage.pages.index') }}</h1>
    <div class="block indexWelcomeBlock">
        <div class="texts">
            <h2 class="title">{{ $t('manage.index.title', { name: user.nick }) }}</h2>
            <p v-html="$t('manage.index.welcome_text')"></p>
        </div>
        <div class="img" :alt="$t('manage.index.welcome_photo_alt')"></div>
    </div>
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
