<template v-if="!pageLoading">
    <div class="manageContainer">
        <div class="header">
            <button class="icon" :title="$t('manage.header_icon_button_title')"
                :alt="$t('manage.header_icon_button_alt')" @click="mobileSideBarOpen = !mobileSideBarOpen"></button>
            <p class="title"><span>{{ $t('manage.header_title') }}</span></p>
            <div class="headerUser">
                <p>{{ user.nick }}</p>
                <button class="avatar" :title="$t('manage.header_account_icon_title')"
                    :style="{ backgroundImage: 'url(' + user.avatarURL + ')' }"
                    :alt="$t('manage.header_account_icon_title')"
                    @click="accountSwitcherOpen = !accountSwitcherOpen"></button>
            </div>
        </div>
        <div class="main">
            <div class="accountSwitcher" v-if="accountSwitcherOpen == true">
                <p class="title"><span>{{ $t('manage.account_switcher.title') }}</span>
                    <button class="blockButton" @click="this.$router.push('/')">
                        {{ $t('manage.account_switcher.new') }}</button>
                </p>
                <div class="uList">
                    <UserButton v-for="user, index in avaliableSession" :key="user.uuid" :user="user" :showlogout=true
                        @click="switchAccount(index)"></UserButton>
                </div>

            </div>
            <div class="accountSwitcherHover" :style="{ display: accountSwitcherOpen ? 'block' : 'none' }"
                @click="accountSwitcherOpen = false"></div>
            <div :class="{ sideBar: true, opened: mobileSideBarOpen }">
                <span v-for="item in sideBar" :key="item.name">
                    <router-link class="link" v-if="!item.child && item.display !== false" :to="'/manage/' + item.path"
                        @click="mobileSideBarOpen = false">
                        <font-awesome-icon :icon="['fas', item.icon]" />
                        <span>{{ $t('manage.pages.' + item.name) }}</span>
                    </router-link>
                    <div v-else-if="item.display !== false">
                        <div class="twoLevelTitle">{{ $t('manage.pages.' + item.name) }}</div>
                        <div v-for="child in item.child" :key="child.name">
                            <router-link v-if="child.display !== false" class="link" :to="'/manage/' + child.path"
                                @click="mobileSideBarOpen = false">
                                <font-awesome-icon :icon="['fas', child.icon]" />
                                <span>{{ $t('manage.pages.' + child.name) }}</span>
                            </router-link>
                        </div>
                    </div>
                </span>
            </div>
            <div class="pcSplitLine"></div>
            <div :class="{ sideBarCover: true, opened: mobileSideBarOpen }"
                @click="mobileSideBarOpen = false; accountSwitcherOpen = false"></div>
            <div class="pageContent">
                <router-view :user="user" @updateuser="updateUser"></router-view>
            </div>
            <div class="pcSplitLine"></div>
            <RelatedFrame :user="user" @updateuser="updateUser"></RelatedFrame>
        </div>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

import UserButton from '../../components/UserButton.vue';
// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';
import {
    addSession, deleteSession, getSessions, useSession,
} from '../../sessions';
import { getAvatar } from '../../utils';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Manage',
    data() {
        return {
            pageLoading: true,
            avaliableSession: [],
            sideBar: [
                {
                    name: 'index',
                    path: '',
                    icon: 'house',
                },
                {
                    name: 'safety',
                    path: 'safety',
                    icon: 'shield',
                },
                {
                    name: 'infos',
                    path: 'infos',
                    icon: 'circle-info',
                },
                {
                    name: 'authorization',
                    path: 'authorization',
                    icon: 'unlock-keyhole',
                },
                {
                    name: 'preference',
                    path: 'preference',
                    icon: 'cog',
                },
            ],
            mobileSideBarOpen: false,
            user: {
                uuid: '',
                user: '',
                mail: '',
                nick: this.$t('manage.fake_account_name'),
                avatar: '',
                avatarURL: '',
                mood: '',
                role: 'undefined',
                regat: '',
            },
            accountSwitcherOpen: false,
        };
    },
    mounted() {
        const self = this;
        this.trySessions();
        this.$nextTick(() => {
            document.addEventListener('keyup', (e) => {
                if (e.keyCode === 27) {
                    self.accountSwitcherOpen = false;
                }
            });
        });
    },
    methods: {
        trySessions() {
            // eslint-disable-next-line prefer-const
            let sessions = getSessions();
            if (sessions.length === 0) {
                this.$router.push('/');
            }
            let sessionsCheckedCount = 0;
            sessions.forEach((session, index) => {
                apolloClient.query({
                    query: gql`query Query($token: String) {
  User(token: $token) {
    getUser {
      uuid
      user
      nick
      avatar
      mail
      mood
      role
      regat
      tfa
    }
  }
}`,
                    variables: {
                        token: session.token,
                    },
                }).then(({ data }) => {
                    console.log(data);
                    const uData = data.User.getUser;
                    if (uData.user === 'guest') {
                        deleteSession(session);
                        this.avaliableSession[index] = false;
                    } else {
                        uData.token = session.token;
                        uData.avatarURL = getAvatar(uData.avatar);
                        this.avaliableSession[index] = uData;
                    }
                }, (error) => {
                    console.log(error);
                    if (error.graphQLErrors && error.graphQLErrors[0]) { deleteSession(session); }
                    this.avaliableSession[index] = false;
                }).then(() => {
                    sessionsCheckedCount++;
                    if (sessionsCheckedCount === sessions.length) {
                        this.pageLoading = false;
                        this.avaliableSession.forEach((element) => {
                            if (element === false) {
                                this.avaliableSession.splice(index, 1);
                            }
                        });
                        if (this.avaliableSession.length === 0 || this.avaliableSession[0] === false) {
                            this.$router.push('/');
                        } else {
                            // eslint-disable-next-line prefer-destructuring
                            this.user = this.avaliableSession[0];
                            if (this.user.role === 'admin') {
                                this.sideBar.push(
                                    {
                                        name: 'admin.title',
                                        child: [
                                            {
                                                name: 'admin.users',
                                                path: 'admin/users',
                                                icon: 'user-gear',
                                            },
                                        ],
                                    },
                                );
                            }
                        }
                    }
                });
            });
        },
        switchAccount(index) {
            useSession(this.avaliableSession[index]);
            window.location.reload();
        },
        updateUser(data) {
            this.user = data;
            addSession(this.user);
        },
    },
    components: { UserButton },
};
</script>
