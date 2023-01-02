<template>
    <button class="roundedUser">
        <i :style="{ backgroundImage: `url(${user.avatarURL})` }" :alt="$t('avatar_alt')"></i>
        <p class="nick">{{ user.nick }}</p>
        <font-awesome-icon class="switchIcon" :icon="['fas', 'chevron-down']" v-if="showswitch" />
    </button>
</template>

<script>
export default {
    name: 'RoundedUser',
    data() {
        return {
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
        showswitch: {
            type: Boolean,
            default: false,
        },
    },
    inject: ['defaultSwal'],
    mounted() {
    },
    methods: {
    },
};
</script>
<style lang="scss" scoped>
* {
    --user-background-color: #ffffff00;
    --user-border-color: #c0c0c0;
    --user-text-color: #000;
    --user-switcher-color: #747474;
}

@media (prefers-color-scheme: dark) {
    * {
        --user-background-color: #00000000;
        --user-border-color: #6f6f6f;
        --user-text-color: #ffffff;
        --user-switcher-color: #9c9c9c;
    }
}

.roundedUser {
    display: flex;
    align-items: center;
    background-color: var(--user-background-color);
    border-radius: 50px;
    margin: 10px auto;
    padding: 0;
    max-width: 100%;
    height: 31.5px;
    border: 1px solid var(--user-border-color);
    cursor: pointer;

    i {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        flex-shrink: 0;
    }

    .nick {
        margin-left: 5px;
        margin-right: 10px;
        font-size: 15px;
        font-weight: bold;
        color: var(--user-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .switchIcon {
        margin-left: -4px;
        margin-right: 5px;
        font-size: 15px;
        fill: var(--user-switcher-color);
        flex-shrink: 0;
    }
}
</style>
