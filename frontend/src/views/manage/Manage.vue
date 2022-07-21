<template v-if="!pageLoading">
    <div class="manageContainer">
        <div class="header">
            <button class="icon" :title="$t('manage.header_icon_button_title')"
                :alt="$t('manage.header_icon_button_alt')" @click="mobileSideBarOpen = !mobileSideBarOpen"></button>
            <p class="title"><span>{{ $t('manage.header_title') }}</span></p>
            <div class="user">
                <p>{{ user.nick }}</p>
                <button class="avatar" :title="$t('manage.header_account_icon_title')"
                    :style="{ backgroundImage: 'url(' + user.avatarURL + ')' }"
                    :alt="$t('manage.header_account_icon_title')"></button>
            </div>
        </div>
        <div class="main">
            <div :class="{ sideBar: true, opened: mobileSideBarOpen }">
                <router-link v-for="item in sideBar" :to="'/manage/' + item.path" @click="mobileSideBarOpen = false"
                    :key="item.name">
                    <menu-icon />
                    <span>{{ $t('manage.pages.' + item.name) }}</span>
                </router-link>
            </div>
            <div class="pcSplitLine"></div>
            <div :class="{ sideBarCover: true, opened: mobileSideBarOpen }" @click="mobileSideBarOpen = false"></div>
            <div class="pageContent">
                <router-view :user="user"></router-view>
            </div>
            <div class="pcSplitLine"></div>
            <div class="relatedFrame">
                <div class="block">
                    <h2 class="title">Example</h2>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';
import { deleteSession, getSessions } from '../../sessions';
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
                },
                {
                    name: 'safety',
                    path: 'safety',
                },
                {
                    name: 'infos',
                    path: 'infos',
                },
                {
                    name: 'preference',
                    path: 'preference',
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
                role: '',
                regat: '',
            },
        };
    },
    mounted() {
        this.linkSessions();
    },
    methods: {
        linkSessions() {
            // eslint-disable-next-line prefer-const
            let sessions = getSessions();
            let sessionsCheckedCount = 0;
            sessions.forEach((session, index) => {
                apolloClient.query({
                    query: gql`query Query($token: String) {
  User(token: $token) {
    getUser {
      uuid
      user
      mail
      nick
      avatar
      mood
      role
      regat
    }
  }
}`,
                    variables: {
                        token: session.token,
                    },
                }).then(({ data }) => {
                    console.log(data);
                    // eslint-disable-next-line prefer-const
                    let uData = data.User.getUser;
                    uData.token = session.token;
                    uData.avatarURL = getAvatar(uData.avatar);
                    this.avaliableSession[index] = uData;
                }, (error) => {
                    console.log(error);
                    deleteSession(session);
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
                        if (this.avaliableSession.length === 0) {
                            this.$router.push('/');
                        } else {
                            // eslint-disable-next-line prefer-destructuring
                            this.user = this.avaliableSession[0];
                        }
                    }
                });
            });
        },
    },
    components: {},
};
</script>
