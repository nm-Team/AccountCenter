<template>
    <i class="background"
        :style="{ backgroundImage: 'url(' + backgroundImage[theme] + ')', backgroundColor: theme == 'light' ? '\#eee' : '\#000' }"></i>
    <div class="frameContainer" :data-theme="theme">
        <div class="header">
            <div class="logo" alt="nmTeam Logo" @click="easterEgg" :style="{ '--icon': 'url(' + icon + ')' }">{{
                    exploded ? "💥💦😢💦🧃" : ""
            }}</div>
        </div>
        <router-view></router-view>
        <div class="footer">
            <p><span>{{ $t('log.footer.copyright', { year: new Date().getFullYear() }) }}</span></p>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Log', // eslint-disable-line
    data() {
        return {
            theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
            icon: 'https://websiteres.nmteam.xyz/producticon/nmTeam/logo@64.png',
            backgroundImage: {
                light: 'https://websiteres.nmteam.xyz/background/street/light.png',
                dark: 'https://websiteres.nmteam.xyz/background/street/dark.png',
            },
            eEggCount: 0,
        };
    },
    methods: {
        easterEgg() {
            this.eEggCount++;
            if (this.eEggCount === 7) {
                alert("Please do not click me anymore. I'm just a lemon and will boom and explode if you click me and click me and click me. This is not funny. You will be 😣😫😭🤮. Trust me."); // eslint-disable-line
            } else if (this.eEggCount === 14) {
                alert("Note: I'm going to explode now. EAT your own fruit."); // eslint-disable-line
                this.icon = '/';
                this.exploded = true;
            }
        },
    },
};
</script>
