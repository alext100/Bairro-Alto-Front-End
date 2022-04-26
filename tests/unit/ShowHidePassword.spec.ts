import ShowHidePassword from "@/components/ShowHidePassword.vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { cleanup } from "@testing-library/vue";

import state from "../mockedState";

const store = createStore({
  state() {
    return state;
  },
});

const wrapperOptions = {
  global: {
    plugins: [store],
  },
};

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a ShowHidePassword component", () => {
  describe("When it is rendered", () => {
    test("Then it should render icon with class 'toggle-password'", async () => {
      const wrapper = mount(ShowHidePassword, wrapperOptions);

      const icon = await wrapper.find(".toggle-password");

      expect(icon.exists()).toBe(true);
    });

    describe("When a user click on the eye icon in the password input field", () => {
      test("Then it should toggle a class 'fa-eye-slash'", async () => {
        const wrapper = mount(ShowHidePassword, wrapperOptions);

        const button = await wrapper.find(".toggle-password");

        expect(button.classes()).not.toContain("fa-eye-slash");

        await button.trigger("click");

        expect(button.classes()).toContain("fa-eye-slash");

        await button.trigger("click");

        expect(button.classes()).not.toContain("fa-eye-slash");
      });
    });
  });
});
