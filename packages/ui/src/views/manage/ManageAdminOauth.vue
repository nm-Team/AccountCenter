<template>
    <h1>{{ $t('manage.admin_oauth_manager.title') }}</h1>
    <div class="block">
        <div class="btns">
            <div class="left">
                <button class="blockButton" @click="createNewClient()">
                    {{ $t('manage.admin_oauth_manager.create_new_client') }}</button>
            </div>
            <div class="right">
                <LabelInput :type="'select'" :label="$t('manage.admin_oauth_manager.filter_label')"
                    :title="$t('manage.admin_oauth_manager.filter_label')" enablescale="true" fitbutton="true"
                    autosetwidth="true" :option="filterOption" :value="filter"></LabelInput>
                <LabelInput :type="'text'" :label="$t('manage.admin_oauth_manager.search_label')"
                    :title="$t('manage.admin_oauth_manager.search_label')" enablescale="true" fitbutton="true"
                    autosetwidth="true" :value="oauthSearchWord" @input="filterValue = $event"></LabelInput>
            </div>
        </div>
        <div class="table">
            <table class="oauthManagerTable">
                <thead>
                    <td style="min-width: 8em;">{{ $t('manage.admin_oauth_manager.client_id') }}</td>
                    <td style="min-width: 8em;">{{ $t('manage.admin_oauth_manager.client_name') }}</td>
                    <td style="min-width: 8em;">{{ $t('manage.admin_oauth_manager.creator') }}</td>
                    <td style="min-width: 8em;">{{ $t('manage.admin_oauth_manager.client_secret') }}</td>
                    <td style="min-width: 18em;">{{ $t('manage.admin_oauth_manager.redirect_uri') }}</td>
                    <td style="min-width: 11em;">{{ $t('manage.admin_oauth_manager.scope') }}</td>
                    <td style="min-width: 5em;">{{ $t('manage.admin_oauth_manager.action') }}</td>
                </thead>
                <tbody>
                    <tr v-for="item in oauthAppList" :key="item.client_id">
                        <td>{{ item.client_id }}</td>
                        <td>{{ item.client_name }}</td>
                        <td>{{ item.creator }}</td>
                        <td>{{ item.client_secret }}</td>
                        <td>{{ item.redirect_uri }}</td>
                        <td>{{ item.scope }}</td>
                        <td>
                            <button class="btn btn-primary">{{ $t('manage.admin_oauth_manager.edit') }}</button>
                            <button class="btn btn-danger">{{ $t('manage.admin_oauth_manager.delete') }}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
// import { gql } from 'apollo-boost';

// eslint-disable-next-line import/no-cycle
// import { apolloClient } from '../../main';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ManageAdminOAuth',
    data() {
        return {
            oauthAppList: [
                {
                    client_id: '123456789',
                    client_name: 'test',
                    creator: 'test',
                    client_secret: '123456789',
                    redirect_uri: 'http://localhost:8080',
                    scope: 'profile',
                },
                {
                    client_id: '123456789',
                    client_name: 'test',
                    creator: 'test',
                    client_secret: '123456789',
                    redirect_uri: 'http://localhost:8080',
                    scope: 'profile',
                },
                {
                    client_id: '123456789',
                    client_name: 'test',
                    creator: 'test',
                    client_secret: '123456789',
                    redirect_uri: 'http://localhost:8080',
                    scope: 'profile',
                },
            ],
            filterOption: [
                {
                    value: 'all',
                    label: this.$t('manage.admin_oauth_manager.filter_all'),
                },
                {
                    value: 'official',
                    label: this.$t('manage.admin_oauth_manager.filter_official'),
                },
                {
                    value: 'unofficial',
                    label: this.$t('manage.admin_oauth_manager.filter_unofficial'),
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
    inject: ['defaultSwal'],
    watch: {
    },
    mounted() {
    },
    methods: {
    },
    components: {},
};
</script>
<style lang="scss" scoped>
.oauthManagerTable {
    .btn {
        margin: 0 5px 0 0;
        display: inline;
        color: var(--a);
        background: none;
        border: none;
        font-size: 15px;
        cursor: pointer;

        &.btn-primary {
            font-weight: bold;
        }

        &.btn-danger {
            color: var(--warn);
        }
    }

}
</style>
