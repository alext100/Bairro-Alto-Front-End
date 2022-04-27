import { createStore } from "vuex";
import Courses from "@/pages/Courses.vue";
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

describe("Given a Courses page", () => {
  describe("When it is rendered", () => {
    test("Then it should call dispatch method with 'getWebContent'", () => {
      const wrapper = mount(Courses, wrapperOptions);

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("getWebContent");
    });

    test("Then the backgroundColor should be changed to 'white' on component mounted", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wrapper = mount(Courses, wrapperOptions);

      expect(document.body.style.backgroundColor).toBe("white");
    });

    test("Then it should show Footer", () => {
      const wrapper = mount(Courses, wrapperOptions);
      const footer = wrapper.findComponent(Footer);

      expect(footer.exists()).toBe(true);
    });

    test("Then it should show the article about school courses", () => {
      const wrapper = mount(Courses, wrapperOptions);
      const stringFromArticle = `<strong>ОБУЧЕНИЕ В ШКОЛЕ</strong>`;

      expect(wrapper.html()).toContain(stringFromArticle);
    });
  });
});
