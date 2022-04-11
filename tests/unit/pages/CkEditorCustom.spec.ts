import CkEditor from "@/components/CkEditorCustom.vue";
import { enableAutoUnmount, shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { cleanup } from "@testing-library/vue";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import state from "../../mockedState";

const store = createStore({
  state() {
    return state;
  },
  actions: { getWebContent: jest.fn() },
});
store.dispatch = jest.fn();

const wrapperOptions = {
  global: {
    stubs: ["CkEditor"],
  },
  components: { ckeditor: ClassicEditor },
};

afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a CkEditorCustom component", () => {
  describe("When it is rendered", () => {
    test("Then it should render editor", async () => {
      const wrapper = shallowMount(CkEditor, wrapperOptions);

      const editor = await wrapper.findComponent(ClassicEditor);

      expect(editor.exists()).toBe(true);
    });

    test("Then it should have modelValue: '' in editor props", async () => {
      const wrapper = shallowMount(CkEditor, wrapperOptions);

      const ckEditorComponent = wrapper.getComponent({ name: "CkEditor" });

      expect(ckEditorComponent.props()).toEqual({ modelValue: "" });
    });
  });
});
