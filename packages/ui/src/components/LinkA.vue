<template>
    <div class="linkA">
        <span>{{ text }}</span>
        <font-awesome-icon :icon="['fas', 'angle-right']" />
    </div>
</template>

<script>
export default {
    name: 'LinkA',
    props: {
        text: {
            type: String,
            required: true,
        },
    },
    mounted() {
    },
    methods: {
    },
};
</script>
