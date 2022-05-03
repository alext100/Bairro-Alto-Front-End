import { createStore } from "vuex";
import Events from "@/pages/Events.vue";
import Footer from "@/components/Footer.vue";
import { cleanup } from "@testing-library/vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import state from "../../mockedState";

jest.mock("@/composables/useSplitText", () => ({
  __esModule: true,
  default: () => ({
    ScrollTrigger: jest.fn(),
    SplitText: jest.fn(),
  }),
}));

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
};

const router = createRouterMock({});

beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a Events page", () => {
  describe("When it is rendered", () => {
    test("Then it should call dispatch method with 'getWebContent'", () => {
      const wrapper = mount(Events, wrapperOptions);

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("getWebContent");
    });

    test("Then the backgroundColor should be changed to 'white' on component mounted", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wrapper = mount(Events, wrapperOptions);

      expect(document.body.style.backgroundColor).toBe("white");
    });

    test("Then it should show Footer", () => {
      const wrapper = mount(Events, wrapperOptions);
      const footer = wrapper.findComponent(Footer);

      expect(footer.exists()).toBe(true);
    });

    test("Then it should show the articles with school events", () => {
      const wrapper = mount(Events, wrapperOptions);
      const stringFromArticle = `Quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architectoa`;
      const title = "New Year Fest";

      expect(wrapper.html()).toContain(title);
      expect(wrapper.html()).toContain(stringFromArticle);
    });
  });
});
