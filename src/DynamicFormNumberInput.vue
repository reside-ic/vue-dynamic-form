<template>
    <b-form-input :name="formControl.name"
                  :aria-label="formControl.label ? formControl.label : groupLabel"
                  type="number"
                  :number="true"
                  v-model="value"
                  :min="formControl.min"
                  :max="formControl.max"
                  :step="formControl.step"
                  :required="formControl.required"></b-form-input>
</template>

<script lang="ts">
    import Vue from "vue";
    import {BFormInput} from "bootstrap-vue";
    import {NumberControl} from "./types";

    interface Props {
        formControl: NumberControl
        groupLabel: string
    }

    interface Computed {
        value: number | null | undefined
    }

    export default Vue.extend<{}, {}, Computed, Props>({
        name: "DynamicFormNumberInput",
        model: {
            prop: "formControl",
            event: "change"
        },
        props: {
            formControl: {
                type: Object
            },
            groupLabel: String
        },
        computed: {
            value: {
                get() {
                    return this.formControl.value;
                },
                set(newVal: number) {
                    this.$emit("change", {...this.formControl, value: newVal});
                }
            },
        },
        components: {
            BFormInput
        }
    })
</script>
