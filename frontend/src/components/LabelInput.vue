<template>
    <div class="labelInput" :autofocus="autofocus" :readonly="readonly" :disabled="disabled">
        <label :class="{ isFocus: focus, isEmpty: inputVal == '', enableScale: enablescale == 'false' ? false : true }">
            {{ $t(label) }}</label>
        <div :class="{ innerInput: true, isFocus: focus, isEmpty: inputVal == '', enableScale: enablescale == 'false' ? false : true }">
            <textarea v-if="type == 'textarea'" v-model="inputVal" :type="type" :autofocus="autofocus"
                :readonly="readonly" :disabled="disabled" @focus="this.focus = true" @blur="this.focus = false"
                @change="push()"></textarea>
            <input v-else v-model="inputVal" :type="type" :autofocus="autofocus" :readonly="readonly"
                :disabled="disabled" @focus="this.focus = true" @blur="this.focus = false" @change="push()" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'LabelInput',
    data() {
        return {
            focus: false,
            inputVal: '',
        };
    },
    props: {
        label: {
            type: String,
            default: '',
        },
        model: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        enablescale: {
            type: Boolean,
            default: true,
        },
        autofocus: {
            type: Boolean,
            default: false,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        value: {
            type: String,
            default: '',
        },
    },
    mounted() {
        this.inputVal = this.value;
    },
    watch: {
        value: {
            handler() {
                this.inputVal = this.value;
            },
            deep: true,
        },
    },
    methods: {
        push() {
            this.$emit('getdata', this.model, this.inputVal);
        },
    },
};
</script>
