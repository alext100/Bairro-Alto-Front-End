import Events from "@/pages/Events.vue";
import Footer from "@/components/Footer.vue";
import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { cleanup } from "@testing-library/vue";
import state from "../../mockedState";

const store = createStore({
  state() {
    return state;
  },
  actions: { getWebContent: jest.fn() },
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

describe("Given a Events page", () => {
  describe("When it is rendered", () => {
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