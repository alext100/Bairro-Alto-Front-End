import ChangePassword from "@/components/ChangePassword.vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import TeacherSettings from "@/views/TeacherBoard/TeacherSettings.vue";
import { cleanup } from "@testing-library/vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { TippyPlugin } from "tippy.vue";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { createStore } from "vuex";
import state from "../mockedState";

const store = createStore({
  state() {
    return state;
  },
});

const wrapperOptions = {
  global: {
    plugins: [store, TippyPlugin],
  },
  components: { SidebarMenu, ChangePassword },
};

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => {
  cleanup();
});
enableAutoUnmount(afterEach);

describe("Given a TeacherSettings view", () => {
  describe("When it is rendered", () => {
    test("Then it should render SidebarMenu component", () => {
      const wrapper = mount(TeacherSettings, wrapperOptions);

      const SidebarMenuComponent = wrapper.findComponent(SidebarMenu);

      expect(SidebarMenuComponent.exists()).toBe(true);
    });

    test("Then it should render ChangePassword component", () => {
      const wrapper = mount(TeacherSettings, wrapperOptions);

      const ChangePasswordComponent = wrapper.findComponent(ChangePassword);

      expect(ChangePasswordComponent.exists()).toBe(true);
    });
  });
});
