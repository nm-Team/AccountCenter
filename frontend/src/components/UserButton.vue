<template>
    <button class="user">
        <i :style="{ backgroundImage: `url(${user.avatarURL})` }" :alt="$t('avatar_alt')"></i>
        <div class="info">
            <p class="nick">{{ user.nick }}</p>
            <p class="mail">{{ user.mail }}</p>
        </div>
    </button>
</template>

<script>
export default {
    name: 'UserButton',
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
