<template>
    <div v-if="step == 0">
        <h1>{{ $t("log.forget_password_page.step0.title") }}</h1>
        <p class="h1then">{{ $t('log.forget_password_page.step0.tip') }}</p>
        <form class="form" @submit.prevent="step0submit">
            <label-input v-for="item in form" :key="item.id" :model="item.id" :type="item.type" :label="item.label"
                :autofocus="item.autofocus" @getdata="setData">
            </label-input>
            <button>{{ $t("log.forget_password_page.nextstep") }}</button>
        </form>
    </div>
    <div v-if="step == 1">
        <h1>{{ $t("log.forget_password_page.step1.title") }}</h1>
        <p class="h1then">{{ $t('log.forget_password_page.step1.tip') }}</p>
    </div>
    <div class="related">
        <router-link v-for="item in related" :to="item.path" :key="item.name">{{ $t('log.link.' + item.name) }}</router-link>
    </div>
</template>
<script>

export default {
    name: 'ForgetPassword',
    data() {
        return {
            form: [
                {
                    id: 'email', type: 'text', label: 'log.email', autofocus: true,
                },
            ],
            step: 0,
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
                    name: 'support',
                    path: '/support',
                },
            ],
        };
    },
    methods: {
        step0submit() {
            this.step = 1;
        },
    },
};
</script>
