import Materials from "@/pages/Materials.vue";
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

describe("Given a Materials page", () => {
  describe("When it is rendered", () => {
    test("Then it should render Banner component", () => {
      const wrapper = mount(Materials, wrapperOptions);

      const bannerComponent = wrapper.findComponent(Banner);

      expect(bannerComponent.exists()).toBe(true);
    });

    test("Then it should render title", () => {
      const wrapper = mount(Materials, wrapperOptions);

      const title = wrapper.find(".materials-title");

      expect(title.exists()).toBe(true);
    });

    test("Then it should render NCard component", () => {
      const wrapper = mount(Materials, wrapperOptions);

      const nCardComponent = wrapper.findComponent(NCard);

      expect(nCardComponent.exists()).toBe(true);
    });

    test("Then NCard classes should contain 'n-card--bordered', 'n-card--hoverable'", () => {
      const wrapper = mount(Materials, wrapperOptions);

      const nCardComponent = wrapper.findComponent(NCard);

      expect(nCardComponent.classes()).toStrictEqual(["n-card", "n-card--bordered", "n-card--hoverable"]);
    });

    test("Then router-link should have link to '/materials/:id'", async () => {
      const wrapper = mount(Materials, wrapperOptions);
      const material = { id: "624a945fa4a7260aa1b630a1" };

      const link = wrapper.find(".materials-page__router-link");

      expect(link.html()).toContain(`/materials/${material.id}`);
    });

    test("Then it should show Footer component", async () => {
      const wrapper = mount(Materials, wrapperOptions);

      const footerComponent = await wrapper.findComponent(Footer);

      expect(footerComponent.exists()).toBe(true);
    });
  });
});