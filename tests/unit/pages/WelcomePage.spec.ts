import { NCard } from "naive-ui";
import { createStore } from "vuex";
import { createHead } from "@vueuse/head";
import WelcomePage from "@/pages/Welcome.vue";
import { cleanup } from "@testing-library/vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import state from "../../mockedState";

const head = createHead();

const store = createStore({
  state() {
    return state;
  },
  actions: { getWebContent: jest.fn() },
});
store.dispatch = jest.fn();

const wrapperOptions = {
  global: {
    stubs: { RouterLink: false },
    plugins: [store, head],
  },
  components: { NCard },
};

const router = createRouterMock({});

beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a Welcome page", () => {
  describe("When it is rendered", () => {
    test("Then on mounted it should call dispatch with 'verifyUser' and 'route.params.confirmationCode'", async () => {
      const confirmationCode = "A3QEW2RF3VQ13498R7U3RI451293423";
      await router.push(`/confirm/${confirmationCode}`);

      const wrapper = mount(WelcomePage, wrapperOptions);

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("verifyUser", wrapper.vm.$route.confirmationCode);
    });

    test("Then it should render NCard component with the message for a user", () => {
      const wrapper = mount(WelcomePage, wrapperOptions);

      const nCardComponent = wrapper.findComponent(NCard);
      const message = `Аккаунт активирован!`;

      expect(nCardComponent.exists()).toBe(true);
      expect(wrapper.html()).toContain(message);
    });

    test("Then it should show the button for send confirmation message one more time", () => {
      const wrapper = mount(WelcomePage, wrapperOptions);

      const logIn = wrapper.find(".login-link");

      expect(logIn.exists()).toBe(true);
    });

    describe("When a user click a link 'Login'", () => {
      test("Then it should call router.push with '/login'", async () => {
        const wrapper = mount(WelcomePage, wrapperOptions);
        const loginLink = wrapper.find(".login-link");

        await loginLink.trigger("click");

        expect(wrapper.vm.$router.push).toHaveBeenCalledWith("/Login");
      });
    });
  });
});
