<template>
    <h1>{{ $t("log.get_support_page.title") }}</h1>
    <p class="h1then">{{ $t('log.get_support_page.tip.0') }}</p>
    <p class="h1then">{{ $t('log.get_support_page.tip.1') }}</p>
    <form class="form">
        <button onclick="window.open('https://nmteam.xyz/support/?ref=nmTeamAccount')">{{
                $t("log.get_support_page.button")
        }}</button>
    </form>
    <div class="related">
        <router-link v-for="item in related" :to="item.path" :key="item.name">{{ $t('log.link.' + item.name) }}
        </router-link>
    </div>
</template>
<script>
export default {
    name: 'GetSupport',
    data() {
        return {
            related: [
                {
                    name: 'login',
                    path: '/',
                },
                {
                    name: 'register',
                    path: '/register',
                },
                {
                    name: 'forget_password',
                    path: '/forget-password',
                },
            ],
        };
    },
    methods: {
    },
};
</script>
