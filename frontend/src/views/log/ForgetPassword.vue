<template>
    <h1>{{ $t("log.forget_password_page.title") }}</h1>
    <p class="h1then">{{ $t('log.forget_password_page.tip') }}</p>
    <div class="related">
        <router-link v-for="item in related" :to="item.path">{{ $t('log.link.' + item.name) }}</router-link>
    </div>
</template>
<script>
import LabelInput from '../../components/LabelInput.vue';
export default {
    name: "LogIn",
    data() {
        return {
            related: [
                {
                    name: "login",
                    path: "/",
                },
                {
                    name: "register",
                    path: "/register",
                },
                {
                    name: "support",
                    path: "/support",
                }
            ]
        };
    },
    methods: {
    },
    components: { LabelInput }
}
</script>