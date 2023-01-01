<!-- eslint-disable max-len -->
<template>
    <h1>{{ $t('manage.pages.safety') }}</h1>
    <div class="block">
        <p class="title">{{ $t('manage.recent_sessions.title') }}
            <button class="blockButton" style="float: right; margin-top: 0;"
                @click="sessionDetailMode = !sessionDetailMode">
                {{ sessionDetailMode ? $t('manage.recent_sessions.tiny_mode') : $t('manage.recent_sessions.detail_mode')
}}</button>
        </p>
        <div class="table" v-if="onlineSessions && sessionDetailMode">
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
                            <a @click="logOutSession(session.uuid)" v-if="session.uuid != user.token"
                                href="javascript:">{{
        $t('manage.recent_sessions.operates.logout')
}}</a>
                            <span v-else>{{ $t('manage.recent_sessions.operates.this_session') }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="tinySessionList" v-else-if="onlineSessions && !sessionDetailMode">
            <div class="tinySession" v-for="session, index in onlineSessions" :key="session"
                v-show="showSessionsNum == 0 || index < showSessionsNum">
                <svg v-if="deviceIcon[session.uaParsed.device]" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" v-html="deviceIcon[session.uaParsed.device]"></svg>
                <font-awesome-icon v-else :icon="['fas', 'earth-asia']"></font-awesome-icon>
                <div class="infos">
                    <p :title="session.uaParsed.deviceDetail"><b>{{ $t('manage.recent_sessions.tiny.device') }}{{
        $t('manage.recent_sessions.tiny.colon')
}}</b>{{ session.uaParsed.device }}
                    </p>
                    <p :title="session.updateAt"><b>{{ $t('manage.recent_sessions.tiny.active_time') }}{{
        $t('manage.recent_sessions.tiny.colon')
}}</b>{{ session.updateAtRelative }}
                    </p>
                    <p :title="session.createAt"><b>{{ $t('manage.recent_sessions.tiny.create_time') }}{{
        $t('manage.recent_sessions.tiny.colon')
}}</b>{{ session.createAtRelative }}
                    </p>
                    <p><b>{{ $t('manage.recent_sessions.tiny.ip') }}{{ $t('manage.recent_sessions.tiny.colon') }}</b>{{
        $t('manage.recent_sessions.tiny.ip_value', {
            ip: session.ip, city: ipPosition[session.ip] ? ipPosition[session.ip] : $t('loading')
        })
}}
                    </p>
                    <p><b>{{ $t('manage.recent_sessions.tiny.ua') }}{{ $t('manage.recent_sessions.tiny.colon') }}</b>{{
        session.uaParsed.browser
}}
                    </p>
                </div>
                <div class="operates">
                    <a @click="logOutSession(session.uuid)" v-if="session.uuid != user.token" href="javascript:">{{
        $t('manage.recent_sessions.operates.logout')
}}</a>
                    <span v-else>{{ $t('manage.recent_sessions.operates.this_session') }}</span>
                </div>
            </div>
        </div>
        <p v-if="onlineSessions && showSessionsNum != 0 && onlineSessions.length > showSessionsNum && !sessionDetailMode">
            <a href="javascript:" @click="showSessionsNum = 0">{{
        $t('manage.recent_sessions.show_all')
}}</a>
        </p>
        <p v-if="onlineSessions.length == 0">{{ $t('loading') }}...</p>
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
            sessionDetailMode: false,
            deviceIcon: {
                Windows: '<path d="M421.728 574.848l0 372-389.728-53.728 0-318.272 389.728 0zM421.728 150.272l0 376.576-389.728 0 0-322.848zM982.848 574.848l0 449.152-518.272-71.424 0-377.728 518.272 0zM982.848 73.152l0 453.728-518.272 0 0-382.272z" p-id="1333"></path>',
                Mac: '<path d="M557.1 361.3v-7.4l-22.9 1.6c-6.5 0.4-11.4 1.8-14.7 4.1-3.3 2.4-4.9 5.6-4.9 9.8 0 4.1 1.6 7.3 4.9 9.7 3.2 2.4 7.6 3.6 13 3.6 3.5 0 6.7-0.5 9.7-1.6 3-1.1 5.6-2.5 7.8-4.4 2.2-1.9 3.9-4.1 5.2-6.7 1.3-2.7 1.9-5.6 1.9-8.7zM512 64.2C262.1 64.2 64.2 262.1 64.2 512S262.1 959.8 512 959.8 959.8 761.9 959.8 512 761.9 64.2 512 64.2z m86.9 265.4c2.1-5.9 5.1-11 9-15.3 3.9-4.2 8.5-7.5 13.9-9.8s11.5-3.4 18.2-3.4c6 0 11.5 0.9 16.3 2.7 4.9 1.8 9 4.2 12.5 7.3 3.5 3 6.2 6.6 8.3 10.6 2 4.1 3.2 8.4 3.6 12.9h-18c-0.5-2.5-1.3-4.8-2.4-6.9-1.2-2.1-2.7-4-4.6-5.6-1.9-1.6-4.2-2.8-6.7-3.7-2.6-0.9-5.5-1.3-8.7-1.3-3.8 0-7.3 0.8-10.4 2.3-3.1 1.5-5.8 3.7-8 6.5s-3.9 6.2-5.1 10.3c-1.2 4-1.8 8.5-1.8 13.4 0 5.1 0.6 9.7 1.8 13.7 1.2 4 2.9 7.4 5.2 10.2 2.2 2.8 4.9 4.9 8.1 6.4 3.1 1.5 6.6 2.2 10.3 2.2 6.2 0 11.2-1.4 15-4.3 3.9-2.9 6.4-7.1 7.6-12.7h18c-0.5 4.9-1.9 9.4-4.1 13.5-2.2 4.1-5.1 7.5-8.5 10.4-3.5 2.9-7.6 5.1-12.4 6.6-4.7 1.6-10 2.4-15.6 2.4-6.7 0-12.8-1.1-18.3-3.3-5.4-2.2-10.1-5.4-14-9.6-3.9-4.2-6.9-9.2-9-15.2-2.1-6-3.2-12.7-3.2-20.2-0.1-7.5 0.9-14.1 3-20.1z m-255.8-27.2h18v16h0.3c1.1-2.7 2.5-5.1 4.3-7.1 1.8-2.1 3.8-3.9 6.1-5.4 2.3-1.5 4.9-2.6 7.6-3.4 2.8-0.8 5.7-1.2 8.8-1.2 6.6 0 12.2 1.6 16.7 4.7 4.6 3.2 7.8 7.7 9.7 13.6h0.5c1.2-2.8 2.8-5.4 4.8-7.6 2-2.2 4.2-4.2 6.8-5.8 2.5-1.6 5.4-2.8 8.4-3.6 3-0.8 6.2-1.3 9.6-1.3 4.6 0 8.8 0.7 12.6 2.2 3.8 1.5 7 3.6 9.7 6.3 2.7 2.7 4.8 6 6.2 9.8 1.4 3.8 2.2 8.1 2.2 12.8v64.3h-18.8V337c0-6.2-1.6-11-4.8-14.4-3.2-3.4-7.7-5.1-13.6-5.1-2.9 0-5.5 0.5-8 1.5-2.4 1-4.5 2.4-6.2 4.3-1.7 1.8-3.1 4-4.1 6.6-1 2.5-1.5 5.3-1.5 8.4v58.6H400v-61.4c0-2.7-0.4-5.2-1.3-7.4-0.8-2.2-2-4.1-3.6-5.7-1.6-1.6-3.5-2.8-5.7-3.6-2.2-0.8-4.7-1.3-7.5-1.3-2.9 0-5.6 0.5-8.1 1.6s-4.6 2.6-6.3 4.5c-1.8 1.9-3.2 4.2-4.1 6.8-0.9 2.6-2.5 5.4-2.5 8.5v57.9h-17.8v-94.4zM384 754.3c-82.6 0-134.3-57.4-134.3-148.9S301.4 456.3 384 456.3s134.1 57.6 134.1 149.1S466.5 754.3 384 754.3z m152.8-357.7c-3 0.8-6.2 1.2-9.3 1.2-4.7 0-9-0.7-12.9-2-3.9-1.3-7.3-3.2-10.1-5.7-2.8-2.4-5-5.4-6.6-8.8-1.6-3.5-2.4-7.3-2.4-11.5 0-8.3 3.1-14.8 9.3-19.4 6.2-4.7 15.1-7.4 26.8-8.1l25.5-1.5v-7.3c0-5.4-1.7-9.6-5.2-12.4-3.5-2.8-8.3-4.3-14.7-4.3-2.5 0-4.9 0.3-7.1 0.9-2.2 0.6-4.1 1.6-5.8 2.7-1.7 1.2-3.1 2.6-4.2 4.3-1.1 1.6-1.9 3.5-2.3 5.5h-17.7c0.1-4.2 1.1-8 3.1-11.6s4.6-6.6 7.9-9.2 7.3-4.6 11.8-6.1c4.5-1.4 9.5-2.2 14.8-2.2 5.7 0 10.9 0.7 15.6 2.2 4.7 1.5 8.7 3.5 12 6.2 3.3 2.7 5.8 5.9 7.6 9.7 1.8 3.8 2.7 8.1 2.7 12.7v64.8h-18V381h-0.5c-1.3 2.5-3 4.9-5.1 6.9-2.1 2.1-4.4 3.8-6.9 5.3-2.4 1.5-5.2 2.6-8.3 3.4z m118.8 357.7c-63 0-105.8-33-108.7-84.8h41c3.2 29.6 31.8 49.2 71 49.2 37.6 0 64.6-19.6 64.6-46.4 0-23.2-16.4-37.2-54.4-46.8l-37-9.2c-53.2-13.2-77.4-37.4-77.4-77.2 0-49 42.8-83 103.7-83 59.6 0 101.1 34.2 102.7 83.4h-40.6c-2.8-29.6-27-47.8-63-47.8-35.8 0-60.6 18.4-60.6 45 0 21 15.6 33.4 53.6 43l31.2 7.8c59.4 14.4 83.8 37.8 83.8 79.8 0 53.6-42.3 87-109.9 87zM384 493c-56.6 0-91.9 43.4-91.9 112.3 0 68.8 35.4 112.1 91.9 112.1 56.4 0 91.9-43.4 91.9-112.1 0-68.9-35.6-112.3-91.9-112.3z" p-id="1669"></path>',
                Linux: '<path d="M452.32912 234.848q-6.272 0.576-8.864 6.016t-4.864 5.44q-2.848 0.576-2.848-2.848 0-6.848 10.848-8.576l5.728 0zM502.05712 242.848q-2.272 0.576-6.56-3.712t-10.016-2.56q13.728-6.272 18.272 1.152 1.728 3.424-1.728 5.152zM301.48112 486.848q-2.272-0.576-3.424 1.728t-2.56 7.136-3.136 7.712-5.728 7.424q-4 5.728-0.576 6.848 2.272 0.576 7.136-4t7.136-10.272q0.576-1.728 1.152-4t1.152-3.424 0.864-2.56 0.288-2.272l0-1.728t-0.576-1.44-1.728-1.152zM790.05712 692q0-10.272-31.424-24 2.272-8.576 4.288-15.712t2.848-14.848 1.728-12.288 0.288-12.864-0.576-11.136-2.016-12.576-2.272-11.712-2.848-14.272-3.136-15.136q-5.728-27.424-26.848-58.848t-41.152-42.848q13.728 11.424 32.576 47.424 49.728 92.576 30.848 158.848-6.272 22.848-28.576 24-17.728 2.272-22.016-10.56t-4.576-47.712-6.56-61.152q-5.152-22.272-11.136-39.424t-11.136-26.016-8.864-14.016-7.424-8.576-4.288-4q-8-35.424-17.728-58.848t-16.864-32-13.44-18.848-8.576-22.848q-2.272-12 3.424-30.56t2.56-28.288-25.44-14.272q-8.576-1.728-25.44-10.272t-20.288-9.152q-4.576-0.576-6.272-14.848t4.576-29.152 20.576-15.424q21.152-1.728 29.152 17.152t2.272 33.152q-6.272 10.848-1.152 15.136t17.152 0.288q7.424-2.272 7.424-20.576l0-21.152q-2.848-17.152-7.712-28.576t-12-17.44-13.44-8.576-15.424-4.288q-61.152 4.576-50.848 76.576 0 8.576-0.576 8.576-5.152-5.152-16.864-6.016t-18.848 0.288-8.864-2.848q0.576-32.576-9.152-51.424t-25.728-19.424q-15.424-0.576-23.712 15.712t-9.44 34.016q-0.576 8.576 2.016 21.152t7.424 21.44 8.864 7.712q5.728-1.728 9.152-8 2.272-5.152-4-4.576-4 0-8.864-8.288t-5.44-19.136q-0.576-12.576 5.152-21.152t19.424-8q9.728 0 15.424 12t5.44 22.272-0.864 12.576q-12.576 8.576-17.728 16.576-4.576 6.848-15.712 13.44t-11.712 7.136q-7.424 8-8.864 15.424t4.288 10.272q8 4.576 14.272 11.136t9.152 10.848 10.56 7.424 20.288 3.712q26.848 1.152 58.272-8.576 1.152-0.576 13.152-4t19.712-6.016 16.864-7.424 12-10.016q5.152-8 11.424-4.576 2.848 1.728 3.712 4.864t-1.728 6.848-9.44 5.44q-11.424 3.424-32.288 12.288t-26.016 11.136q-25.152 10.848-40 13.152-14.272 2.848-45.152-1.152-5.728-1.152-5.152 1.152t9.728 10.848q14.272 13.152 38.272 12.576 9.728-0.576 20.576-4t20.576-8 19.136-10.016 17.152-9.728 14.016-6.848 10.016-1.44 4.864 6.272q0 1.152-0.576 2.56t-2.272 2.848-3.424 2.56-4.864 2.848-5.152 2.56-5.728 2.848-5.44 2.56q-16 8-38.56 25.152t-38.016 24.576-28 0.576q-12-6.272-36-41.728-12.576-17.728-14.272-12.576-0.576 1.728-0.576 5.728 0 14.272-8.576 32.288t-16.864 31.712-12 33.152 6.56 36q-13.152 3.424-35.712 51.424t-27.136 80.576q-1.152 10.272-0.864 39.424t-3.136 33.728q-4.576 13.728-16.576 1.728-18.272-17.728-20.576-53.728-1.152-16 2.272-32 2.272-10.848-0.576-10.272l-2.272 2.848q-20.576 37.152 5.728 94.848 2.848 6.848 14.272 16t13.728 11.424q11.424 13.152 59.424 51.712t53.152 43.712q9.152 8.576 10.016 21.728t-8 24.576-26.016 13.152q4.576 8.576 16.576 25.44t16 30.848 4 40.288q26.272-13.728 4-52.576-2.272-4.576-6.016-9.152t-5.44-6.848-1.152-3.424q1.728-2.848 7.424-5.44t11.424 1.44q26.272 29.728 94.848 20.576 76-8.576 101.152-49.728 13.152-21.728 19.424-17.152 6.848 3.424 5.728 29.728-0.576 14.272-13.152 52.576-5.152 13.152-3.424 21.44t13.728 8.864q1.728-10.848 8.288-44t7.712-51.424q1.152-12-3.712-42.016t-4.288-55.424 13.152-40.288q8.576-10.272 29.152-10.272 0.576-21.152 19.712-30.272t41.44-6.016 34.272 12.864zM431.20912 219.424q1.728-9.728-1.44-17.152t-6.56-8.576q-5.152-1.152-5.152 4 1.152 2.848 2.848 3.424 5.728 0 4 8.576-1.728 11.424 4.576 11.424 1.728 0 1.728-1.728zM670.63312 332q-1.152-4.576-3.712-6.56t-7.424-2.848-8.288-3.136q-2.848-1.728-5.44-4.576t-4-4.576-3.136-3.712-2.272-2.272-2.272 0.864q-8 9.152 4 24.864t22.272 18.016q5.152 0.576 8.288-4.576t2.016-11.424zM568.90512 210.272q0-6.272-2.848-11.136t-6.272-7.136-5.152-1.728q-8 0.576-4 4l2.272 1.152q8 2.272 10.272 17.728 0 1.728 4.576-1.152zM599.75312 77.152q0-1.152-1.44-2.848t-5.152-4-5.44-3.424q-8.576-8.576-13.728-8.576-5.152 0.576-6.56 4.288t-0.576 7.424-0.288 7.136q-0.576 2.272-3.424 6.016t-3.424 5.152 1.728 4.864q2.272 1.728 4.576 0t6.272-5.152 8.576-5.152q0.576-0.576 5.152-0.576t8.576-1.152 5.152-4zM922.63312 843.424q11.424 6.848 17.728 14.016t6.848 13.728-1.44 12.864-8.864 12.576-13.44 11.136-17.152 10.56-18.016 9.44-18.272 8.864-15.424 7.424q-21.728 10.848-48.864 32t-43.136 36.576q-9.728 9.152-38.848 11.136t-50.848-8.288q-10.272-5.152-16.864-13.44t-9.44-14.56-12.576-11.136-26.848-5.44q-25.152-0.576-74.272-0.576-10.848 0-32.576 0.864t-33.152 1.44q-25.152 0.576-45.44 8.576t-30.56 17.152-24.864 16.288-30.56 6.56q-16.576-0.576-63.424-17.728t-83.424-24.576q-10.848-2.272-29.152-5.44t-28.576-5.152-22.56-5.44-19.136-8.288-9.728-11.136q-5.728-13.152 4-38.016t10.272-31.136q0.576-9.152-2.272-22.848t-5.728-24.288-2.56-20.864 6.016-15.424q8-6.848 32.576-8t34.272-6.848q17.152-10.272 24-20t6.848-29.152q12 41.728-18.272 60.576-18.272 11.424-47.424 8.576-19.424-1.728-24.576 5.728-7.424 8.576 2.848 32.576 1.152 3.424 4.576 10.272t4.864 10.272 2.56 9.728 0.576 12.576q0 8.576-9.728 28t-8 27.424q1.728 9.728 21.152 14.848 11.424 3.424 48.288 10.56t56.864 11.712q13.728 3.424 42.272 12.576t47.136 13.152 31.712 2.272q24.576-3.424 36.864-16t13.152-27.424-4.288-33.44-10.848-29.728-11.424-20.864q-69.152-108.576-96.576-138.272-38.848-42.272-64.576-22.848-6.272 5.152-8.576-8.576-1.728-9.152-1.152-21.728 0.576-16.576 5.728-29.728t13.728-26.848 12.576-24q4.576-12 15.136-41.152t16.864-44.576 17.152-34.848 22.272-30.848q62.848-81.728 70.848-111.424-6.848-64-9.152-177.152-1.152-51.424 13.728-86.56t60.576-59.712q22.272-12 59.424-12 30.272-0.576 60.576 7.712t50.848 23.712q32.576 24 52.288 69.44t16.864 84.288q-2.848 54.272 17.152 122.272 19.424 64.576 76 124.576 31.424 33.728 56.864 93.152t34.016 109.152q4.576 28 2.848 48.288t-6.848 31.712-11.424 12.576q-5.728 1.152-13.44 10.848t-15.424 20.288-23.136 19.136-34.848 8q-10.272-0.576-18.016-2.848t-12.864-7.712-7.712-8.864-6.56-11.712-5.152-11.136q-12.576-21.152-23.424-17.152t-16 28 4 55.424q11.424 40 0.576 111.424-5.728 37.152 10.272 57.44t41.728 18.848 48.576-20.288q33.728-28 51.136-38.016t59.136-24.288q30.272-10.272 44-20.864t10.56-19.712-14.272-16.288-29.44-13.44q-18.848-6.272-28.288-27.424t-8.576-41.44 8.864-27.136q0.576 17.728 4.576 32.288t8.288 23.136 11.712 16.288 12 10.848 12.288 7.424 9.44 5.44z" p-id="2303"></path>',
                Android: '<path d="M391.283772 275.991375q9.151714 0 15.711509-6.559795t6.559795-15.711509-6.559795-15.711509-15.711509-6.559795-15.423518 6.559795-6.271804 15.711509 6.271804 15.711509 15.423518 6.559795zM632.396238 275.991375q9.151714 0 15.423518-6.559795t6.271804-15.711509-6.271804-15.711509-15.423518-6.559795-15.711509 6.559795-6.559795 15.711509 6.559795 15.711509 15.711509 6.559795zM168.410737 381.140089q23.99925 0 41.150714 17.151464t17.151464 41.150714l0 245.720321q0 24.575232-16.863473 41.726696t-41.438705 17.151464-41.726696-17.151464-17.151464-41.726696l0-245.720321q0-23.99925 17.151464-41.150714t41.726696-17.151464zM774.119809 391.98775l0 380.564107q0 26.271179-18.271429 44.574607t-43.998625 18.271429l-42.846661 0 0 129.723946q0 24.575232-17.151464 41.726696t-41.726696 17.151464-41.726696-17.151464-17.151464-41.726696l0-129.723946-78.845536 0 0 129.723946q0 24.575232-17.151464 41.726696t-41.726696 17.151464q-23.99925 0-41.150714-17.151464t-17.151464-41.726696l-0.575982-129.723946-42.270679 0q-26.271179 0-44.574607-18.271429t-18.271429-44.574607l0-380.564107 524.559608 0zM641.547952 160.570982q61.150089 31.423018 97.724946 87.709259t36.574857 123.132152l-528.559483 0q0-66.845911 36.574857-123.132152t98.268929-87.709259l-40.574732-74.845661q-3.999875-7.423768 2.847911-11.423643 7.423768-3.423893 11.423643 3.423893l41.150714 75.421643q54.270304-23.99925 114.844411-23.99925t114.844411 23.99925l41.150714-75.421643q3.999875-6.847786 11.423643-3.423893 6.847786 3.999875 2.847911 11.423643zM914.115434 439.410268l0 245.720321q0 24.575232-17.151464 41.726696t-41.726696 17.151464q-23.99925 0-41.150714-17.151464t-17.151464-41.726696l0-245.720321q0-24.575232 17.151464-41.438705t41.150714-16.863473q24.575232 0 41.726696 16.863473t17.151464 41.438705z" p-id="3239"></path>',
                iPhone: '<path d="M664.9 959.8c35.8 0 65.5-29.3 65.5-65.3v-765c0-35.8-29.3-65.3-65.3-65.3H358.9c-36 0-65.3 29.3-65.3 65.3v765.1c0 36 29.7 65.3 65.5 65.3h305.8zM568.8 92.6c4.6 0 8.3 3.7 8.3 8.3 0 4.6-3.7 8.3-8.3 8.3-4.6 0-8.3-3.7-8.3-8.3 0-4.6 3.7-8.3 8.3-8.3z m-94.4 8c0-0.9 0.2-3.9 4.2-3.9h59.9c3.9 0 4.2 3.1 4.2 3.9v0.7c0 0.9-0.2 3.9-4.2 3.9h-59.9c-3.9 0-4.2-3.1-4.2-3.9v-0.7z m124.5 29.1c15.9 0 21-9.6 22.3-18.1 0.2-1.3 0-17 0-17.7 0.7-5.5 6.3-7.4 9.6-7.9h38.4c21.6 0 39.3 17.7 39.3 39.3v773.4c0 21.6-17.7 39.3-39.3 39.3H354.7c-21.6 0-39.3-17.7-39.3-39.3V125.3c0-21.6 17.7-39.3 39.3-39.3h38.4c3.3 0.4 9 2.4 9.6 7.9 0 0.4-0.2 16.4 0 17.7 1.5 8.5 6.6 18.1 22.3 18.1h173.9z" p-id="1115"></path>',
                iPad: '<path d="M797.6 63.8H226.4c-15.3-0.2-28 12.1-28.2 27.4v840.9c-0.1 15.4 12.2 27.9 27.6 28h571.7c15.4 0.2 28-12.1 28.2-27.4V91.8c0.1-15.3-12.2-27.9-27.6-28h-0.5zM512 97.4c6.2 0 11.2 5 11.2 11.2 0 6.2-5 11.2-11.2 11.2-6.2 0-11.2-5-11.2-11.2 0-6.1 5-11.2 11.2-11.2z m0 840.4c-12.4 0-22.4-10-22.4-22.4 0-12.4 10-22.4 22.4-22.4 12.4 0 22.4 10 22.4 22.4 0 12.3-10 22.4-22.4 22.4z m268.9-67.3H243.1v-717h537.8v717z" p-id="976"></path>',
                iPod: '<path d="M654.4 63.9H371.1c-39.8-2.6-74.2 27.6-76.7 67.4-0.2 2.5-0.2 5.1-0.1 7.6v746.2c-1.6 39.9 29.3 73.5 69.2 75.1 2.5 0.1 5.1 0.1 7.6-0.1h283.2c39.7 1.9 73.4-28.8 75.3-68.5 0.1-2.2 0.1-4.4 0-6.6V138.9c1.9-39.6-28.6-73.2-68.2-75-2.3-0.2-4.7-0.2-7 0z m-141.9 845c-14.1 0-25.6-11.5-25.6-25.6s11.5-25.6 25.6-25.6c14.1 0 25.6 11.5 25.6 25.6s-11.5 25.6-25.6 25.6z m191.6-76.8H319.9V191.9H704v640.2z m-179.3-704c0 7.1-5.7 12.8-12.8 12.8-7.1 0-12.8-5.7-12.8-12.8 0-7.1 5.7-12.8 12.8-12.8 7.1 0 12.8 5.8 12.8 12.8z" p-id="1254"></path>',
                'Apple Watch': '<path d="M757.3 469.3V362.7H736v-35.6c0-16.2-4.4-32.1-12.6-46.1-8.5-14.5-23.7-26.9-32.8-41.2-12.9-19.6-22.3-41.2-27.9-64-5.8-24.5-4.1-49.9-9-74.6-3.6-17-18.4-29.4-35.8-29.9-19.8-2.8-39.9-4.3-59.9-5.5-20-1.3-42-1.7-62.9-1.7-39.9-0.9-79.9 2.2-119.2 9.2-11.8 3-20.9 12.4-23.7 24.3-2.3 11.5-4.3 39.7-6.4 56.1-2.6 35.1-16.7 68.4-40.1 94.7l-9.8 10.9c-18.4 17.8-28.9 42.2-29 67.8v369.8c-0.5 26 10.3 51 29.6 68.5 27.6 21.3 45 53.1 48 87.9 3.8 24.7 1.1 49.7 6 73.8 3.9 12.3 14.2 21.4 26.9 23.7 42.8 7 86.1 10 129.4 9.2 39.9 0.9 79.9-2.2 119.2-9.2 12.2-2.7 21.8-12.1 24.7-24.3 2.3-11.5-3-67.6 16.8-101.5 7-11.9 37.1-56.9 37.1-56.9s3.4-4.7 4.3-5.5c17-17.6 26.7-41 27.1-65.5V469.3h21.3z m-42.7 227.6c1.5 37.1-26.9 68.6-64 71H352.1c-37.1-2.3-65.6-33.9-64-71V327.1c-1.5-37.1 26.9-68.6 64-71h298.6c37.1 2.4 65.4 33.9 64 71v369.8z" p-id="1393"></path>',
            },
            showSessionsNum: 4,
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    inject: ['defaultSwal'],
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
      uuid
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
                this.onlineSessions = data.User.getSession.reverse();
                const relativeTime = ['createAt', 'updateAt'];
                this.onlineSessions.forEach((element) => {
                    this.getIpLoc(element.ip);
                    // eslint-disable-next-line no-param-reassign
                    element.uaParsed = this.getUA(element.ua);
                    relativeTime.forEach((time) => {
                        // eslint-disable-next-line no-param-reassign
                        element[`${time}Relative`] = this.getRelativeTime(element[time]);
                    });
                });
            }, (error) => {
                console.log(error);
            });
        },
        logOutSession(session) {
            this.defaultSwal.fire({ title: this.$t('manage.recent_sessions.operates.logout_confirm'), showCancelButton: true }).then((result) => {
                if (result.isConfirmed) {
                    apolloClient.query({
                        query: gql`query User($token: String, $logoutSessionToken2: String) {
  User(token: $token) {
    logoutSession(token: $logoutSessionToken2)
  }
}`,
                        variables: {
                            token: this.user.token,
                            logoutSessionToken2: session,
                        },
                    }).then(({ data }) => {
                        console.log(data);
                        this.getActiveSessions();
                    }, (error) => {
                        console.log(error);
                        this.defaultSwal.fire(this.$t('manage.recent_sessions.operates.logout_fail'));
                    });
                }
            });
        },
        logOutAllSessions() {
            this.defaultSwal.fire({ title: this.$t('manage.recent_sessions.operates.logout_all_confirm'), showCancelButton: true }).then((result) => {
                if (result.isConfirmed) {
                    apolloClient.query({
                        query: gql`query User($token: String) {
  User(token: $token) {
    logoutAll
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
                        this.defaultSwal.fire(this.$t('manage.recent_sessions.operates.logout_fail'));
                    });
                }
            });
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
        getUA(ua) {
            if (!ua) {
                return {
                    browser: this.$t('unknown'),
                    os: this.$t('unknown'),
                    device: this.$t('unknown'),
                    deviceDetail: {},
                };
            }
            const returnua = {};
            if (ua.indexOf('Edg') > -1) {
                returnua.browser = 'Microsoft Edge (Chromium)';
            } else if (ua.indexOf('Opera') > -1) {
                returnua.browser = 'Opera';
            } else if (ua.indexOf('Firefox') > -1) {
                returnua.browser = 'Mozilla FireFox';
            } else if (ua.indexOf('Chrome') > -1) {
                returnua.browser = 'Google Chrome';
            } else if (ua.indexOf('Safari') > -1) {
                returnua.browser = 'Apple Safari';
            } else if (ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1 && !(ua.indexOf('Opera') > -1)) {
                returnua.browser = 'Internet Explorer';
            } else if (ua.indexOf('Trident') > -1) {
                returnua.browser = 'Microsoft Edge (Legacy)';
            } else returnua.browser = this.$t('unknown');
            // device
            if (ua.indexOf('Android') > -1) {
                returnua.device = 'Android';
            } else if (ua.indexOf('iPad') > -1) {
                returnua.device = 'iPad';
            } else if (ua.indexOf('iPhone') > -1) {
                returnua.device = 'iPhone';
            } else if (ua.indexOf('iPod') > -1) {
                returnua.device = 'iPod';
            } else if (ua.indexOf('Watch OS') > -1 || ua.indexOf('WatchOS') > -1) {
                returnua.device = 'Apple Watch';
            } else if (ua.indexOf('Windows') > -1) {
                returnua.device = 'Windows';
            } else if (ua.indexOf('Macintosh') > -1) {
                returnua.device = 'Mac';
            } else if (ua.indexOf('Linux') > -1) {
                returnua.device = 'Linux';
            } else returnua.device = this.$t('unknown');
            // eslint-disable-next-line prefer-destructuring
            returnua.deviceDetail = ua.split('(')[1].split(')')[0];
            return returnua;
        },
        getRelativeTime(time) {
            const now = new Date();
            const diff = now.getTime() - new Date(time).getTime();
            const day = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hour = Math.floor(diff / (1000 * 60 * 60));
            const minute = Math.floor(diff / (1000 * 60));
            const second = Math.floor(diff / 1000);
            if (day > 0) {
                return `${day} ${this.$tc('time.relative.day', day)}`;
            } if (hour > 0) {
                return `${hour} ${this.$tc('time.relative.hour', hour)}`;
            } if (minute > 0) {
                return `${minute} ${this.$tc('time.relative.minute', minute)}`;
            } if (second > 0) {
                return `${second} ${this.$tc('time.relative.second', second)}`;
            }
            return this.$t('time.relative.just_now');
        },
    },
    components: {},
};
</script>
<style scoped lang="scss">
.tinySessionList {
    display: flex;
    flex-direction: column;
    padding: 0px 5px 0px 0px;
    margin-top: -2px;
    overflow: auto;
    overflow: overlay;
    transition: width .2s;

    .tinySession {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px 0;
        justify-content: space-between;

        svg {
            font-size: 28px;
            width: 28px;
            margin: 0 18px 0 3px;
            flex-grow: 0;
            flex-shrink: 0;
        }

        .operates {
            text-align: right;
            flex-grow: 1;
            flex-shrink: 0;
        }
    }
}
</style>
