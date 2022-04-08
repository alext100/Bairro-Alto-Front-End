import Teachers from "@/pages/MainPageComponents/Teachers.vue";
import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { TippyPlugin } from "tippy.vue";

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

const allTeachers = [
  {
    title: "Виктория",
    body: "<h1>&nbsp;</h1><Виктория>\n</div>",
    category: "Преподаватели",
    id: "624a956fa4a7067aa1b235467",
  },
  {
    title: "Маргарита",
    body: "<h1>&nbsp;</h1>Маргарита\n</div>",
    category: "Преподаватели",
    id: "624a967fa4a7967aa1b2345678",
  },
  {
    title: "Ольга",
    body: "<h1>&nbsp;</h1><Ольга>\n</div>",
    category: "Преподаватели",
    id: "624a457fa4a78670aa1b45689",
  },
];
describe("Given a Teachers component of the Main page", () => {
  describe("When it is received props allTeachers", () => {
    test("Then it should show carousel with all the teachers profiles", () => {
      const wrapper = mount(Teachers, {
        global: {
          plugins: [store, TippyPlugin],
        },
        props: { allTeachers },
      });

      const carousel = wrapper.find('[data-test="teachers-carousel"]');
      const teachersCards = wrapper.findAll(".teacher__body");

      expect(carousel.exists()).toBe(true);
      expect(teachersCards[1].html()).toContain("Виктория");
      expect(teachersCards[2].html()).toContain("Маргарита");
      expect(teachersCards[0].html()).toContain("Ольга");
    });
  });

  test("Then it should render the same number of dots as number of teachers", async () => {
    const wrapper = mount(Teachers, {
      global: {
        plugins: [store, TippyPlugin],
      },
      props: { allTeachers },
    });

    const dotsList = await wrapper.find(".custom-dots");

    expect(dotsList.element.childElementCount).toBe(allTeachers.length);
  });

  test("Then it should render prev and next arrows", async () => {
    const wrapper = mount(Teachers, {
      global: {
        plugins: [store, TippyPlugin],
      },
      props: { allTeachers },
    });

    const prevArrow = await wrapper.find(".custom-arrow--left");
    const nextArrow = await wrapper.find(".custom-arrow--right");

    expect(prevArrow.exists()).toBe(true);
    expect(nextArrow.exists()).toBe(true);
  });
});
