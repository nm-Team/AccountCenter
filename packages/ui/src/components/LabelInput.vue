<template>
    <div :class="{ labelInput: true, autoSetWidth: autosetwidth }" :autofocus="autofocus" :readonly="readonly"
        :disabled="disabled">
        <label
            :class="{ isFocus: focus, isEmpty: inputVal == '', enableScale: enablescale == 'false' ? false : true, fitButton: fitbutton }">
            {{ $t(label) }}</label>
        <div
            :class="{ innerInput: true, isFocus: focus, isEmpty: inputVal == '', enableScale: enablescale == 'false' ? false : true, fitButton: fitbutton }">
            <textarea v-if="type == 'textarea'" v-model="inputVal" :type="type" :autofocus="autofocus"
                :readonly="readonly" :disabled="disabled" @focus="this.focus = true; this.$emit('focus')"
                @blur="this.focus = false; this.$emit('blur')" @change="push(); this.$emit('change')"></textarea>
            <select v-else-if="type == 'select'" v-model="inputVal" :type="type" :autofocus="autofocus"
                :readonly="readonly" :disabled="disabled" @focus="this.focus = true; this.$emit('focus')"
                @blur="this.focus = false; this.$emit('blur')" @change="push(); this.$emit('change')">
                <option v-for="item in option" :value="item.value" :key="item.value">{{ item.label }}</option>
            </select>
            <input v-else v-model="inputVal" :type="type" :autofocus="autofocus" :readonly="readonly"
                :disabled="disabled" @focus="this.focus = true; this.$emit('focus')"
                @blur="this.focus = false; this.$emit('blur')" @change="push(); this.$emit('change')" />
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
        fitbutton: {
            type: Boolean,
            default: false,
        },
        autosetwidth: {
            type: Boolean,
            default: false,
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
        option: {
            type: Array,
            default: () => [],
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
        label: {
            handler() {
                this.inputVal = this.value;
            },
            deep: true,
        },
        model: {
            handler() {
                this.inputVal = this.value;
            },
            deep: true,
        },
        type: {
            handler() {
                this.inputVal = this.value;
            },
            deep: true,
        },
        enablescale: {
            handler() {
                this.inputVal = this.value;
            },
            deep: true,
        },
        fitbutton: {
            handler() {
                this.inputVal = this.value;
            },
            deep: true,
        },
        autofocus: {
            handler() {
                this.inputVal = this.value;
            },
            deep: true,
        },
        autosetwidth: {
            handler() {
                this.inputVal = this.value;
            },
            deep: true,
        },
        readonly: {
            handler() {
                this.inputVal = this.value;
            },
            deep: true,
        },
        disabled: {
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
<style lang="scss" scoped>
.labelInput {
    width: 100%;
    position: relative;
    display: flex;

    &.autoSetWidth {
        width: auto;
    }

    label {
        position: absolute;
        top: 16px;
        left: 11px;
        font-size: 16px;
        pointer-events: none;
        color: var(--label-input-label-inactive);
        background-color: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        max-width: 80%;
        transition: all .2s, background-color 0s .05s, color 0s;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;

        &.fitButton {
            top: 14px;
        }
    }

    label.isFocus.enableScale.isEmpty:not(readonly):not(disabled),
    label.enableScale:not(.isEmpty):not(readonly):not(disabled) {
        top: 3px;
        left: 7px;
        font-size: 13.6px;
        padding: 0 4px 0 4px;
        line-height: 1;
        background-color: var(--frame-background);
        opacity: 1;
        transition: all .2s, background-color 0s .08s, color 0s;
        flex-grow: 1;
    }

    label.isFocus.enableScale {
        color: var(--label-input-label-active);
    }

    label:not(.enableScale):not(.isEmpty) {
        display: none;
    }

    .innerInput {
        width: 100%;
        padding: 5px 1px;
        margin: 10px 0;
        border: 1px solid var(--input-border);
        border-radius: 4px;

        &.fitButton {
            padding: 4px 1px;
            margin: 8px 0;
        }

        &.isFocus {
            outline: none;
            border-width: 2px;
            border-color: var(--input-border-focus);
            padding: 4px 0;

        }

        &.isFocus.fitButton {
            padding: 3px 0;
        }
    }

    input[type=text],
    input[type=password],
    textarea {
        width: calc(100% - 20px);
        padding: 2px 4px;
        margin: 2px 6px;
        background: none;
        font-size: 16px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        resize: vertical;
    }

    textarea {
        height: 3em;
    }

    input[type=text]:focus,
    input[type=password]:focus,
    textarea:focus {
        outline: none;
    }

    select {
        width: calc(100% - 10px);
        padding: 2px 0;
        margin: 2px 5px;
        background: none;
        font-size: 16px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        resize: vertical;
        outline: none;

        option {
            background-color: var(--frame-background);
            color: var(--text-color);
        }
    }
}
</style>
