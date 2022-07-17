/* eslint-disable camelcase */
import { createI18n } from 'vue-i18n';

// import zh_Hant from './locales/zh-Hant'
import en from './locales/en.js';
import zh_CN from './locales/zh-Hans.js';

const languages = [
    {
        code: ['en'],
        object: en,
        name: 'English',
    },
    {
        code: ['zh', 'zh-Hans', 'zh-CN'],
        object: zh_CN,
        name: '简体中文',
    },
];

const lansObject = {};

languages.forEach((element) => {
    element.code.forEach((code) => {
        lansObject[code] = element.object;
    });
    // eslint-disable-next-line no-param-reassign
    delete element.object;
});

const i18n = createI18n({
    // 如果本地有语言标识就采用本地，没有就根据浏览器语言默认标识显示语言
    locale: localStorage.getItem('locale') || navigator.language,
    legacy: true,
    globalInjection: true,
    messages: lansObject,
    fallbackLocale: 'en',
});

export { i18n, languages };
