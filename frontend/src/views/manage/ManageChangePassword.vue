<template>
    <h1>{{ $t('manage.change_password.title') }}</h1>
    <div class="block">
        <p
            v-html="$t('manage.change_password.forget', { reset: `<a href='/#/forget-password'>${$t('manage.change_password.reset')}</a>` })">
        </p>
        <label-input v-for="item in form" :key="item.id" :model="item.id" :type="item.type" :label="item.label"
            :autofocus="item.autofocus" @getdata="setData">
        </label-input>
        <div class="btns">
            <div class="right">
                <button class="blockButton" @click="0">
                    {{ $t('manage.change_password.submit') }}</button>
            </div>
        </div>
    </div>
    <div class="block">
        <p class="title">{{ $t('manage.change_password.tip.title') }}</p>
        <li v-for="n in 6" :key="n">{{ $t('manage.change_password.tip.t' + (n - 1)) }}</li>
    </div>
</template>
<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ManageChangePassword',
    data() {
        return {
            form: [
                { id: 'oldpassword', type: 'password', label: 'manage.change_password.old_password' },
                { id: 'password', type: 'password', label: 'manage.change_password.new_password' },
                { id: 'confirmpassword', type: 'password', label: 'manage.change_password.confirm_password' },
            ],
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
