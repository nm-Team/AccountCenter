<template>
    <h1>{{ $t('manage.admin_users_list.title') }}</h1>
    <div class="block">
        <p class="title">{{ $t('manage.admin_users_list.users_list_title') }}</p>
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="0">
                    {{ $t('manage.admin_users_list.add_user') }}</button>
            </div>
            <div class="right">
                <label-input :value="usersListSearchKeyword" :model="usersListSearchKeyword" :type="'text'"
                    :fitbutton="true" :label="$t('manage.admin_users_list.search_keyword')" style="width: 140px"
                    @getdata="setData"></label-input>
            </div>
        </div>
        <div class="table usersListTable" v-if="usersList">
            <table>
                <thead>
                    <td v-if="usersListColumnFilterItems.uuid.show">{{
                        $t('manage.admin_users_list.table.uuid') }}</td>
                    <td v-if="usersListColumnFilterItems.user.show">{{
                        $t('manage.admin_users_list.table.user') }}</td>
                    <td v-if="usersListColumnFilterItems.nick.show">{{
                        $t('manage.admin_users_list.table.nick') }}</td>
                    <td v-if="usersListColumnFilterItems.avatar.show">{{
                        $t('manage.admin_users_list.table.avatar') }}</td>
                    <td v-if="usersListColumnFilterItems.mail.show">{{
                        $t('manage.admin_users_list.table.mail') }}</td>
                    <td v-if="usersListColumnFilterItems.mood.show">{{
                        $t('manage.admin_users_list.table.mood') }}</td>
                    <td v-if="usersListColumnFilterItems.role.show">{{
                        $t('manage.admin_users_list.table.role') }}</td>
                    <td v-if="usersListColumnFilterItems.regat.show">{{
                        $t('manage.admin_users_list.table.regat') }}</td>
                    <td v-if="usersListColumnFilterItems.loginat.show">{{
                        $t('manage.admin_users_list.table.loginat') }}</td>
                    <td v-if="usersListColumnFilterItems.loginip.show">{{
                        $t('manage.admin_users_list.table.loginip') }}</td>
                    <td v-if="usersListColumnFilterItems.tfa.show">{{
                        $t('manage.admin_users_list.table.tfa') }}</td>
                    <td v-if="usersListColumnFilterItems.action.show">{{
                        $t('manage.admin_users_list.table.action') }}</td>
                </thead>
                <tbody>
                    <tr v-for="user in usersList" :key="user.uuid">
                        <td v-if="usersListColumnFilterItems.uuid.show">{{ user.uuid }} </td>
                        <td v-if="usersListColumnFilterItems.user.show">{{ user.user }} </td>
                        <td v-if="usersListColumnFilterItems.nick.show">{{ user.nick }} </td>
                        <td v-if="usersListColumnFilterItems.avatar.show">
                            <i :style="{ backgroundImage: `url(${getAvatar(user.avatar)})` }" class="userTableAvatar"
                                :title="user.nick"></i>
                            {{ user.avatar }}
                        </td>
                        <td v-if="usersListColumnFilterItems.mail.show">{{ user.mail }} </td>
                        <td v-if="usersListColumnFilterItems.mood.show">{{ user.mood }} </td>
                        <td v-if="usersListColumnFilterItems.role.show">{{ user.role }} </td>
                        <td v-if="usersListColumnFilterItems.regat.show">{{ user.regat }} </td>
                        <td v-if="usersListColumnFilterItems.loginat.show">{{ user.loginat }} </td>
                        <td v-if="usersListColumnFilterItems.loginip.show">{{ user.loginip }} </td>
                        <td v-if="usersListColumnFilterItems.tfa.show">{{ user.tfa }} </td>
                        <td v-if="usersListColumnFilterItems.action.show" class="action">
                            <a href="javascript:void(0)" @click="resetPasswordPrompt(user)">{{
                                $t('manage.admin_users_list.table.action.reset_password')
                            }}</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="btns">
            <div class="right">
                <button class="blockButton" @click="showUsersListColumnFilter = !showUsersListColumnFilter">
                    {{ $t('manage.admin_users_list.column_filter_button') }}</button>
            </div>
        </div>
        <label class="columnFilterBox" v-show="showUsersListColumnFilter"
            v-for="(item, index) in usersListColumnFilterItems" :key="item.label">
            <input type="checkbox" :checked="item.show" @change="changeColumnFilter(index)">
            <span>{{ item.label }}</span>
        </label>
    </div>
</template>

<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';
import { getAvatar } from '../../utils';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'AdminUsers',
    data() {
        return {
            usersList: null,
            showUsersListColumnFilter: false,
            usersListColumnFilterItems: {
                uuid: {
                    label: this.$t('manage.admin_users_list.table.uuid'),
                    show: true,
                },
                user: {
                    label: this.$t('manage.admin_users_list.table.user'),
                    show: true,
                },
                nick: {
                    label: this.$t('manage.admin_users_list.table.nick'),
                    show: true,
                },
                avatar: {
                    label: this.$t('manage.admin_users_list.table.avatar'),
                    show: true,
                },
                mail: {
                    label: this.$t('manage.admin_users_list.table.mail'),
                    show: true,
                },
                mood: {
                    label: this.$t('manage.admin_users_list.table.mood'),
                    show: true,
                },
                role: {
                    label: this.$t('manage.admin_users_list.table.role'),
                    show: true,
                },
                regat: {
                    label: this.$t('manage.admin_users_list.table.regat'),
                    show: true,
                },
                loginat: {
                    label: this.$t('manage.admin_users_list.table.loginat'),
                    show: true,
                },
                loginip: {
                    label: this.$t('manage.admin_users_list.table.loginip'),
                    show: true,
                },
                tfa: {
                    label: this.$t('manage.admin_users_list.table.tfa'),
                    show: true,
                },
                action: {
                    label: this.$t('manage.admin_users_list.table.action'),
                    show: true,
                },
            },
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    inject: ['defaultSwal'],
    mounted() {
        this.getUsersList();
    },
    watch: {
        user: {
            handler() {
                this.getUsersList();
            },
        },
        usersListSearchKeyword() {
            this.getUsersList();
        },
    },
    methods: {
        getUsersList() {
            apolloClient.query({
                query: gql`query Admin($token: String) {
  admin(token: $token) {
    getUserList {
      uuid
      user
      nick
      avatar
      mail
      mood
      role
      regat
      loginat
      loginip
      tfa
    }
  }
}
`,
                variables: {
                    token: this.user.token,
                },
            }).then((result) => {
                this.usersList = result.data.admin.getUserList;
            }).catch((error) => {
                console.log(error);
            });
        },
        resetPasswordPrompt(user) {
            this.defaultSwal.fire({
                title: this.$t('manage.admin_users_list.reset_password_prompt.title'),
                text: this.$t('manage.admin_users_list.reset_password_prompt.text', { user_nick: user.nick, user_uuid: user.uuid }),
                input: 'text',
                inputValue: this.randomPassword(),
                inputPlaceholder: this.$t('manage.admin_users_list.reset_password_prompt.input_placeholder'),
                showCancelButton: true,
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
            }).then((result) => {
                if (result.value) {
                    this.resetPassword(user, result.value);
                }
            });
        },
        randomPassword() {
            let password = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_&%$#@!';
            for (let i = 0; i < 16; i += 1) {
                password += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return password;
        },
        resetPassword(user, password) {
            apolloClient.query({
                query: gql`query Admin($token: String, $uuid: String, $pass: String) {
  admin(token: $token) {
    resetPass(uuid: $uuid, pass: $pass)
  }
}
`,
                variables: {
                    token: this.user.token,
                    uuid: user.uuid,
                    pass: password,
                },
            }).then(() => {
                this.defaultSwal.fire({
                    title: this.$t('manage.admin_users_list.reset_password_prompt.success_title'),
                    text: this.$t('manage.admin_users_list.reset_password_prompt.success_text', { user_nick: user.nick, user_uuid: user.uuid, password }),
                    icon: 'success',
                    confirmButtonText: this.$t('confirm'),
                });
            }).catch((error) => {
                console.log(error);
                this.defaultSwal.fire({
                    title: this.$t('manage.admin_users_list.reset_password_prompt.error_title'),
                    text: this.$t('manage.admin_users_list.reset_password_prompt.error_text', { user_nick: user.nick, user_uuid: user.uuid }),
                    icon: 'error',
                    confirmButtonText: this.$t('confirm'),
                });
            });
        },
        changeColumnFilter(item) {
            console.log(item);
            this.usersListColumnFilterItems[item].show = !this.usersListColumnFilterItems[item].show;
        },
        getAvatar(avatar) {
            return getAvatar(avatar);
        },
        setData(name, data) {
            this[name] = data;
        },
    },
    components: {},
};
</script>

<style lang="scss" scoped>
.usersListTable {
    table {
        td {
            min-width: 10em;
        }

        tbody {
            td {
                white-space: nowrap;
                vertical-align: middle;
            }

            td:not(.action) {
                user-select: all;
                -webkit-user-select: all;
                -moz-user-select: all;
                -ms-user-select: all;
            }
        }
    }

    .userTableAvatar {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-color: var(--avatar-skection);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 50%;
        margin-right: 0px;
        margin-bottom: -5px;
    }
}
</style>
