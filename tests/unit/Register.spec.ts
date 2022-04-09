import Register from "@/views/Register.vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createStore } from "vuex";
import TextInput from "@/components/TextInput.vue";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { cleanup } from "@testing-library/vue";
import state from "../mockedState";

const store = createStore({
  state() {
    return state;
  },
  actions: { registerUser: jest.fn() },
  mutations: { isRegistered: jest.fn(), notRegistered: jest.fn() },
});

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a Register view", () => {
  describe("When it is rendered", () => {
    test("Then it should render 'TextInput' component with correct props for firstName input", async () => {
      const wrapper = mount(Register, {
        global: {
          plugins: [store],
          stubs: ["TextInput"],
        },
      });

      const input = await wrapper.findAllComponents(TextInput);

      expect(input[0].exists()).toBe(true);
      expect(input[0].props("name")).toEqual("firstName");
      expect(input[0].props("type")).toEqual("text");
      expect(input[0].props("label")).toEqual("Имя");
      expect(input[0].props("placeholder")).toEqual("Имя");
    });

    test("Then it should render 'TextInput' component with correct props for lastName input", async () => {
      const wrapper = mount(Register, {
        global: {
          plugins: [store],
          stubs: ["TextInput"],
        },
      });

      const input = await wrapper.findAllComponents(TextInput);

      expect(input[1].exists()).toBe(true);
      expect(input[1].props("name")).toEqual("lastName");
      expect(input[1].props("type")).toEqual("text");
      expect(input[1].props("label")).toEqual("Фамилия");
      expect(input[1].props("placeholder")).toEqual("Фамилия");
    });

    test("Then it should render 'TextInput' component with correct props for email input", async () => {
      const wrapper = mount(Register, {
        global: {
          plugins: [store],
          stubs: ["TextInput"],
        },
      });

      const input = await wrapper.findAllComponents(TextInput);

      expect(input[2].exists()).toBe(true);
      expect(input[2].props("name")).toEqual("email");
      expect(input[2].props("type")).toEqual("email");
      expect(input[2].props("label")).toEqual("E-mail");
      expect(input[2].props("placeholder")).toEqual("Ваш email адрес");
    });

    test("Then it should render 'TextInput' component with correct props for password input", async () => {
      const wrapper = mount(Register, {
        global: {
          plugins: [store],
          stubs: ["TextInput"],
        },
      });

      const input = await wrapper.findAllComponents(TextInput);

      expect(input[3].exists()).toBe(true);
      expect(input[3].props("name")).toEqual("password");
      expect(input[3].props("type")).toEqual("password");
      expect(input[3].props("label")).toEqual("Пароль");
      expect(input[3].props("placeholder")).toEqual("Ваш пароль");
    });

    test("Then it should render 'TextInput' component with correct props for confirmPassword input", async () => {
      const wrapper = mount(Register, {
        global: {
          plugins: [store],
          stubs: ["TextInput"],
        },
      });

      const input = await wrapper.findAllComponents(TextInput);

      expect(input[4].exists()).toBe(true);
      expect(input[4].props("name")).toEqual("confirmPassword");
      expect(input[4].props("type")).toEqual("password");
      expect(input[4].props("label")).toEqual("Подтвердите пароль");
      expect(input[4].props("placeholder")).toEqual("Введите пароль ещё раз");
    });

    test("Then it should render 'Form' component", () => {
      const wrapper = mount(Register, {
        global: {
          plugins: [store],
          stubs: ["Form"],
        },
      });

      const form = wrapper.findComponent(".register-form");

      expect(form.exists()).toBe(true);
    });
  });

  test("Then it should render icon with class 'toggle-password'", async () => {
    const wrapper = mount(Register, {
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
      const wrapper = mount(Register, {
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
