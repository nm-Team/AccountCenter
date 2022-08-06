<template>
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
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';
import {
    addSession, deleteSession, getSessions, useSession,
} from '../../sessions';
import { getAvatar } from '../../utils';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'RelatedFrame',
    data() {
        return {
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
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    mounted() {
    },
    methods: {
    },
};
</script>
<style lang="scss" scoped>
.relatedFrame {
    padding: 2px 16px;

    @media (max-width: 800px) {
        display: flex;
        flex-direction: column;
        padding: 0px 16px 20px 16px;
        margin-top: -2px;
    }

    @media (min-width: 800px) {
        width: min(240px, 25vw);
        overflow: auto;
        overflow: overlay;
        flex-grow: 0;
        flex-shrink: 0;
        transition: width .2s;

        .block {
            padding: 0px 0!important;
            border: none!important;
        }
    }

    @media (min-width: 1000px) {
        width: min(300px, 25vw);
        margin-right: 5px;
    }

    @media (min-width: 1400px) {
        width: min(450px, 27vw);
    }
}

.block.specialBlockA {
    align-items: center;

    .texts {
        width: -webkit-fill-available;
    }

    .img {
        display: inline;
        width: min(60%, 300px);
        margin-top: 20px;
        height: 0;
        padding-bottom: 30%;

        background: {
            size: contain;
            repeat: no-repeat;
            position: top center;
        }
    }

    @media (min-width: 1200px) {
        flex-direction: row;
        align-items: flex-start;

        .img {
            width: 400px;
            margin-top: 15px;
            margin-left: 12px;
            flex-grow: 0;
        }
    }
}
</style>
