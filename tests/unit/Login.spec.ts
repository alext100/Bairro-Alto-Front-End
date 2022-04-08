import Login from "@/views/Login.vue";
import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import TextInput from "@/components/TextInput.vue";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { cleanup } from "@testing-library/vue";

import state from "../mockedState";

const store = createStore({
  state() {
    return state;
  },
  actions: { login: jest.fn() },
  mutations: { userLoggedFromApi: jest.fn(), startLoading: jest.fn(), stopLoading: jest.fn() },
});

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());

describe("Given a Login view", () => {
  describe("When it is rendered", () => {
    test("Then it should render 'TextInput' component with props name, type = 'password', label='Пароль'", async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [store],
          stubs: ["TextInput"],
        },
      });

      const input = await wrapper.findAllComponents(TextInput);

      expect(input[1].exists()).toBe(true);
      expect(input[1].props("name")).toEqual("password");
      expect(input[1].props("type")).toEqual("password");
      expect(input[1].props("label")).toEqual("Пароль");
      expect(input[1].props("placeholder")).toEqual("Введите пароль");
    });

    test("Then it should render 'TextInput' component with props name, type = 'email', label='E-mail'", async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [store],
          stubs: ["TextInput"],
        },
      });

      const input = await wrapper.findAllComponents(TextInput);

      expect(input[0].exists()).toBe(true);
      expect(input[0].props("name")).toEqual("email");
      expect(input[0].props("type")).toEqual("email");
      expect(input[0].props("label")).toEqual("E-mail");
      expect(input[0].props("placeholder")).toEqual("Введите email адрес");
    });

    test("Then it should render 'Form' component", () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [store],
          stubs: ["Form"],
        },
      });

      const form = wrapper.findComponent(".login-form");

      expect(form.exists()).toBe(true);
    });
  });

  test("Then it should render icon with class 'toggle-password'", async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [store],
        stubs: ["TextInput"],
      },
    });

    const icon = await wrapper.find(".toggle-password");

    expect(icon.exists()).toBe(true);
  });

  describe("When a user click on the eye icon in the password input field", () => {
    test("Then it should toggle a class 'fa-eye-slash'", async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [store],
        },
      });

      const button = await wrapper.find(".toggle-password");

      expect(button.classes()).not.toContain("fa-eye-slash");

      await button.trigger("click");

      expect(button.classes()).toContain("fa-eye-slash");

      await button.trigger("click");

      expect(button.classes()).not.toContain("fa-eye-slash");
    });
  });
});
