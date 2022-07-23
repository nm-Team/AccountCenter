<template>
    <h1>{{ $t('manage.setup_2fa.title') }}</h1>
    <p>{{ $t('manage.setup_2fa.tip_a') }}</p>
    <p>{{ $t('manage.setup_2fa.tip_b') }}</p>
    <div class="block">
    </div>
</template>
<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Manage2FA',
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
