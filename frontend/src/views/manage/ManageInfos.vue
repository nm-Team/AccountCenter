<template>
    <h1>{{ $t('manage.infos.title') }}</h1>
    <div class="block">
        <h2 class="title">{{ $t('manage.infos.changeable.title') }}</h2>
        <label-input v-for="item in changeableForm" :key="item.id" :model="item.id" :type="item.type"
            :value="item.value" :label="item.label" @getdata="editInfo">
        </label-input>
        <div class="btns" v-if="inEdit">
            <div>
                <button class="blockButton" @click="initializeUserInfo()">
                    {{ $t('cancel') }}</button>
            </div>
            <div class="right">
                <button class="blockButton" @click="0">
                    {{ $t('save') }}</button>
            </div>
        </div>
    </div>
    <div class="block">
        <h2 class="title">{{ $t('manage.infos.readonly.title') }}</h2>
        <label-input v-for="item in readonlyForm" :key="item.id" :model="item.id" :type="item.type" :value="item.value"
            :label="item.label" @getdata="setData" :readonly="true">
        </label-input>
    </div>
</template>
<script>

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ManageInfos',
    data() {
        return {
            editedInfo: {},
            inEdit: false,
            changeableForm: [],
            readonlyForm: [],
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    mounted() {
        this.initializeUserInfo();
    },
    watch: {
        user: {
            handler() {
                this.initializeUserInfo();
            },
            deep: true,
        },
    },
    methods: {
        editInfo(name, data) {
            this.editedInfo[name] = data;
            this.inEdit = true;
        },
        initializeUserInfo() {
            this.changeableForm = [
                {
                    id: 'nick',
                    type: 'text',
                    label: this.$t('manage.infos.changeable.nick'),
                    value: this.user.nick,
                },
                {
                    id: 'email',
                    type: 'text',
                    label: this.$t('manage.infos.changeable.email'),
                    value: this.user.mail,
                },
                {
                    id: 'mood',
                    type: 'textarea',
                    label: this.$t('manage.infos.changeable.mood'),
                    value: this.user.mood,
                },
            ];
            this.readonlyForm = [
                {
                    id: 'user',
                    type: 'text',
                    label: this.$t('manage.infos.readonly.user'),
                    value: this.user.user,
                },
                {
                    id: 'uuid',
                    type: 'text',
                    label: this.$t('manage.infos.readonly.uuid'),
                    value: this.user.uuid,
                },
                {
                    id: 'role',
                    type: 'text',
                    label: this.$t('manage.infos.readonly.role'),
                    value: this.$t(`manage.infos.roles.${this.user.role}`),
                },
            ];
        },
    },
    components: {},
};
</script>
