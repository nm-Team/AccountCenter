<template>
    Manage Main Page Template<br />
    Here's test user info:<br />
    {{ user }}
</template>
<script>
import { gql } from 'apollo-boost';

import LabelInput from '../../components/LabelInput.vue';
// eslint-disable-next-line import/no-cycle
import { apolloClient } from '../../main';
import { getSessions } from '../../sessions';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ManageMain',
    data() {
        return {
        };
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    methods: {
    },
    components: {},
};
</script>
