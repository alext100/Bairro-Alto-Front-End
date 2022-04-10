import MaterialsPost from "@/pages/MaterialsPost.vue";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { cleanup } from "@testing-library/vue";
import { NCard } from "naive-ui";
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
  components: { Banner, Footer, NCard },
};

const router = createRouterMock({});

beforeEach(async () => {
  injectRouterMock(router);
  await router.setParams({ id: "624a945fa4a7260aa1b630a1" });
});
afterEach(() => {
  cleanup();
});
enableAutoUnmount(afterEach);

describe("Given a MaterialsPost page", () => {
  describe("When it is rendered", () => {
    test("Then it should call dispatch method with 'getWebContent'", () => {
      const wrapper = mount(MaterialsPost, wrapperOptions);

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("getWebContent");
    });

    test("Then the backgroundColor should be changed to 'white' on component mounted", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wrapper = mount(MaterialsPost, wrapperOptions);

      expect(document.body.style.backgroundColor).toBe("white");
    });

    test("Then it should render the title of the page", () => {
      const wrapper = mount(MaterialsPost, wrapperOptions);

      const title = wrapper.find(".materials-title");

      expect(title.exists()).toBe(true);
    });

    test("Then it should render NCard component", () => {
      const wrapper = mount(MaterialsPost, wrapperOptions);

      const nCardComponent = wrapper.findComponent(NCard);

      expect(nCardComponent.exists()).toBe(true);
    });

    test("Then NCard classes should contain 'n-card--hoverable'", () => {
      const wrapper = mount(MaterialsPost, wrapperOptions);

      const nCardComponent = wrapper.findComponent(NCard);

      expect(nCardComponent.classes()).toStrictEqual(["n-card", "n-card--hoverable"]);
    });

    test("Then it should show Footer component", async () => {
      const wrapper = mount(MaterialsPost, wrapperOptions);

      const footerComponent = await wrapper.findComponent(Footer);

      expect(footerComponent.exists()).toBe(true);
    });

    test("Then it should show link to go back to Materials page", async () => {
      const wrapper = mount(MaterialsPost, wrapperOptions);

      const link = await wrapper.findComponent(".nav-link");

      expect(link.html()).toContain("/materials");
    });
  });
});
