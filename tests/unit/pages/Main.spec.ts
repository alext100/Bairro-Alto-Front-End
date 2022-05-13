import { createStore } from "vuex";
import Main from "@/pages/Main.vue";
import { TippyPlugin } from "tippy.vue";
import { createHead } from "@vueuse/head";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import { MotionPlugin } from "@vueuse/motion";
import { cleanup } from "@testing-library/vue";
import VueMobileDetection from "vue-mobile-detection";
import News from "@/pages/MainPageComponents/News.vue";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import Teachers from "@/pages/MainPageComponents/Teachers.vue";
import Features from "@/pages/MainPageComponents/Features.vue";
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
    plugins: [store, MotionPlugin, VueMobileDetection, TippyPlugin, head],
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
    test("Then it should call dispatch method with 'getWebContent'", () => {
      const wrapper = mount(Main, wrapperOptions);

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("getWebContent");
    });

    test("Then the backgroundColor should be changed to 'white' on component mounted", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wrapper = mount(Main, wrapperOptions);

      expect(document.body.style.backgroundColor).toBe("white");
    });

    test("Then it should show Teachers component", () => {
      const wrapper = mount(Main, wrapperOptions);

      const teachersComponent = wrapper.findComponent(Teachers);

      expect(teachersComponent.exists()).toBe(true);
    });

    test("Then it should show Banner component", () => {
      const wrapper = mount(Main, wrapperOptions);

      const bannerComponent = wrapper.findComponent(Banner);

      expect(bannerComponent.exists()).toBe(true);
    });

    test("Then it should show Features component", () => {
      const wrapper = mount(Main, wrapperOptions);

      const featuresComponent = wrapper.findComponent(Features);

      expect(featuresComponent.exists()).toBe(true);
    });

    test("Then it should show News component", () => {
      const wrapper = mount(Main, wrapperOptions);

      const newsComponent = wrapper.findComponent(News);

      expect(newsComponent.exists()).toBe(true);
    });

    test("Then it should show Footer component", () => {
      const wrapper = mount(Main, wrapperOptions);

      const footerComponent = wrapper.findComponent(Footer);

      expect(footerComponent.exists()).toBe(true);
    });

    test("Then it should show title", () => {
      const wrapper = mount(Main, wrapperOptions);

      const title = wrapper.find(".main-page__title");

      expect(title.exists()).toBe(true);
    });
  });
});
