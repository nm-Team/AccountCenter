<template>
    <h1>{{ $t('manage.pages.safety') }}</h1>
    <div class="block">
        <h2 class="title">{{ $t('manage.recent_sessions.title') }}</h2>
        <div class="table" v-if="onlineSessions">
            <table>
                <thead>
                    <td>{{ $t('manage.recent_sessions.table.time') }}</td>
                    <td>{{ $t('manage.recent_sessions.table.ip') }}</td>
                    <td>{{ $t('manage.recent_sessions.table.ua') }}</td>
                    <td>{{ $t('manage.recent_sessions.table.operates') }}</td>
                </thead>
                <tbody>
                    <tr v-for="session in onlineSessions" :key="session">
                        <td style="min-width: 15em;">
                            {{ session.updateAt }}<br />
                            {{ $t('manage.recent_sessions.table.time_log_in_word', {
                                    login_time: session.createAt
                                })
                            }}
                        </td>
                        <td style="min-width: 8em;">
                            {{ session.ip }}<br />
                            {{ $t('manage.recent_sessions.table.ip_word', {
                                    city: ipPosition[session.ip] ? ipPosition[session.ip] : $t('loading')
                                })
                            }}
                        </td>
                        <td style="min-width: 15em;">{{ session.ua }}
                        </td>
                        <td style="min-width: 2em;">
                            <a @click="kickSession()" href="javascript:">{{
                                    $t('manage.recent_sessions.operates.logout')
                            }}</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else>{{ $t('loading') }}...</p>
        <p>{{ $t('manage.recent_sessions.tip.manage_here') }}</p>
        <p>{{ $t('manage.recent_sessions.tip.logout_unrecognized') }}</p>
        <div class="btns">
            <button class="blockButton" @click="logOutAllSessions()">
                {{ $t('manage.recent_sessions.operates.logout_all') }}</button>
        </div>
    </div>
    <SafetyChecker :user="user" :insafetypage=true></SafetyChecker>
</template>
<script>
import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';

export default {
    name: 'ManageSafety',
    data() {
        return {
            onlineSessions: [],
            ipPosition: {},
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
                this.onlineSessions.forEach((element) => {
                    this.getIpLoc(element.ip);
                });
                // eslint-disable-next-line no-param-reassign
            }, (error) => {
                console.log(error);
            });
        },
        logOutAllSessions() {
            if (window.confirm(this.$t('manage.recent_sessions.operates.logout_all_confirm'))) {
                apolloClient.query({
                    query: gql`query GetSession($token: String) {
  User(token: $token) {
    logout
  }
}`,
                    variables: {
                        token: this.user.token,
                    },
                }).then(({ data }) => {
                    console.log(data);
                    this.$router.push('/');
                }, (error) => {
                    console.log(error);
                    alert(this.$t('manage.recent_sessions.operates.logout_fail'));
                });
            }
        },
        getIpLoc(ip) {
            this.axios.get(`https://api.ip.sb/geoip/${ip}`).then((response) => {
                console.log(response.data);
                if (response.data.city) {
                    this.ipPosition[ip] = `${response.data.city}, ${response.data.country}`;
                } else if (response.data.country) {
                    this.ipPosition[ip] = response.data.country;
                } else this.ipPosition[ip] = this.$t('unknown');
            });
        },
    },
    components: {},
};
</script>
