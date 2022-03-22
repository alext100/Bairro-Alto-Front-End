<template>
  <footer class="container pageFooter d-flex justify-content-center">
    <div class="pageFooter-info">
      <div class="pageFooter-map" id="yandex-map"></div>
      <address class="pageFooter-address">
        <a
          href="https://yandex.ru/maps/?um=constructor%3A2e415a0bb2bba62dfb822d8971d352e500377fb6eea3642ba0bbb162b579278f&amp;source=constructorLink"
          target="_blank"
          >Bairro Alto, 2-я линия ВО, д. 37, последний этаж</a
        >
      </address>
      <ul class="rowSep pageFooter-contacts">
        <li class="contacts-item contacts-item-link">
          <a href="https://vk.com/bairroalto">
            <em class="fab fa-vk" />
          </a>
        </li>
        <li class="contacts-item contacts-item-link">
          <a href="https://www.instagram.com/bairroaltospb/">
            <em class="fas fa-ban" alt="instagram" />
          </a>
        </li>
        <li class="contacts-item-mail">
          <a href="mailto:info@viaromaspb.ru">info@viaromaspb.ru</a>
        </li>
        <li class="contacts-item-phone">
          <a href="tel:+79219033125">+7 921 903 31 25 (с 12:00 до 21:00)</a>
        </li>
      </ul>
      <ul class="contacts pageFooter-links">
        <li class="contacts-item">ИП Городецкая Татьяна Евгеньевна ИНН 780150375249 ОГРНИП 321784700091455</li>
      </ul>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
});
</script>

<style scoped>
.pageFooter-info {
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  background-color: white;
}
.pageFooter-contacts {
  max-width: 500px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-decoration: none;
}
a {
  text-decoration: none;
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
}
a:hover {
  color: #8b5c29 !important;
}
em {
  font-size: 18px;
}
.contacts-item-mail a,
.contacts-item-phone a {
  color: black;
}
li {
  list-style: none;
}
ul {
  padding: 0;
}
@media (max-width: 479px) {
  .pageFooter-contacts {
    display: flex;
    flex-direction: column;
  }
}
.pageFooter {
  margin-top: 30px;
  margin-bottom: 30px;
  border-top: 1px solid var(--hover-color);
}
</style>
