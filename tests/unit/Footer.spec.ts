import Footer from "@/components/Footer.vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { cleanup } from "@testing-library/vue";

afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given a Footer component", () => {
  describe("When it rendered", () => {
    test("Then it should show link to the map", () => {
      const wrapper = mount(Footer);

      const substringMapLink = `href="https://yandex.ru/maps/?um=constructor%3A2e415a0bb2bba62dfb822d8971d352e500377fb6eea3642ba0bbb162b579278f&amp;source=constructorLink"`;

      expect(wrapper.html()).toContain(substringMapLink);
    });

    test("Then it should show link to vk.com site", () => {
      const wrapper = mount(Footer);

      const substringVkLink = `<a href="https://vk.com/bairroalto">`;

      expect(wrapper.html()).toContain(substringVkLink);
    });

    test("Then it should show link to Instagram", () => {
      const wrapper = mount(Footer);

      const substringInstagramLink = `<a href="https://www.instagram.com/bairroaltospb/">`;

      expect(wrapper.html()).toContain(substringInstagramLink);
    });

    test("Then it should show link to email", () => {
      const wrapper = mount(Footer);

      const substringEmailLink = `<a href="mailto:info@viaromaspb.ru">info@viaromaspb.ru</a>`;

      expect(wrapper.html()).toContain(substringEmailLink);
    });

    test("Then it should show link to phone", () => {
      const wrapper = mount(Footer);

      const substringInstagramLink = `<a href="tel:+79219033125">+7 921 903 31 25 (с 12:00 до 21:00)</a>`;

      expect(wrapper.html()).toContain(substringInstagramLink);
    });

    test("Then it should show owner info", () => {
      const wrapper = mount(Footer);

      const substringInstagramLink = `<li class="contacts-item">ИП Городецкая Татьяна Евгеньевна ИНН 780150375249 ОГРНИП 321784700091455</li>`;

      expect(wrapper.html()).toContain(substringInstagramLink);
    });
  });
});
