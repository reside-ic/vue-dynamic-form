<template>
    <div>
        <tree-select :multiple="true"
                     :clearable="false"
                     :aria-label="formControl.label ? formControl.label : groupLabel"
                     v-model="value"
                     :options="formControl.options" 
                     :placeholder="selectText"></tree-select>
        <input type="hidden" :value="formControl.value" :name="formControl.name"/>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {MultiSelectControl} from "./types";
    import TreeSelect from '@riophae/vue-treeselect';

    interface Props {
        formControl: MultiSelectControl
        selectText?: string
        groupLabel: string
    }

    interface Computed {
        value: string[]
    }

    export default Vue.extend<{}, {}, Computed, Props>({
        name: "DynamicFormMultiSelect",
        model: {
            prop: "formControl",
            event: "change"
        },
        props: {
            formControl: {
                type: Object
            },
            selectText: String,
            groupLabel: String
        },
        computed: {
            value: {
                get() {
                    if (Array.isArray(this.formControl.value)) {
                        return this.formControl.value
                    }
                    if (typeof this.formControl.value == "string") {
                        return [this.formControl.value]
                    }
                    return []
                },
                set(newVal: string[]) {
                    this.$emit("change", {...this.formControl, value: newVal});
                }
            },
        },
        components: {
            TreeSelect
        }
    })
</script>
