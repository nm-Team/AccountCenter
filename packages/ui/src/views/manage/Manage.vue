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
                <router-link v-for="item in sideBar" :to="'/manage/' + item.path" @click="mobileSideBarOpen = false"
                    :key="item.name">
                    <font-awesome-icon :icon="['fas', item.icon]" />
                    <span>{{ $t('manage.pages.' + item.name) }}</span>
                </router-link>
            </div>
            <div class="pcSplitLine"></div>
            <div :class="{ sideBarCover: true, opened: mobileSideBarOpen }"
                @click="mobileSideBarOpen = false; accountSwitcherOpen = false"></div>
            <div class="pageContent">
                <router-view :user="user"></router-view>
            </div>
            <div class="pcSplitLine"></div>
            <div class="relatedFrame">
                <div class="block">
                    <p class="title">{{ $t('manage.explore.use_nmservices.title') }}</p>
                    <div class="nmServicesList">
                        <a v-for="item in nmServices" :key="item.name" :href="item.url" target="_blank"
                            :style="{ backgroundColor: item.backgroundColor, backgroundImage: item.backgroundColor }">
                            <div class="bgImg"
                                :style="{ backgroundImage: `url(${item.backgroundImage})`, margin: item.margin }"></div>
                            <p :style="{ color: item.color }">{{ $t('manage.explore.use_nmservices.products.' +
                                    item.name)
                            }}</p>
                        </a>
                    </div>
                </div>
                <div class="block">
                    <p class="title">{{ $t('manage.explore.developers_will_love_nmteam_account.title') }}</p>
                    <p>{{ $t('manage.explore.developers_will_love_nmteam_account.description') }}</p>
                    <p><a href="https://nmteam.xyz/developers" target="_blank">
                            <LinkA :text="$t('manage.explore.developers_will_love_nmteam_account.a_text')"></LinkA>
                        </a></p>
                </div>
                <div class="block">
                    <p class="title">{{ $t('manage.explore.help.title') }}</p>
                    <p>{{ $t('manage.explore.help.description') }}</p>
                    <p><a href="https://nmteam.xyz/support" target="_blank">
                            <LinkA :text="$t('manage.explore.help.a_text')"></LinkA>
                        </a></p>
                </div>
                <div class="footer">
                    <Footer></Footer>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { gql } from 'apollo-boost';

import UserButton from '../../components/UserButton.vue';
// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';
import { deleteSession, getSessions, useSession } from '../../sessions';
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
            nmServices: [
                {
                    name: 'nmFun',
                    url: 'https://fun.nmteam.xyz',
                    color: '#000',
                    backgroundColor: 'linear-gradient(90deg, rgba(255,250,58,1) 0%, rgba(255,206,0,1) 91%)',
                    backgroundImage: 'https://websiteres.nmteam.xyz/producticon/nmFun/logo.svg',
                    margin: '10px 21px',
                },
                {
                    name: 'nmBrowser_startPage',
                    url: 'https://bs.nmteam.xyz',
                    color: '#000',
                    backgroundColor: 'linear-gradient(90deg, rgba(0,192,255,1) 0%, rgba(148,232,255,1) 100%)',
                    backgroundImage: 'https://websiteres.nmteam.xyz/producticon/nmBrowser/logo.svg',
                    margin: '14px 24px',
                },
                {
                    name: 'more',
                    url: 'https://nmteam.xyz/products',
                    color: '#fff',
                    backgroundColor: '#00bcd4',
                    backgroundImage: '/view_more.png',
                    margin: '0',
                },
            ],
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
                        }
                    }
                });
            });
        },
        switchAccount(index) {
            useSession(this.avaliableSession[index]);
            window.location.reload();
        },
    },
    components: { UserButton },
};
</script>
