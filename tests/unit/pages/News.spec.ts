import { createStore } from "vuex";
import News from "@/pages/News.vue";
import { TippyPlugin } from "tippy.vue";
import { createHead } from "@vueuse/head";
import Footer from "@/components/Footer.vue";
import { MotionPlugin } from "@vueuse/motion";
import { cleanup } from "@testing-library/vue";
import FullCard from "@/components/FullCard.vue";
import VueMobileDetection from "vue-mobile-detection";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import state from "../../mockedState";

const head = createHead();

const store = createStore({
  state() {
    return state;
  },
  actions: { getWebContent: jest.fn() },
});

const wrapperOptions = {
  global: {
    plugins: [store, MotionPlugin, VueMobileDetection, TippyPlugin, head],
    stubs: {
      Particles: { template: "<i />" },
    },
  },
  components: { Footer, FullCard },
};

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => {
  cleanup();
});
enableAutoUnmount(afterEach);

describe("Given a News page", () => {
  describe("When it is rendered", () => {
    test("Then the backgroundColor should be changed to 'white' on component mounted", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wrapper = mount(News, wrapperOptions);

      expect(document.body.style.backgroundColor).toBe("white");
    });

    test("Then it should render FullCard component", () => {
      const wrapper = mount(News, wrapperOptions);

      const nCardComponent = wrapper.findComponent(FullCard);

      expect(nCardComponent.exists()).toBe(true);
    });

    test("Then it should show Footer component", () => {
      const wrapper = mount(News, wrapperOptions);

      const footerComponent = wrapper.findComponent(Footer);

      expect(footerComponent.exists()).toBe(true);
    });

    test("Then it should show each received news title (from state)", () => {
      const wrapper = mount(News, wrapperOptions);

      const newsTitle = wrapper.find(".card-title");

      expect(newsTitle.html()).toContain("Набор в онлайн группу А1");
    });

    test("Then it should show each received news body (from state)", () => {
      const wrapper = mount(News, wrapperOptions);

      const newsBody = wrapper.find(".card-text");

      expect(newsBody.html()).toContain("Напоминаем, что идёт набор в онлайн группы для начинающих А1");
    });
  });
});
