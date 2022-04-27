import { createStore } from "vuex";
import "@testing-library/jest-dom";
import { Form } from "vee-validate";
import { TippyPlugin } from "tippy.vue";
import { cleanup } from "@testing-library/vue";
import TextInput from "@/components/TextInput.vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import CreateGroup from "@/views/TeacherBoard/CreateGroup.vue";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { enableAutoUnmount, mount, flushPromises } from "@vue/test-utils";
import state from "../mockedState";

const store = createStore({
  state() {
    return state;
  },
  actions: { createGroup: jest.fn() },
});

const wrapperOptions = {
  global: {
    plugins: [store, TippyPlugin],
  },
  components: { SidebarMenu, TextInput, Form },
};

const router = createRouterMock({});

beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a CreateGroup component", () => {
  describe("When it is rendered", () => {
    test("Then it should show TextInput component", () => {
      const wrapper = mount(CreateGroup, wrapperOptions);

      const textInput = wrapper.findComponent(TextInput);

      expect(textInput.exists()).toBe(true);
    });

    test("Then it should show button", () => {
      const wrapper = mount(CreateGroup, wrapperOptions);

      const button = wrapper.find("button");

      expect(button.exists()).toBe(true);
    });

    test("Then it should show SidebarMenu component", () => {
      const wrapper = mount(CreateGroup, wrapperOptions);

      const sidebarMenu = wrapper.findComponent(SidebarMenu);

      expect(sidebarMenu.exists()).toBe(true);
    });

    test("Then it should show Form component", () => {
      const wrapper = mount(CreateGroup, wrapperOptions);

      const form = wrapper.findComponent(Form);

      expect(form.exists()).toBe(true);
    });

    describe("When a user type a group name in the input field", () => {
      test("Then input should have value equal to the group name", async () => {
        const wrapper = mount(CreateGroup, wrapperOptions);
        const textInput = wrapper.find("input");

        await textInput.setValue("someGroupName");

        expect(textInput.element).toHaveValue("someGroupName");
      });
    });

    describe("When a user type a group name in the input field and click submit", () => {
      test("Then Form should have truthy submit event", async () => {
        const wrapper = mount(CreateGroup, wrapperOptions);
        const textInput = wrapper.find("input");
        const form = wrapper.findComponent(Form);

        await textInput.setValue("groupName");
        await form.trigger("submit");
        await flushPromises();

        expect(form.emitted().submit).toBeTruthy();
      });
    });
  });
});
