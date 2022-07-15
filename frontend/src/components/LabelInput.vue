<template>
    <div class="labelInput">
        <label :class="{ isFocus: focus, isEmpty: inputVal == '', enableScale: enablescale == 'false' ? false : true }">
            {{ $t(label) }}</label>
        <input v-model="inputVal" :type="type" @focus="this.focus = true" @blur="this.focus = false" @change="push()" />
    </div>
</template>

<script>
export default {
    name: 'LabelInput',
    data() {
        return {
            focus: false,
            inputVal: '',
        }
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
    },
    methods: {
        push() {
            this.$emit('getdata', this.model, this.inputVal);
        },
    }
}
</script>