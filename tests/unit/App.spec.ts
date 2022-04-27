import App from "@/App.vue";
import { createStore } from "vuex";
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
import { cleanup } from "@testing-library/vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { NMessageProvider, NConfigProvider } from "naive-ui";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
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
    stubs: { RouterView: false, Transition: false },
    plugins: [store],
  },
  components: { Header, NMessageProvider, NConfigProvider },
};

const router = createRouterMock({});

beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given App.vue component", () => {
  describe("When it is rendered", () => {
    test("Then it should render NConfigProvider component", () => {
      const wrapper = mount(App, wrapperOptions);

      const nConfigProvider = wrapper.findComponent(NConfigProvider);

      expect(nConfigProvider.exists()).toBe(true);
    });

    test("Then it should render NMessageProvider component", () => {
      const wrapper = mount(App, wrapperOptions);

      const nMessageProvider = wrapper.findComponent(NMessageProvider);

      expect(nMessageProvider.exists()).toBe(true);
    });

    test("Then it should render RouterView component", () => {
      const wrapper = mount(App, wrapperOptions);

      const routerView = wrapper.findComponent(RouterView);

      expect(routerView.exists()).toBe(true);
    });
  });
});
