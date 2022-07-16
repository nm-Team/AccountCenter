import { createI18n } from 'vue-i18n';

// import zh_Hant from './locales/zh-Hant'
import en from './locales/en.js';
import zhCN from './locales/zh-Hans.js';

const i18n = createI18n({
    // 如果本地有语言标识就采用本地，没有就根据浏览器语言默认标识显示语言
    locale: localStorage.getItem('locale') || navigator.language.replace(/-/g, '_'),
    legacy: true,
    globalInjection: true,
    messages: {
        zhCN,
        // zhHant,
        en,
    },
    fallbackLocale: 'en',
});
export default i18n;
