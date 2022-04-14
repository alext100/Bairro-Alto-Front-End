import CreateGroup from "@/views/TeacherBoard/CreateGroup.vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { cleanup } from "@testing-library/vue";
import { TippyPlugin } from "tippy.vue";
import { Form } from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import state from "../mockedState";

const store = createStore({
  state() {
    return state;
  },
  actions: { getWebContent: jest.fn() },
});
store.dispatch = jest.fn();

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
    test("Then it should show TextInput component", async () => {
      const wrapper = mount(CreateGroup, wrapperOptions);

      const textInput = wrapper.findComponent(TextInput);

      expect(textInput.exists()).toBe(true);
    });

    test("Then it should show button", async () => {
      const wrapper = mount(CreateGroup, wrapperOptions);

      const button = wrapper.find("button");

      expect(button.exists()).toBe(true);
    });

    test("Then it should show SidebarMenu component", async () => {
      const wrapper = mount(CreateGroup, wrapperOptions);

      const sidebarMenu = wrapper.findComponent(SidebarMenu);

      expect(sidebarMenu.exists()).toBe(true);
    });

    test("Then it should show Form component", async () => {
      const wrapper = mount(CreateGroup, wrapperOptions);

      const form = wrapper.findComponent(Form);

      expect(form.exists()).toBe(true);
    });
  });
});
