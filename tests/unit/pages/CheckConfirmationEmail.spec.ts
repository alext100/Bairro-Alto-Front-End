import CheckConfirmationEmail from "@/pages/CheckConfirmationEmail.vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, getRouter, injectRouterMock } from "vue-router-mock";
import { NCard } from "naive-ui";
import { cleanup } from "@testing-library/vue";
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
    plugins: [store],
  },
  components: { NCard },
};

const router = createRouterMock({});

beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a CheckConfirmationEmail page", () => {
  describe("When it is rendered", () => {
    test("Then it should render NCard component with the message for a user", () => {
      const wrapper = mount(CheckConfirmationEmail, wrapperOptions);

      const nCardComponent = wrapper.findComponent(NCard);
      const message = `Активируйте аккаунт по ссылке, которую мы отправили на ваш email`;

      expect(nCardComponent.exists()).toBe(true);
      expect(wrapper.html()).toContain(message);
    });

    test("Then it should show the button for send confirmation message one more time", () => {
      const wrapper = mount(CheckConfirmationEmail, wrapperOptions);

      const button = wrapper.find("button");

      expect(button.exists()).toBe(true);
    });

    describe("When a user click a button", () => {
      test("Then it should call dispatch method with 'getWebContent' and email from route.params", async () => {
        const wrapper = mount(CheckConfirmationEmail, wrapperOptions);
        const button = wrapper.find("button");

        await getRouter().setParams({ email: "mail@mail.com" });
        await button.trigger("click");

        expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("sendConfirmEmailOneMoreTime", "mail@mail.com");
      });
    });
  });
});
