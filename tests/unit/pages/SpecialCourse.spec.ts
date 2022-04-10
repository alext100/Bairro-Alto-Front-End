import SpecialCourse from "@/pages/SpecialCourse.vue";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { cleanup } from "@testing-library/vue";
import { NCard, NH1 } from "naive-ui";
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
  components: { Banner, Footer, NCard, NH1 },
};

const router = createRouterMock({});

beforeEach(async () => {
  injectRouterMock(router);
  await router.setParams({ id: "624a945fa4a7260aa1b630b0" });
});
afterEach(() => {
  cleanup();
});
enableAutoUnmount(afterEach);

describe("Given a SpecialCourse page", () => {
  describe("When it is rendered", () => {
    test("Then it should call dispatch method with 'getWebContent'", () => {
      const wrapper = mount(SpecialCourse, wrapperOptions);

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("getWebContent");
    });

    test("Then the backgroundColor should be changed to 'white' on component mounted", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wrapper = mount(SpecialCourse, wrapperOptions);

      expect(document.body.style.backgroundColor).toBe("white");
    });

    test("Then it should render the title of the page", () => {
      const wrapper = mount(SpecialCourse, wrapperOptions);

      const title = wrapper.find(".special-courses-title");

      expect(title.exists()).toBe(true);
    });

    test("Then it should render NCard component", () => {
      const wrapper = mount(SpecialCourse, wrapperOptions);

      const nCardComponent = wrapper.findComponent(NCard);

      expect(nCardComponent.exists()).toBe(true);
    });

    test("Then NCard classes should contain 'n-card--hoverable'", () => {
      const wrapper = mount(SpecialCourse, wrapperOptions);

      const nCardComponent = wrapper.findComponent(NCard);

      expect(nCardComponent.classes()).toStrictEqual(["n-card", "n-card--hoverable"]);
    });

    test("Then it should show Footer component", async () => {
      const wrapper = mount(SpecialCourse, wrapperOptions);

      const footerComponent = await wrapper.findComponent(Footer);

      expect(footerComponent.exists()).toBe(true);
    });

    test("Then it should show link to go back to Special Courses page", async () => {
      const wrapper = mount(SpecialCourse, wrapperOptions);

      const link = await wrapper.findComponent(".nav-link");

      expect(link.html()).toContain("/special-courses");
    });
  });
});
