<template>
    <h1>{{ $t('manage.infos.title') }}</h1>
    <div class="block">
        <p class="title">{{ $t('manage.infos.customize.title') }}</p>
        <p><b>{{ $t('manage.infos.customize.avatar') }}</b></p>
        <img :src="user.avatarURL" onerror="this.src=''" :alt="$t('manage.infos.customize.avatar_alt')"
            class="userInfoPageAvatar">
        <div class="btns">
            <button class="blockButton" @click="this.$router.push('/manage/change-avatar')">
                {{ $t('manage.infos.customize.change_avatar') }}</button>
        </div>

    </div>
    <div class="block">
        <p class="title">{{ $t('manage.infos.changeable.title') }}</p>
        <label-input v-for="item in changeableForm" :key="item.id" :model="item.id" :type="item.type"
            :value="item.value" :label="item.label" @getdata="infoOnEdit">
        </label-input>
        <p>{{ saveMessage }}</p>
        <div class="btns" v-if="inEdit">
            <div>
                <button style="display: none;" class="blockButton"
                    @click="this.inEdit = false; this.initializeUserInfo()">
                    {{ $t('cancel') }}</button>
            </div>
            <div class="right">
                <button class="blockButton" @click="saveInfo()">
                    {{ $t('save') }}</button>
            </div>
        </div>
        <div v-else>
            <p v-if="saveMessage == ''">{{ $t('manage.infos.change_info_tip') }}</p>
        </div>
    </div>
    <div class="block">
        <p class="title">{{ $t('manage.infos.readonly.title') }}</p>
        <label-input v-for="item in readonlyForm" :key="item.id" :model="item.id" :type="item.type" :value="item.value"
            :label="item.label" @getdata="setData" :readonly="true">
        </label-input>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ManageInfos',
    data() {
        return {
            editedInfo: {},
            inEdit: false,
            changeableForm: [],
            readonlyForm: [],
            saveMessage: '',
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
        infoOnEdit(name, data) {
            this.editedInfo[name] = data;
            this.inEdit = true;
            this.saveMessage = '';
        },
        initializeUserInfo() {
            this.changeableForm = [];
            this.readonlyForm = [];
            this.changeableForm = [
                {
                    id: 'nick',
                    type: 'text',
                    label: this.$t('manage.infos.changeable.nick'),
                    value: this.user.nick,
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
                    id: 'email',
                    type: 'text',
                    label: this.$t('manage.infos.changeable.email'),
                    value: this.user.mail,
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
        saveInfo() {
            const newInfo = {};
            if (this.editedInfo.nick === '') {
                this.saveMessage = this.$t('manage.infos.change.nick_empty');
                return;
            }
            if (this.editedInfo.nick !== undefined && this.editedInfo.nick !== this.user.nick) {
                newInfo.nick = this.editedInfo.nick;
            }
            if ((this.editedInfo.mood || this.editedInfo.mood === '') && this.editedInfo.mood !== this.user.mood) {
                newInfo.mood = this.editedInfo.mood;
            }
            if (Object.keys(newInfo).length === 0) {
                this.inEdit = false;
                return;
            }
            this.saveMessage = this.$t('manage.infos.change.saving');
            apolloClient.query({
                query: gql`query User($token: String${newInfo.nick ? ', $nick: String' : ''}${newInfo.mood != null ? ', $mood: String' : ''}) {
  User(token: $token) {
    ${newInfo.nick ? 'changeNick(nick: $nick)' : ''}
    ${newInfo.mood != null ? 'changeMood(mood: $mood)' : ''}
  }
}`,
                variables: {
                    token: this.user.token,
                    nick: newInfo.nick,
                    mood: newInfo.mood,
                },
                // eslint-disable-next-line @typescript-eslint/no-shadow
            }).then(({ data }) => {
                if (data.User) {
                    this.saveMessage = this.$t('manage.infos.change.success');
                    this.inEdit = false;
                    for (const key in newInfo) {
                        this.user[key] = newInfo[key];
                    }
                    this.$emit('updateuser', this.user);
                    this.editedInfo = {};
                    this.initializeUserInfo();
                } else {
                    this.saveMessage = this.$t('manage.infos.change.error');
                }
            }, (error) => {
                console.log(error);
                this.saveMessage = this.$t('error.userinfo_get_failed')
                    + this.$t(`error.${error.graphQLErrors && error.graphQLErrors[0] ? error.graphQLErrors[0].message : 'network_error'}`);
                this.isError = true;
            });
        },
    },
    components: {},
};
</script>
<style lang="scss" scoped>
.userInfoPageAvatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 10px 10px 10px 0;
    background: var(--avatar-skection);
}
</style>
