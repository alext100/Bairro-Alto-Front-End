import News from "@/pages/MainPageComponents/News.vue";
import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { TippyPlugin } from "tippy.vue";
import { MotionPlugin } from "@vueuse/motion";

import { cleanup } from "@testing-library/vue";
import state from "../../mockedState";

const store = createStore({
  state() {
    return state;
  },
});

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());

const newsBody = [
  {
    title: " ",
    body: "<p>News number one.</p>",
  },
  {
    title: " ",
    body: "<p>News number two.</p>",
  },
  {
    title: " ",
    body: "<p><p>News number three.</p>",
  },
  {
    title: " ",
    body: "<p><p>News number four.</p>",
  },
];
describe("Given a News component of the Main page", () => {
  describe("When it is received props newsBody", () => {
    test("Then it should show carousel with all the news", () => {
      const wrapper = mount(News, {
        global: {
          plugins: [store, TippyPlugin, MotionPlugin],
        },
        props: { newsBody },
      });

      const carousel = wrapper.find('[data-test="news-carousel"]');
      const newsCards = wrapper.findAll(".news__body");

      expect(carousel.exists()).toBe(true);
      expect(newsCards[0].html()).toContain("News number four");
      expect(newsCards[1].html()).toContain("News number one");
      expect(newsCards[2].html()).toContain("News number two");
    });
  });

  test("Then it should render the same number of dots as number of received news", async () => {
    const wrapper = mount(News, {
      global: {
        plugins: [store, TippyPlugin, MotionPlugin],
      },
      props: { newsBody },
    });

    const dotsList = await wrapper.find(".custom-dots");

    expect(dotsList.element.childElementCount).toBe(newsBody.length);
  });

  test("Then it should render prev and next arrows", async () => {
    const wrapper = mount(News, {
      global: {
        plugins: [store, TippyPlugin, MotionPlugin],
      },
      props: { newsBody },
    });

    const prevArrow = await wrapper.find(".custom-arrow--left");
    const nextArrow = await wrapper.find(".custom-arrow--right");

    expect(prevArrow.exists()).toBe(true);
    expect(nextArrow.exists()).toBe(true);
  });
});
