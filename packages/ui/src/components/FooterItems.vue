<template>
    <p><span>{{ $t('log.footer.copyright', { year: new Date().getFullYear() }) }}</span></p>
    <label :aria-label="$t('selete_language')">
        <select v-model="language" class="seleteLang" @change="changeLang" :title="$t('selete_language')"
            :aria-label="$t('selete_language')">
            <option v-for="lang in languages" :key="lang"
                :value="(lang.code.indexOf(language) > -1 ? language = lang.code[0] : true) && lang.code[0]"
                :aria-label="lang.name">
                {{ lang.name }}
            </option>
        </select>
    </label>
</template>

<script>
import { languages } from '../i18n';

const langs = languages;

export default {
    name: 'FooterItems',
    data() {
        return {
            languages: langs,
            language: this.$i18n.locale,
        };
    },
    methods: {
        changeLang() {
            this.$i18n.locale = this.language;
            localStorage.locale = this.language;
        },
    },
};
</script>
