import SpecialCourses from "@/pages/SpecialCourses.vue";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { MotionPlugin } from "@vueuse/motion";
import { cleanup } from "@testing-library/vue";
import { TippyPlugin } from "tippy.vue";
import { NCard } from "naive-ui";
import VueMobileDetection from "vue-mobile-detection";
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
    plugins: [store, MotionPlugin, VueMobileDetection, TippyPlugin],
    stubs: {
      Particles: { template: "<i />" },
    },
  },
  components: { Banner, Footer, NCard },
};

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => {
  cleanup();
});
enableAutoUnmount(afterEach);

describe("Given a SpecialCourses page", () => {
  describe("When it is rendered", () => {
    test("Then it should call dispatch method with 'getWebContent'", () => {
      const wrapper = mount(SpecialCourses, wrapperOptions);

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("getWebContent");
    });

    test("Then the backgroundColor should be changed to 'white' on component mounted", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wrapper = mount(SpecialCourses, wrapperOptions);

      expect(document.body.style.backgroundColor).toBe("white");
    });

    test("Then it should render Banner component", () => {
      const wrapper = mount(SpecialCourses, wrapperOptions);

      const bannerComponent = wrapper.findComponent(Banner);

      expect(bannerComponent.exists()).toBe(true);
    });

    test("Then it should render the title of the page", () => {
      const wrapper = mount(SpecialCourses, wrapperOptions);

      const title = wrapper.find(".special-courses__title");

      expect(title.exists()).toBe(true);
    });

    test("Then it should render NCard component", () => {
      const wrapper = mount(SpecialCourses, wrapperOptions);

      const nCardComponent = wrapper.findComponent(NCard);

      expect(nCardComponent.exists()).toBe(true);
    });

    test("Then NCard classes should contain 'n-card--bordered', 'n-card--hoverable'", () => {
      const wrapper = mount(SpecialCourses, wrapperOptions);

      const nCardComponent = wrapper.findComponent(NCard);

      expect(nCardComponent.classes()).toStrictEqual(["n-card", "n-card--bordered", "n-card--hoverable"]);
    });

    test("Then it should show Footer component", async () => {
      const wrapper = mount(SpecialCourses, wrapperOptions);

      const footerComponent = await wrapper.findComponent(Footer);

      expect(footerComponent.exists()).toBe(true);
    });
  });
});
