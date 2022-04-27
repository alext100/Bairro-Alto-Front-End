import Atmosphere from "@/pages/Atmosphere.vue";
import Footer from "@/components/Footer.vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
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

describe("Given a Atmosphere page", () => {
  describe("When it is rendered", () => {
    test("Then the backgroundColor should be changed to 'white' on component mounted", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wrapper = mount(Atmosphere, wrapperOptions);

      expect(document.body.style.backgroundColor).toBe("white");
    });

    test("Then it should call dispatch method with 'getWebContent'", () => {
      const wrapper = mount(Atmosphere, wrapperOptions);

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("getWebContent");
    });

    test("Then it should show Footer", () => {
      const wrapper = mount(Atmosphere, wrapperOptions);
      const footer = wrapper.findComponent(Footer);

      expect(footer.exists()).toBe(true);
    });

    test("Then it should show the article about school atmosphere", () => {
      const wrapper = mount(Atmosphere, wrapperOptions);
      const stringFromArticle = `В большинстве отзывов наши студенты говорят об особенной, домашней обстановке в школе, о дружелюбной атмосфере тепла и уюта.`;

      expect(wrapper.html()).toContain(stringFromArticle);
    });
  });
});
