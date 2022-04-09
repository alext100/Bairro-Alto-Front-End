import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { createStore } from "vuex";
import Header from "@/components/Header.vue";
import { cleanup } from "@testing-library/vue";
import state from "../mockedState";

const store = createStore({
  state() {
    return state;
  },
  actions: { deleteDataFromLocalStorage: jest.fn() },
  mutations: { logoutUser: jest.fn() },
});

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a Header component", () => {
  describe("When it is rendered", () => {
    test("Then it should show logo", async () => {
      const wrapper = mount(Header, {
        global: {
          plugins: [store],
        },
      });

      const logoSubstring = `data-target=".navbar-collapse.show"`;

      expect(wrapper.html()).toContain(logoSubstring);
    });

    test("Then it should show navbar toggle button", async () => {
      const wrapper = mount(Header, {
        global: {
          plugins: [store],
        },
      });

      const button = await wrapper.find("button.navbar-toggler");

      expect(button.exists()).toBe(true);
    });

    describe("When a user is not logged in", () => {
      test("Then it should show 11 links to other site pages", async () => {
        const wrapper = mount(Header, {
          global: {
            plugins: [store],
          },
        });

        const listOfLinks = wrapper.find(".navbar-nav").findAll("li");

        expect(listOfLinks.length).toBe(11);
      });
    });

    describe("When current user is not logged in as admin, teacher o student", () => {
      test("Then it should not show links to '/cms', '/teacher', '/student/' pages", async () => {
        state.isUserAuthenticated = false;
        state.currentUser.adminAccess = false;
        state.currentUser.teacherAccess = false;
        state.currentUser.studentAccess = false;
        const wrapper = mount(Header, {
          global: {
            plugins: [store],
          },
        });

        expect(wrapper.html()).not.toContain("/cms");
        expect(wrapper.html()).not.toContain("/teacher");
        expect(wrapper.html()).not.toContain("student-board");
      });
    });

    describe("When current user is logged in as admin, teacher o student", () => {
      test("Then it should show links to '/cms', '/teacher', '/student/' pages", async () => {
        state.isUserAuthenticated = true;
        state.currentUser.adminAccess = true;
        state.currentUser.teacherAccess = true;
        state.currentUser.studentAccess = true;
        const wrapper = mount(Header, {
          global: {
            plugins: [store],
          },
        });

        const studentBoardNavLink = wrapper.find("li.student-board");

        expect(wrapper.html()).toContain("/cms");
        expect(wrapper.html()).toContain("/teacher");
        expect(wrapper.html()).toContain(studentBoardNavLink);
      });
    });
  });
});
