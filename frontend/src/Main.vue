<template>
    <i class="background" :data-theme="theme" :style="{ backgroundImage: 'url(' + backgroundImage[theme] + ')' }"></i>
    <div class="frameContainer" :data-theme="theme" :data-manage-page="logStatus">
        <transition>
            <div v-if="logStatus == false">
                <div class="header">
                    <div class="logo" alt="nmTeam Logo" @click="easterEgg" :style="{ '--icon': 'url(' + icon + ')' }">{{
                            exploded ? "💥💦😢💦🧃" : ""
                    }}</div>
                </div>
                <router-view></router-view>
                <div class="footer">
                    <p><span>{{ $t('log.footer.copyright', { year: new Date().getFullYear() }) }}</span></p>
                    <select v-model="language" class="seleteLang" @change="changeLang" :title="$t('selete_language')">
                        <option v-for="lang in languages" :key="lang"
                            :value="(lang.code.indexOf(language) > -1 ? language = lang.code[0] : true) && lang.code[0]">
                            {{
                                    lang.name
                            }}
                        </option>
                    </select>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { languages } from './i18n';

const langs = languages;

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
            languages: langs,
            language: this.$i18n.locale,
            logStatus: false,
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
        changeLang() {
            // eslint-disable-next-line prefer-destructuring
            this.$i18n.locale = this.language;
            // eslint-disable-next-line prefer-destructuring
            localStorage.locale = this.language;
        },
    },
};
</script>
