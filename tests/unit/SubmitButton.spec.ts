import SubmitButton from "@/components/SubmitButton.vue";
import { cleanup } from "@testing-library/vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";

afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a SubmitButton component", () => {
  describe("When it is rendered with received props: buttonType = 'submit'", () => {
    test("Then it should show button with received type", () => {
      const wrapper = mount(SubmitButton, {
        props: { buttonType: "submit" },
      });

      const button = wrapper.find(".submit-btn");

      expect(button.attributes().type).toContain("submit");
    });
  });

  describe("When it is rendered with wrong received props: buttonType = 'ssubmit'", () => {
    test("Then validator should return 'false'", () => {
      const wrongButtonType = "ssubmit";
      const wrapper = mount(SubmitButton, {
        props: { buttonType: wrongButtonType },
      });

      const validator = wrapper.vm.$options.props.buttonType.validator(wrongButtonType);

      expect(validator).toBe(false);
    });
  });

  describe("When it is rendered with no props buttonType", () => {
    test("Then it should show button with no 'type' attribute", () => {
      const wrapper = mount(SubmitButton, {
        props: {},
      });

      const button = wrapper.find(".submit-btn");

      expect(button.attributes().type).not.toBeDefined();
    });
  });

  describe("When it is rendered with received props: buttonDisabled = true", () => {
    test("Then the button should has 'disabled' attribute", () => {
      const wrapper = mount(SubmitButton, {
        props: { buttonDisabled: true },
      });

      const button = wrapper.find(".submit-btn");

      expect(button.attributes().disabled).toBeDefined();
    });
  });

  describe("When it is rendered with default slot", () => {
    test("Then the button should has text received in this slot", () => {
      const wrapper = mount(SubmitButton, {
        slots: { default: "Submit login" },
      });

      const button = wrapper.find(".submit-btn");

      expect(button.text()).toBe("Submit login");
    });
  });
});
