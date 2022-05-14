import StudentErrors from "@/views/TeacherBoard/StudentErrors.vue";
import { cleanup } from "@testing-library/vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { AgGridVue } from "ag-grid-vue3";
import { TippyPlugin } from "tippy.vue";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { createStore } from "vuex";
import state from "../mockedState";

jest.mock("ag-grid-vue3", () => ({ __esModule: true }));

const store = createStore({
  state() {
    return state;
  },
  actions: { getGroupErrorsById: jest.fn() },
});

const wrapperOptions = {
  global: {
    plugins: [store, TippyPlugin],
    stubs: { AgGridVue: { template: "<i />" } },
  },
  components: { AgGridVue },
  data() {
    return { rowIsSelected: true };
  },
};

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => {
  cleanup();
});
enableAutoUnmount(afterEach);

describe("Given a StudentErrors view", () => {
  describe("When it is rendered and a row is selected", () => {
    test("Then it should render button element", () => {
      const wrapper = mount(StudentErrors, wrapperOptions);

      const button = wrapper.find('[data-test="deleteRowButton"]');

      expect(button.exists()).toBe(true);
    });

    test("Then it should render AgGridVue component", () => {
      const wrapper = mount(StudentErrors, wrapperOptions);

      const AgGridVueComponent = wrapper.find(".student-errors-container__ag-theme-alpine");

      expect(AgGridVueComponent.exists()).toBe(true);
    });
  });
});
