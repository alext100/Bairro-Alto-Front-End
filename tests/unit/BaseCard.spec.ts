import BaseCard from "@/components/BaseCard.vue";
import { cleanup } from "@testing-library/vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { h } from "vue";

afterEach(() => {
  cleanup();
});
enableAutoUnmount(afterEach);

describe("Given a BaseCard Component", () => {
  describe("When it is rendered", () => {
    test("Then it should render a div element with '.card' class", () => {
      const wrapper = mount(BaseCard, {});

      const card = wrapper.find(".card");

      expect(card.exists()).toBe(true);
    });
  });

  describe("When it receives a props 'hover' with true value", () => {
    test("Then it should have class 'card-lift--hover'", () => {
      const wrapper = mount(BaseCard, {
        props: { hover: true },
      });

      const card = wrapper.find(".card");

      expect(card.classes()).toContain("card-lift--hover");
    });
  });

  describe("When it receives a props 'shadow' with true value", () => {
    test("Then it should have class 'shadow'", () => {
      const wrapper = mount(BaseCard, {
        props: { shadow: true },
      });

      const card = wrapper.find(".card");

      expect(card.classes()).toContain("shadow");
    });
  });

  describe("When it receives a props 'shadowSize' with value 'sm'", () => {
    test("Then it should have class 'shadow-sm'", () => {
      const wrapper = mount(BaseCard, { props: { shadowSize: "sm" } });

      const card = wrapper.find(".card");

      expect(card.classes()).toContain("shadow-sm");
    });
  });

  describe("When it receives a props 'shadowSize' with value 'lg'", () => {
    test("Then it should have class 'shadow-lg'", () => {
      const wrapper = mount(BaseCard, { props: { shadowSize: "lg" } });

      const card = wrapper.find(".card");

      expect(card.classes()).toContain("shadow-lg");
    });
  });

  describe("When it receives a props 'shadowSize' with value 'none'", () => {
    test("Then it should have class 'shadow-none'", () => {
      const wrapper = mount(BaseCard, { props: { shadowSize: "none" } });

      const card = wrapper.find(".card");

      expect(card.classes()).toContain("shadow-none");
    });
  });

  describe("When the component is rendered with v-slot:header", () => {
    test("Then it should have class 'card-header'", () => {
      const wrapper = mount(BaseCard, {
        slots: { header: h("h3", {}, "Header slot content") },
      });

      expect(wrapper.html()).toContain("card-header");
    });

    test("Then it should render an element inside this slot", () => {
      const wrapper = mount(BaseCard, {
        slots: { header: h("h3", {}, "Header slot content") },
      });
      const HtmlStringWithSlotElement = "<h3>Header slot content</h3>";

      expect(wrapper.html()).toContain(HtmlStringWithSlotElement);
    });
  });

  describe("When the component is rendered with v-slot:body", () => {
    test("Then it should have class 'card-body'", () => {
      const wrapper = mount(BaseCard, {
        slots: { body: h("p", {}, "Body slot content") },
      });

      expect(wrapper.html()).toContain("card-body");
    });

    test("Then it should render an element inside this slot", () => {
      const wrapper = mount(BaseCard, {
        slots: { default: h("div", {}, "Body slot content") },
      });
      const HtmlStringWithSlotElement = "<div>Body slot content</div>";

      expect(wrapper.html()).toContain(HtmlStringWithSlotElement);
    });
  });

  describe("When the component is rendered with v-slot:footer", () => {
    test("Then it should have class 'card-footer'", () => {
      const wrapper = mount(BaseCard, {
        slots: { footer: h("div", {}, "Some footer content") },
      });

      expect(wrapper.html()).toContain("card-footer");
    });

    test("Then it should render an element inside this slot", () => {
      const wrapper = mount(BaseCard, {
        slots: { footer: h("div", {}, "Some footer content") },
      });
      const HtmlStringWithSlotElement = "<div>Some footer content</div>";

      expect(wrapper.html()).toContain(HtmlStringWithSlotElement);
    });
  });
});
