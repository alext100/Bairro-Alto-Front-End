import TextInput from "@/components/TextInput.vue";
import { cleanup } from "@testing-library/vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";

afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a TextInput component", () => {
  describe("When it is rendered with received required props: label and name", () => {
    test("Then it should show input with received name and received label", () => {
      const wrapper = mount(TextInput, {
        props: { label: "E-mail", name: "email" },
      });

      const textInput = wrapper.find("input");
      const label = wrapper.find("label");

      expect(textInput.html()).toContain('name="email"');
      expect(label.text()).toBe("E-mail");
    });
  });

  describe("When it is rendered with props: type, step, min, max, value, name, placeholder", () => {
    test("Then it should show input with received props", () => {
      const wrapper = mount(TextInput, {
        props: {
          type: "email",
          step: "100",
          min: "0",
          max: "5000",
          value: "",
          name: "email",
          placeholder: "Enter email",
          label: "Email",
        },
      });
      const props = {
        name: "email",
        id: "email",
        type: "email",
        step: "100",
        min: "0",
        max: "5000",
        placeholder: "Enter email",
      };

      const textInput = wrapper.find("input");

      expect(textInput.attributes()).toEqual(props);
    });
  });

  describe("When it received successMessage", () => {
    test("Then it should show help message with received text", () => {
      const wrapper = mount(TextInput, {
        props: { label: "E-mail", name: "email", successMessage: "It is OK!" },
      });

      const helpMessage = wrapper.find(".help-message");

      expect(helpMessage.text()).toContain("It is OK!");
    });
  });
});
