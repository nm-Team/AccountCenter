<template>
    <div :data-theme="theme" :data-manage-page="inManagePage">
        <div v-if="inManagePage == false">
            <i class="background" :style="{ backgroundImage: 'url(' + backgroundImage[theme] + ')' }"></i>
            <div class="frameContainer">
                <div class="header">
                    <div class="logo nmLogo" alt="nmTeam Logo"
                        :style="{ backgroundImage: exploded ? 'none' : null, width: exploded ? '7em' : '' }"
                        @click="easterEgg">{{
                            exploded ? "💥💦😢💦🧃" : ""
                        }}</div>
                    <font-awesome-icon :class="{ connectIcon: true, show: oauthIconShow ? true : false }"
                        icon="fa-solid fa-xmark" />
                    <div :class="{ logo: true, hidden: oauthIconShow ? false : true }"
                        :alt="$t('main.oauth_client_icon_alt')" :style="{ backgroundImage: `url(${oauthIconURL})` }">
                    </div>
                </div>
                <router-view @getdata="setData"></router-view>
                <div class="footer">
                    <Footer></Footer>
                </div>
            </div>
        </div>
        <div v-else>
            <router-view @getdata="setData"></router-view>
        </div>
    </div>
</template>

<script>

export default {
    // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
    name: 'Main',
    data() {
        return {
            theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
            backgroundImage: {
                light: 'https://websiteres.nmteam.xyz/background/street/light.png',
                dark: 'https://websiteres.nmteam.xyz/background/street/dark.png',
            },
            eEggCount: 0,
            exploded: false,
            inManagePage: false,
            defaultSwal: this.$swal.mixin({
                confirmButtonText: this.$t('confirm'),
                confirmButtonAriaLabel: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                cancelButtonAriaLabel: this.$t('cancel'),
                denyButtonText: this.$t('deny'),
                denyButtonAriaLabel: this.$t('deny'),
                customClass: {
                    container: `theme-${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}`,
                },
            }),
            oauthIconURL: null,
            oauthIconShow: false,
        };
    },
    provide() {
        return {
            defaultSwal: this.defaultSwal,
        };
    },
    mounted() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        });
        this.showOAuthIcon();
    },
    methods: {
        easterEgg() {
            this.eEggCount++;
            if (this.eEggCount === 7) {
                this.defaultSwal.fire(this.$t('easter_egg.first_warning', { emoji: '😣😫😭🤮' }));
            } else if (this.eEggCount === 14) {
                this.defaultSwal.fire(this.$t('easter_egg.second_warning'));
                this.exploded = true;
            }
        },
        changeLang() {
            this.$i18n.locale = this.language;
            localStorage.locale = this.language;
        },
        setData(name, data) {
            this[name] = data;
        },
        isInManagePage() {
            this.inManagePage = this.$router.currentRoute.path.indexOf('/manage') > -1;
        },
        showOAuthIcon() {
            if (this.$route.query.client_id && this.$route.query.client_icon) {
                this.oauthIconURL = this.$route.query.client_icon ?? null;
                setTimeout(() => {
                    this.oauthIconShow = true;
                }, 200);
            } else {
                this.oauthIconShow = false;
            }
        },
    },
    watch: {
        $route(to, from) {
            // this.isInManagePage();
            console.log(to, from);
            // Change page title
            console.log(this.$t(to.meta?.title), to.meta?.title);
            document.title = (this.$t(to.meta?.title) !== to.meta?.title ? `${this.$t(to.meta?.title)} - ` : '') + this.$t('page_title');
            this.inManagePage = to.path.indexOf('/manage') > -1;
            if (document.querySelector('.manageContainer')) {
                document.querySelector('.manageContainer .main').scrollTop = 0;
                document.querySelector('.pageContent').scrollTop = 0;
            }
            this.showOAuthIcon();
        },
    },
};

</script>
