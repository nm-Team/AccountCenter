<template>
    <button class="user">
        <i :style="{ backgroundImage: `url(${user.avatarURL})` }" :alt="$t('avatar_alt')"></i>
        <div class="info">
            <p class="nick">{{ user.nick }}</p>
            <p class="mail">{{ user.mail }}</p>
        </div>
        <div class="logOutBut" v-if="showlogout">
            <button :title="$t('manage.logout_title')" @click.stop="logout()">
                <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']"></font-awesome-icon>
            </button>
        </div>
    </button>
</template>

<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../main';
import { deleteSession } from '../sessions';

export default {
    name: 'UserButton',
    data() {
        return {
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
        showlogout: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
    },
    methods: {
        logout() {
            if (window.confirm(this.$t('manage.logout_confirm'))) {
                apolloClient.query({
                    query: gql`query Query($token: String) {
  User(token: $token) {
    logout
  }
}`,
                    variables: {
                        token: this.user.token,
                    },
                }).then(({ data }) => {
                    console.log(data);
                    deleteSession(this.user);
                    window.location.reload();
                }, (error) => {
                    console.log(error);
                    alert(this.$t('manage.logout_failed'));
                });
            }
        },
    },
};
</script>
