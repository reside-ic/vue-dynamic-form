<template>
    <div>
        <h3 @click="toggleSection" :class="{'cursor-pointer': controlSection.collapsible}">
            {{controlSection.label}}
            <component v-if="controlSection.collapsible"
                       style="vertical-align: initial"
                       :is="chevronComponent"></component>
        </h3>
        <b-collapse v-model="open">
            <p v-if="controlSection.description" class="text-muted">{{controlSection.description}}</p>
            <dynamic-form-control-group v-for="(group, index) in controlSection.controlGroups"
                                        :key="index"
                                        :control-group="group"
                                        :readonly="readonly"
                                        @confirm="confirm"
                                        :required-text="requiredText"
                                        :select-text="selectText"
                                        @change="change($event, index)"></dynamic-form-control-group>
            <b-row v-if="controlSection.documentation" class="documentation mb-4">
                <b-col>
                    <a href="#" @click="toggleDocumentation">
                        <info-icon></info-icon>
                        How to use these settings
                        <component style="vertical-align: top"
                                   :is="documentationChevronComponent"></component>
                    </a>
                    <b-collapse v-model="showDocumentation">
                        <div class="my-1" v-html="controlSection.documentation"></div>
                    </b-collapse>
                </b-col>
            </b-row>
        </b-collapse>
    </div>
</template>

<script lang="ts">

    import Vue from "vue";
    import DynamicFormControlGroup from "./DynamicFormControlGroup.vue";
    import {DynamicControlGroup, DynamicControlSection} from "./types";
    import {InfoIcon, ChevronDownIcon, ChevronUpIcon} from "vue-feather-icons";
    import {BCollapse, BRow, BCol} from "bootstrap-vue";

    interface Methods {
        change: (newVal: DynamicControlGroup, index: number) => void
        toggleDocumentation: (e: Event) => void
        toggleSection: () => void
        confirm: (e: Event) => void
    }

    interface Props {
        controlSection: DynamicControlSection
        requiredText?: string
        selectText?: string
        readonly: boolean
    }

    interface Data {
        open: boolean
        showDocumentation: boolean
    }

    export default Vue.extend<Data, Methods, {}, Props>({
        name: "DynamicFormControlSection",
        data() {
            return {
                showDocumentation: false,
                open: true
            }
        },
        props: {
            controlSection: {
                type: Object
            },
            requiredText: String,
            selectText: String,
            readonly: Boolean
        },
        model: {
            prop: "controlSection",
            event: "change"
        },
        computed: {
            chevronComponent() {
                if (this.open) {
                    return "chevron-up-icon"
                }
                return "chevron-down-icon"
            },
            documentationChevronComponent() {
                if (this.showDocumentation) {
                    return "chevron-up-icon"
                }
                return "chevron-down-icon"
            }
        },
        methods: {
            change(newVal: DynamicControlGroup, index: number) {
                const controlGroups = [...this.controlSection.controlGroups];
                controlGroups[index] = newVal;
                this.$emit("change", {...this.controlSection, controlGroups})
            },
            toggleDocumentation(e: Event) {
                e.preventDefault();
                this.showDocumentation = !this.showDocumentation
            },
            toggleSection() {
                if (this.controlSection.collapsible) {
                    this.open = !this.open;
                }
            },
          confirm(e: Event) {
            this.$emit("confirm", e)
          }
        },
        components: {
            DynamicFormControlGroup,
            InfoIcon,
            ChevronDownIcon,
            ChevronUpIcon,
            BCollapse,
            BRow,
            BCol
        },
        beforeMount() {
            if (this.controlSection.collapsible && this.controlSection.collapsed) {
                this.open = false
            }
        }
    })
</script>
