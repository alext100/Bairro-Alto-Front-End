import { createStore } from "vuex";
import { cleanup } from "@testing-library/vue";
import CkEditor from "@/components/CkEditorCustom.vue";
import { enableAutoUnmount, shallowMount } from "@vue/test-utils";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import state from "../../mockedState";

const store = createStore({
  state() {
    return state;
  },
  actions: { getWebContent: jest.fn() },
});

const wrapperOptions = {
  global: {
    plugins: [store],
    stubs: ["CkEditor"],
  },
  components: { ckeditor: ClassicEditor },
};

afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a CkEditorCustom component", () => {
  describe("When it is rendered", () => {
    test("Then it should render editor", () => {
      const wrapper = shallowMount(CkEditor, wrapperOptions);

      const editor = wrapper.findComponent(ClassicEditor);

      expect(editor.exists()).toBe(true);
    });

    test("Then it should have modelValue: '' in editor props", () => {
      const wrapper = shallowMount(CkEditor, wrapperOptions);

      const ckEditorComponent = wrapper.getComponent({ name: "CkEditor" });

      expect(ckEditorComponent.props()).toEqual({ modelValue: "" });
    });
  });
});
