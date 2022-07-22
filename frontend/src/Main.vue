<template>
    <div :data-theme="theme" :data-manage-page="inManagePage">
        <div v-if="inManagePage == false">
            <i class="background" :style="{ backgroundImage: 'url(' + backgroundImage[theme] + ')' }"></i>
            <div class="frameContainer">
                <div class="header">
                    <div class="logo" alt="nmTeam Logo" :style="{ backgroundImage: exploded ? 'none' : null }"
                        @click="easterEgg">{{
                                exploded ? "💥💦😢💦🧃" : ""
                        }}</div>
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
        };
    },
    methods: {
        easterEgg() {
            this.eEggCount++;
            if (this.eEggCount === 7) {
                alert("Please do not click me anymore. I'm just a lemon and will boom and explode if you click me and click me and click me. This is not funny. You will be 😣😫😭🤮. Trust me.");
            } else if (this.eEggCount === 14) {
                alert("Note: I'm going to explode now. EAT your own fruit.");
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
    },
    watch: {
        $route(to, from) {
            // this.isInManagePage();
            console.log(to, from);
            this.inManagePage = to.path.indexOf('/manage') > -1;
        },
    },
};

</script>
