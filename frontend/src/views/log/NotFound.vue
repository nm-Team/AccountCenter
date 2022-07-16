<template>
    <h1>{{ $t("log.not_found_page.title") }}</h1>
    <p class="h1then">{{ $t('log.not_found_page.tip') }}</p>
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
                    name: "forget_password",
                    path: "/forget-password",
                }
            ]
        };
    },
    methods: {
        login() {
            alert(this.username + " " + this.password);
        },
    },
    components: { LabelInput }
}
</script>