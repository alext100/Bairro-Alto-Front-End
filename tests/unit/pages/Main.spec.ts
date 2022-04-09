import Main from "@/pages/Main.vue";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import Teachers from "@/pages/MainPageComponents/Teachers.vue";
import Features from "@/pages/MainPageComponents/Features.vue";
import News from "@/pages/MainPageComponents/News.vue";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { MotionPlugin } from "@vueuse/motion";
import { cleanup } from "@testing-library/vue";
import { TippyPlugin } from "tippy.vue";
import VueMobileDetection from "vue-mobile-detection";
import state from "../../mockedState";

const store = createStore({
  state() {
    return state;
  },
  actions: { getWebContent: jest.fn() },
});

const wrapperOptions = {
  global: {
    plugins: [store, MotionPlugin, VueMobileDetection, TippyPlugin],
    stubs: {
      Particles: {
        template: "<i />",
      },
    },
  },
  components: { Banner, Footer, Teachers, Features, News },
};

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => {
  cleanup();
});
enableAutoUnmount(afterEach);

describe("Given a Main page", () => {
  describe("When it is rendered", () => {
    test("Then it should show Teachers component", async () => {
      const wrapper = mount(Main, wrapperOptions);

      const teachersComponent = await wrapper.findComponent(Teachers);

      expect(teachersComponent.exists()).toBe(true);
    });

    test("Then it should show Banner component", async () => {
      const wrapper = mount(Main, wrapperOptions);

      const bannerComponent = await wrapper.findComponent(Banner);

      expect(bannerComponent.exists()).toBe(true);
    });

    test("Then it should show Features component", async () => {
      const wrapper = mount(Main, wrapperOptions);

      const featuresComponent = await wrapper.findComponent(Features);

      expect(featuresComponent.exists()).toBe(true);
    });

    test("Then it should show News component", async () => {
      const wrapper = mount(Main, wrapperOptions);

      const newsComponent = await wrapper.findComponent(News);

      expect(newsComponent.exists()).toBe(true);
    });

    test("Then it should show Footer component", async () => {
      const wrapper = mount(Main, wrapperOptions);

      const footerComponent = await wrapper.findComponent(Footer);

      expect(footerComponent.exists()).toBe(true);
    });

    test("Then it should show title", async () => {
      const wrapper = mount(Main, wrapperOptions);

      const title = await wrapper.find(".main-page__title");

      expect(title.exists()).toBe(true);
    });
  });
});
