import { createStore } from "vuex";
import { TippyPlugin } from "tippy.vue";
import { cleanup } from "@testing-library/vue";
import Group from "@/views/TeacherBoard/Group.vue";
import { NCard, NTabs, NTabPane, NH1 } from "naive-ui";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import OnlineLessonVue from "@/views/TeacherBoard/OnlineLesson.vue";
import GroupMembersVue from "@/views/TeacherBoard/GroupMembers.vue";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import GroupInputMessageVue from "@/views/TeacherBoard/GroupInputMessage.vue";
import state from "../mockedState";

/* mock of ag-grid-vue3 in components: */
jest.mock("@/views/TeacherBoard/GroupAddUser.vue", () => ({ __esModule: true }));
jest.mock("@/views/TeacherBoard/StudentErrors.vue", () => ({ __esModule: true }));
jest.mock("@/views/TeacherBoard/GroupAddDeleteLesson.vue", () => ({ __esModule: true }));

const store = createStore({
  state() {
    return state;
  },
});

const wrapperOptions = {
  global: {
    plugins: [store, TippyPlugin],
    stubs: {
      AddUserVue: { template: "<i />" },
      GroupMembersVue: { template: "<i />" },
      OnlineLessonVue: { template: "<i />" },
      StudentErrorsVue: { template: "<i />" },
      GroupInputMessageVue: { template: "<i />" },
      GroupAddDeleteLesson: { template: "<i />" },
      RouterLink: false,
    },
  },
  components: {
    NH1,
    NCard,
    NTabs,
    NTabPane,
    GroupMembersVue,
    OnlineLessonVue,
    GroupInputMessageVue,
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

describe("Given a Group view", () => {
  describe("When it is rendered", () => {
    test("Then it should render n-tabs component with 5 tabs", () => {
      const wrapper = mount(Group, wrapperOptions);

      const tabs = wrapper.find(".n-tabs");

      expect(tabs.html()).toContain("Студенты группы");
      expect(tabs.html()).toContain("Домашнее задание");
      expect(tabs.html()).toContain("Добавить студента в группу");
      expect(tabs.html()).toContain("Онлайн-заметки");
      expect(tabs.html()).toContain("Уроки группы");
    });

    test("Then it should render GroupMembers component", () => {
      const wrapper = mount(Group, wrapperOptions);

      const GroupMembersComponent = wrapper.findComponent(GroupMembersVue);

      expect(GroupMembersComponent.exists()).toBe(true);
    });

    test("Then it should render OnlineLesson component", () => {
      const wrapper = mount(Group, wrapperOptions);

      const OnlineLessonComponent = wrapper.findComponent(OnlineLessonVue);

      expect(OnlineLessonComponent.exists()).toBe(true);
    });

    test("Then it should render GroupInputMessageVue component", () => {
      const wrapper = mount(Group, wrapperOptions);

      const GroupInputMessageComponent = wrapper.findComponent(GroupInputMessageVue);

      expect(GroupInputMessageComponent.exists()).toBe(true);
    });

    test("Then it should render backward icon element", () => {
      const wrapper = mount(Group, wrapperOptions);

      const tabs = wrapper.find(".backward-icon");

      expect(tabs.exists()).toBe(true);
    });

    test("Then it should render h1 with group name taken from state.currentGroup.groupName", () => {
      const wrapper = mount(Group, wrapperOptions);

      const NH1Element = wrapper.find(".n-h1");

      expect(NH1Element.html()).toContain('<h1 class="n-h n-h1 m-3">Группа A1. Вторник / Четверг</h1>');
    });
  });

  describe("When a user click the backward arrow icon", () => {
    test("Then it should call router.push with '/teacher'", async () => {
      const wrapper = mount(Group, wrapperOptions);
      const backwardArrow = wrapper.find(".backward-icon");

      await backwardArrow.trigger("click");

      expect(wrapper.vm.$router.push).toHaveBeenCalledWith("/teacher");
    });
  });
});
