import SidebarMenu from "@/components/SidebarMenu.vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import { TippyPlugin } from "tippy.vue";
import { cleanup } from "@testing-library/vue";
import state from "../mockedState";

const store = createStore({
  state() {
    return state;
  },
  actions: { deleteDataFromLocalStorage: jest.fn() },
  mutations: { isRegistered: jest.fn(), notRegistered: jest.fn() },
});

const router = createRouterMock({});
beforeEach(() => {
  injectRouterMock(router);
});
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a SidebarMenu component", () => {
  describe("When it's closed and the user clicks on the open menu icon", () => {
    test("Then it should add class 'open' to sidebar and open it", async () => {
      const wrapper = mount(SidebarMenu, {
        global: {
          plugins: [store, TippyPlugin],
        },
      });
      const sidebarOpenClasses = `sidebar open`;
      const openMenuButton = wrapper.find(".bx-menu");

      expect(wrapper.html()).not.toContain(sidebarOpenClasses);

      await openMenuButton.trigger("click");

      expect(wrapper.html()).toContain(sidebarOpenClasses);

      await openMenuButton.trigger("click");

      expect(wrapper.html()).not.toContain(sidebarOpenClasses);
    });
  });

  describe("When the user click on logout icon", () => {
    test("Then it should call 'handleLogout'", async () => {
      const handleLogout = jest.fn();
      handleLogout();
      const wrapper = mount(SidebarMenu, {
        global: {
          plugins: [store, TippyPlugin],
        },
        props: { isExitButton: true },
      });
      const logOutButton = wrapper.find(".profile__logout");

      await logOutButton.trigger("click");

      expect(handleLogout).toHaveBeenCalled();
    });
  });

  describe("When the component get props with profileName", () => {
    test("Then it should show that name", () => {
      const wrapper = mount(SidebarMenu, {
        global: {
          plugins: [store, TippyPlugin],
        },
        props: { profileName: "Sergio" },
      });
      const profileName = wrapper.find(".profile__name");

      expect(profileName.html()).toContain("Sergio");
    });
  });

  describe("When the component get props with profileRole", () => {
    test("Then it should show that role", () => {
      const wrapper = mount(SidebarMenu, {
        global: {
          plugins: [store, TippyPlugin],
        },
        props: { profileRole: "Developer" },
      });
      const profileRole = wrapper.find(".profile__job");

      expect(profileRole.html()).toContain("Developer");
    });
  });

  describe("When the component get props with profileImg", () => {
    test("Then it should show image with received link", () => {
      const wrapper = mount(SidebarMenu, {
        global: {
          plugins: [store, TippyPlugin],
        },
        props: { profileImg: "http://google.com/image.jpg" },
      });
      const profileImage = wrapper.find(".profile__details");

      expect(profileImage.html()).toContain("http://google.com/image.jpg");
    });
  });

  describe("When the component not get props with profileImg", () => {
    test("Then it should show icon with user", () => {
      const wrapper = mount(SidebarMenu, {
        global: {
          plugins: [store, TippyPlugin],
        },
        props: {},
      });
      const profileDetails = wrapper.find(".profile__details");

      expect(profileDetails.html()).toContain("bx bxs-user-rectangle");
    });
  });

  describe("When the component get props with menuLogo", () => {
    test("Then it should show received logo", async () => {
      const wrapper = mount(SidebarMenu, {
        global: {
          plugins: [store, TippyPlugin],
        },
        props: { menuLogo: "http://google.com/logo.jpg" },
      });
      const logoDetails = wrapper.find(".sidebar__logo-details");

      expect(logoDetails.html()).toContain("http://google.com/logo.jpg");

      await wrapper.setProps({ menuLogo: null });

      expect(logoDetails.html()).toContain("menu icon");
    });
  });

  describe("When the component get props with menuTitle", () => {
    test("Then it should show received title", () => {
      const wrapper = mount(SidebarMenu, {
        global: {
          plugins: [store, TippyPlugin],
        },
        props: { menuTitle: "Menu of sidebar" },
      });
      const logoName = wrapper.find(".logo-name");

      expect(logoName.html()).toContain("Menu of sidebar");
    });
  });
});
