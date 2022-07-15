<template>
    <h1>{{ $t("log.login_page.title") }}</h1>
    <p class="h1then" v-if="oauth.name">{{ $t('log.login_page.continue', { app: oauth.name }) }}</p>
    <div class="form">
        <label-input model="username" type="text" label="log.username" enablescale=false @getdata="setData">
        </label-input>
        <label-input model="password" type="password" label="log.password" enablescale=false @getdata="setData">
        </label-input>
        <label :for="keepLog" class="checkbox">
            <input v-model="keepLog" type="checkbox">
            <span>{{ $t("log.login_page.keep_me_logged_in") }}</span>
        </label>
        <button @click="login">{{ $t("log.login_page.submit") }}</button>
    </div>
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
            keepLog: true,
            related: [
                {
                    name: "register",
                    path: "/register",
                },
                {
                    name: "forget_password",
                    path: "/forget-password",
                }
            ],
            oauth: {
                name: "3rd Party"
            }
        };
    },
    methods: {
        login() {
            alert(this.username + " " + this.password);
        },
        setData(name, data) {
            this[name] = data;
        }
    },
    components: { LabelInput }
}
</script>