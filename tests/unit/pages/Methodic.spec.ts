import { createStore } from "vuex";
import Methodic from "@/pages/Methodic.vue";
import Footer from "@/components/Footer.vue";
import { cleanup } from "@testing-library/vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
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
};

const router = createRouterMock({});

beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a Methodic page", () => {
  describe("When it is rendered", () => {
    test("Then the backgroundColor should be changed to 'white' on component mounted", () => {
      const wrapper = mount(Methodic, wrapperOptions);

      expect(document.body.style.backgroundColor).toBe("white");
    });

    test("Then it should call dispatch method with 'getWebContent'", () => {
      const wrapper = mount(Methodic, wrapperOptions);

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("getWebContent");
    });

    test("Then it should show Footer", () => {
      const wrapper = mount(Methodic, wrapperOptions);
      const footer = wrapper.findComponent(Footer);

      expect(footer.exists()).toBe(true);
    });

    test("Then it should show the article about school methodic", () => {
      const wrapper = mount(Methodic, wrapperOptions);
      const stringFromArticle = `Преподаём по лексическому подходу`;

      expect(wrapper.html()).toContain(stringFromArticle);
    });
  });
});
