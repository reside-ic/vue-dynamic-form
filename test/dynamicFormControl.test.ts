import {mount, shallowMount, Wrapper} from "@vue/test-utils";
import DynamicFormControl from "../src/DynamicFormControl.vue";
import DynamicFormNumberInput from "../src/DynamicFormNumberInput.vue";
import DynamicFormSelect from "../src/DynamicFormSelect.vue";
import DynamicFormMultiSelect from "../src/DynamicFormMultiSelect.vue";
import TreeSelect from '@riophae/vue-treeselect';
import {VTooltip} from 'v-tooltip';
import {NumberControl, SelectControl} from "../src/types";
import Vue from "vue";
import DynamicFormReadonlyValue from "../src/DynamicFormReadonlyValue.vue";

const tooltipSpy = jest.spyOn(VTooltip, "bind");

describe('Dynamic form control component', function () {

    const fakeNumber: NumberControl = {
        label: "Number label",
        name: "id_1",
        type: "number",
        required: false
    };

    const fakeSelect: SelectControl = {
        name: "id_2",
        type: "select",
        required: true,
        options: [{id: "opt1", label: "option 1"}, {id: "opt2", label: "option2"}]
    };

    const fakeMultiSelect: SelectControl = {
        name: "id_3",
        type: "multiselect",
        required: true,
        options: [{id: "opt1", label: "option 1"}, {id: "opt2", label: "option2"}]
    };

    const getWrapper = (formControl: any, mount: (component: any, options: any) => Wrapper<Vue>, readonly: Boolean = false) => {
        return mount(DynamicFormControl, {
            propsData: {
                formControl: formControl,
                requiredText: 'compulsory',
                selectText: 'Select',
                readonly,
                groupLabel: 'test'
            }
        });
    };

    it("renders label if it exists", () => {
        const rendered = getWrapper(fakeNumber, shallowMount);
        expect(rendered.find("label").text()).toBe("Number label");
    });

    it("renders tooltip if help text exists", () => {
        const rendered = getWrapper({...fakeNumber, helpText: "Some help text"}, shallowMount);
        expect(rendered.find("label").text()).toBe("Number label");

        expect(rendered.find("label").find("span").classes()).toContain("has-tooltip");
        expect(tooltipSpy).toHaveBeenCalled();
        expect((tooltipSpy.mock.calls[0][1] as any).value).toBe("Some help text")
    });

    it("renders required indicator if input is required and sets text-danger class if no value given", () => {
        const rendered = getWrapper({...fakeNumber, required: true}, shallowMount);
        expect(rendered.find("label").find("span").text()).toBe("(compulsory)");
        expect(rendered.find("label").find("span").attributes("class")).toBe("small text-danger");
    });

    it("renders required indicator if input is required and removes set text-danger class if value given", () => {
        const rendered = getWrapper({...fakeNumber, required: true, value: 123}, shallowMount);
        expect(rendered.find("label").find("span").text()).toBe("(compulsory)");
        expect(rendered.find("label").find("span").attributes("class")).toBe("small");
    });

    it("does not render required indicator if readonly", () => {
        const rendered = getWrapper({...fakeNumber, required: true}, shallowMount, true);
        expect(rendered.find("label").find("span").exists()).toBe(false);
    });

    it("does not renders label if it does not exist", () => {
        const rendered = getWrapper(fakeSelect, shallowMount);
        expect(rendered.findAll("label").length).toBe(0);
    });

    it("col has given width", () => {
        const rendered = mount(DynamicFormControl, {
            propsData: {
                formControl: fakeNumber,
                colWidth: "3"
            }
        });
        expect(rendered.element.classList).toContain("col-md-3");
    });

    it("renders number input when formControl type is number", () => {
        const control = {...fakeNumber};
        const rendered = getWrapper(control, mount);
        expect(rendered.findAll(DynamicFormNumberInput).length).toBe(1);
        expect(rendered.findAll(DynamicFormNumberInput).at(0).props("groupLabel")).toBe("test");
        rendered.find("input").setValue(123);
        expect(rendered.emitted("change")![0][0]).toStrictEqual({...control, value: 123})
    });

    it("renders select when formControl type is select", () => {
        const control = {...fakeSelect};
        const rendered = getWrapper(control, mount);
        expect(rendered.findAll(DynamicFormSelect).length).toBe(1);
        expect(rendered.findAll(DynamicFormSelect).at(0).props("selectText")).toBe("Select");
        expect(rendered.findAll(DynamicFormSelect).at(0).props("groupLabel")).toBe("test");
        rendered.find("select").trigger("change");
        expect(rendered.emitted("change")![0][0]).toStrictEqual({...fakeSelect, value: ""});
    });

    it("renders multi-select when formControl type is multiselect", () => {
        const rendered = getWrapper(fakeMultiSelect, mount);
        expect(rendered.findAll(DynamicFormMultiSelect).length).toBe(1);
        expect(rendered.findAll(DynamicFormMultiSelect).at(0).props("selectText")).toBe("Select");
        expect(rendered.findAll(DynamicFormMultiSelect).at(0).props("groupLabel")).toBe("test");
        rendered.find(DynamicFormMultiSelect).find(TreeSelect).vm.$emit("input", "opt1");
        expect(rendered.emitted("change")![0][0]).toStrictEqual({...fakeMultiSelect, value: "opt1"})
    });

    it("renders readonly value when readonly is true", () => {
        const numberControl = {...fakeNumber};
        const renderedNumber = getWrapper(numberControl, mount, true);
        expect(renderedNumber.findAll(DynamicFormNumberInput).length).toBe(0);
        expect(renderedNumber.findAll(DynamicFormReadonlyValue).length).toBe(1);
        expect((renderedNumber.find(DynamicFormReadonlyValue).vm as any).formControl).toBe(numberControl);

        const selectControl = {...fakeSelect};
        const renderedSelect = getWrapper(selectControl, mount, true);
        expect(renderedSelect.findAll(DynamicFormSelect).length).toBe(0);
        expect(renderedSelect.findAll(DynamicFormReadonlyValue).length).toBe(1);
        expect((renderedSelect.find(DynamicFormReadonlyValue).vm as any).formControl).toBe(selectControl);

        const renderedMulti = getWrapper(fakeMultiSelect, mount, true);
        expect(renderedMulti.findAll(DynamicFormMultiSelect).length).toBe(0);
        expect(renderedMulti.findAll(DynamicFormReadonlyValue).length).toBe(1);
        expect((renderedMulti.find(DynamicFormReadonlyValue).vm as any).formControl).toBe(fakeMultiSelect);
    });

});
