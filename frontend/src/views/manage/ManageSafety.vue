<template>
    <h1>{{ $t('manage.pages.safety') }}</h1>
    <div class="block">
        <h2 class="title">{{ $t('manage.recent_sessions.title') }}</h2>
        <div class="table">
            <table>
                <thead>
                    <td>{{ $t('manage.recent_sessions.table.time') }}</td>
                    <td>{{ $t('manage.recent_sessions.table.ip') }}</td>
                    <td>{{ $t('manage.recent_sessions.table.ua') }}</td>
                    <td>{{ $t('manage.recent_sessions.table.operates') }}</td>
                </thead>
                <tbody>
                    <tr v-for="session in onlineSessions" :key="session">
                        <td style="min-width: 5em;">{{ $t('manage.recent_sessions.table.time_word', {
                                last_active:
                                    session.updateAt, login_time: session.createAt
                            })
                        }}
                        </td>
                        <td style="min-width: 5em;">{{ $t('manage.recent_sessions.table.ip_word', {
                                ip: session.ip, city:
                                    '下北泽'
                            })
                        }}
                        </td>
                        <td style="min-width: 15em;">{{ session.ua }}
                        </td>
                        <td style="min-width: 3em;"><a @click="kickSession" href="javascript:">{{
                                $t('manage.recent_sessions.operates.logout')
                        }}</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="block">
        <h2 class="title">Debug</h2>
        <code>{{ JSON.stringify(onlineSessions, null, 4) }}</code>
    </div>
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
    watch: {
        user: {
            handler() {
                this.getActiveSessions();
            },
            deep: true,
        },
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
