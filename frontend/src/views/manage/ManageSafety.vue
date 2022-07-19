<template>
    Active sessions:<br />
    {{ onlineSessions }}
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ManageSafety',
    data() {
        return {
            onlineSessions: [],
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    mounted() {
        this.getActiveSessions();
    },
    methods: {
        getActiveSessions() {
            apolloClient.query({
                query: gql`query GetSession($token: String) {
  User(token: $token) {
    getSession {
      createAt
      updateAt
      ua
      ip
    }
  }
}`,
                variables: {
                    token: this.user.token,
                },
            }).then(({ data }) => {
                console.log(data);
                this.onlineSessions = data.User.getSession;
                // eslint-disable-next-line no-param-reassign
            }, (error) => {
                console.log(error);
            });
        },
    },
    components: {},
};
</script>
