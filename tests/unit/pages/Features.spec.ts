import Features from "@/pages/MainPageComponents/Features.vue";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { TippyPlugin } from "tippy.vue";
import { MotionPlugin } from "@vueuse/motion";
import { cleanup, render } from "@testing-library/vue";
import "@testing-library/jest-dom";

import { mount } from "@vue/test-utils";
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

const methodic = [
  {
    title: "Лексический подход - главная страница text-disabled",
    body: "<h1>&nbsp;</h1><p>Преподаём по лексическому подходу — то есть делаем акцент на запоминании и использовании не отдельных слов, а фраз и словосочетаний — так легче запоминать слова и легче научиться разговаривать.</p>",
    category: "Методика",
    id: "624a567fa4a7260aa1b45689",
  },
];
const methodicBody = {
  title: " ",
  body: "<p>Преподаём по лексическому подходу — то есть делаем акцент на запоминании и использовании не отдельных слов, а фраз и словосочетаний — так легче запоминать слова и легче научиться разговаривать.</p>",
};
const atmosphere = [
  {
    title: "Атмосфера - главная страница text-disabled",
    body: "<h1>&nbsp;</h1><p>Школа небольшая и уютная. Аудитории школы находятся в мансарде. В перерывах пьём чай (иногда вино), едим печенье и листаем книги на итальянском.</p>",
    category: "Атмосфера",
    id: "624a567fa4a7260aa1b45678",
  },
];
const atmosphereBody = {
  title: " ",
  body: "<p>Школа небольшая и уютная. Аудитории школы находятся в мансарде. В перерывах пьём чай (иногда вино), едим печенье и листаем книги на итальянском.</p>",
};

describe("Given a Features component of the Main page", () => {
  describe("When it is received props  methodic, methodicBody, atmosphere, atmosphereBody", () => {
    test("Then it should render headings with links to methodic and atmosphere pages", () => {
      const { getByRole } = render(Features, {
        global: {
          stubs: { RouterLink: false },
          plugins: [store, TippyPlugin, MotionPlugin],
        },
        props: { methodic, methodicBody, atmosphere, atmosphereBody },
      });

      const MethodicTitle = getByRole("heading", { name: /Методика/i });
      const AtmosphereTitle = getByRole("heading", { name: /Атмосфера/i });
      const MethodicLink = getByRole("link", { name: /Методика/i });
      const AtmosphereLink = getByRole("link", { name: /Атмосфера/i });

      expect(MethodicTitle).toBeInTheDocument();
      expect(AtmosphereTitle).toBeInTheDocument();
      expect(MethodicLink).toBeInTheDocument();
      expect(AtmosphereLink).toBeInTheDocument();
    });

    describe("And when a user click on 'Methodic'", () => {
      test("Then router.push should be called with '/methodic'", async () => {
        const wrapper = mount(Features, {
          global: {
            stubs: { RouterLink: false },
            plugins: [store, TippyPlugin, MotionPlugin],
          },
          props: { methodic, methodicBody, atmosphere, atmosphereBody },
        });

        const methodicLink = wrapper.find('[data-test="features-item-methodic"]');
        await methodicLink.trigger("click");

        expect(wrapper.vm.$router.push).toHaveBeenCalledWith("/methodic");
      });
    });

    describe("And when a user click on 'Atmosphere'", () => {
      test("Then router.push should be called with '/atmosphere'", async () => {
        const wrapper = mount(Features, {
          global: {
            stubs: { RouterLink: false },
            plugins: [store, TippyPlugin, MotionPlugin],
          },
          props: { methodic, methodicBody, atmosphere, atmosphereBody },
        });

        const atmosphereLink = wrapper.find('[data-test="features-item-atmosphere"]');
        await atmosphereLink.trigger("click");

        expect(wrapper.vm.$router.push).toHaveBeenCalledWith("/atmosphere");
      });
    });
  });
});
