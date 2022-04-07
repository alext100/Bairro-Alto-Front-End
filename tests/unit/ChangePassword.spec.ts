import ChangePassword from "@/components/ChangePassword.vue";
import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import TextInput from "@/components/TextInput.vue";
import { createRouterMock, injectRouterMock } from "vue-router-mock";

import state from "../mockedState";

const store = createStore({
  state() {
    return state;
  },
});

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});

describe("Given a ChangePassword component", () => {
  describe("When it is rendered", () => {
    test("Then it should render 'TextInput' component for confirmPassword input with correct props", async () => {
      const wrapper = mount(ChangePassword, {
        global: {
          plugins: [store],
          stubs: ["TextInput"],
        },
      });

      const input = await wrapper.findAllComponents(TextInput);

      expect(input[1].exists()).toBe(true);
      expect(input[1].props("name")).toEqual("confirmPassword");
      expect(input[1].props("type")).toEqual("password");
      expect(input[1].props("label")).toEqual("Подтвердите новый пароль");
      expect(input[1].props("placeholder")).toEqual("Введите пароль ещё раз");
    });

    test("Then it should render 'TextInput' component for password input with correct props", async () => {
      const wrapper = mount(ChangePassword, {
        global: {
          plugins: [store],
          stubs: ["TextInput"],
        },
      });

      const input = await wrapper.findAllComponents(TextInput);

      expect(input[0].exists()).toBe(true);
      expect(input[0].props("name")).toEqual("password");
      expect(input[0].props("type")).toEqual("password");
      expect(input[0].props("label")).toEqual("Пароль");
      expect(input[0].props("placeholder")).toEqual("Новый пароль");
    });

    test("Then it should render 'Form' component", () => {
      const wrapper = mount(ChangePassword, {
        global: {
          plugins: [store],
          stubs: ["Form"],
        },
      });

      const form = wrapper.findComponent('[data-test="change-password-form"]');

      expect(form.exists()).toBe(true);
    });
  });

  test("Then it should render icon 'toggle-password'", async () => {
    const wrapper = mount(ChangePassword, {
      global: {
        plugins: [store],
        stubs: ["TextInput"],
      },
    });

    const icon = await wrapper.find('[data-test="toggle-password"]');

    expect(icon.exists()).toBe(true);
  });

  describe("When a user click on the eye icon in the password input field", () => {
    test("Then it should toggle a class 'fa-eye-slash'", async () => {
      const wrapper = mount(ChangePassword, {
        global: {
          plugins: [store],
        },
      });

      const button = await wrapper.find('[data-test="toggle-password"]');

      expect(button.classes()).not.toContain("fa-eye-slash");

      await button.trigger("click");

      expect(button.classes()).toContain("fa-eye-slash");

      await button.trigger("click");

      expect(button.classes()).not.toContain("fa-eye-slash");
    });
  });
});
