/* eslint-disable camelcase */
import { createI18n } from 'vue-i18n';

import en from './locales/en.json';
import ja from './locales/ja.json';
import zh_Hans from './locales/zh-Hans.json';
import zh_Hant from './locales/zh-Hant.json';

const languages = [
    {
        code: ['en', 'en-US', 'en-AU', 'en-BZ', 'en-CA', 'en-CB', 'en-GB', 'en-IE', 'en-JM', 'en-NZ', 'en-PH', 'en-TT', 'en-ZA', 'en-ZW'],
        object: en,
        name: 'English',
    },
    {
        code: ['zh-Hans', 'zh', 'zh-CN'],
        object: zh_Hans,
        name: '简体中文',
    },
    {
        code: ['zh-Hant', 'zh-HK', 'zh-TW', 'zh-MO'],
        object: zh_Hant,
        name: '繁體中文',
    },
    {
        code: ['ja_JP', 'ja'],
        object: ja,
        name: '日本語',
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
