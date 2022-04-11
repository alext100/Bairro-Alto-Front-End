import App from "@/App.vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { cleanup } from "@testing-library/vue";
import { NMessageProvider, NConfigProvider } from "naive-ui";
import Header from "@/components/Header.vue";
import { RouterView } from "vue-router";
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
    test("Then it should render NConfigProvider component", async () => {
      const wrapper = mount(App, wrapperOptions);

      const nConfigProvider = await wrapper.findComponent(NConfigProvider);

      expect(nConfigProvider.exists()).toBe(true);
    });

    test("Then it should render NMessageProvider component", async () => {
      const wrapper = mount(App, wrapperOptions);

      const nMessageProvider = await wrapper.findComponent(NMessageProvider);

      expect(nMessageProvider.exists()).toBe(true);
    });

    test("Then it should render RouterView component", async () => {
      const wrapper = mount(App, wrapperOptions);

      const routerView = await wrapper.findComponent(RouterView);

      expect(routerView.exists()).toBe(true);
    });
  });
});
