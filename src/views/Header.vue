<template>
  <nav class="navbar navbar-expand-xl navbar-light bg-light header-navbar">
    <div class="container-fluid">
      <router-link to="/" data-target=".navbar-collapse.show" data-toggle="collapse">
        <img class="logo-image" src="../../public/BA_VK_Template_1_1_logo_h50_1.webp" alt="logo" />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item" data-target=".navbar-collapse.show" data-toggle="collapse">
            <a class="nav-link" href="#">Мероприятия</a>
          </li>
          <li class="nav-item" data-target=".navbar-collapse.show" data-toggle="collapse">
            <a class="nav-link" href="#">Спецкурсы</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Курсы
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li data-target=".navbar-collapse.show" data-toggle="collapse">
                <a class="dropdown-item" href="#">Хочу изучать с нуля в школе</a>
              </li>
              <li data-target=".navbar-collapse.show" data-toggle="collapse">
                <a class="dropdown-item" href="#">Хочу изучать с нуля в онлайн</a>
              </li>
              <li data-target=".navbar-collapse.show" data-toggle="collapse">
                <a class="dropdown-item" href="#">Хочу продолжить обучение в школе</a>
              </li>
              <li data-target=".navbar-collapse.show" data-toggle="collapse">
                <a class="dropdown-item" href="#">Хочу продолжить обучение онлайн</a>
              </li>
            </ul>
          </li>
          <li class="nav-item" data-target=".navbar-collapse.show" data-toggle="collapse">
            <a class="nav-link" href="#">Материалы</a>
          </li>

          <li v-if="!isUserAuthenticated" class="nav-item" data-target=".navbar-collapse.show" data-toggle="collapse">
            <router-link class="nav-link" to="/login">{{ "Войти" }} </router-link>
          </li>

          <li
            v-if="currentUser.adminAccess"
            class="nav-item"
            data-target=".navbar-collapse.show"
            data-toggle="collapse"
          >
            <router-link class="nav-link" to="/admin">{{ "Администраторская" }} </router-link>
          </li>
          <li
            v-if="currentUser.teacherAccess"
            class="nav-item"
            data-target=".navbar-collapse.show"
            data-toggle="collapse"
          >
            <router-link class="nav-link" to="/teacher">{{ "Учительская" }}</router-link>
          </li>
          <li
            v-if="currentUser.studentAccess"
            class="nav-item"
            data-target=".navbar-collapse.show"
            data-toggle="collapse"
          >
            <router-link class="nav-link" :to="{ name: 'StudentBoard', params: { id: currentUser.id } }">{{
              "Мойкабинет"
            }}</router-link>
          </li>

          <li v-if="isUserAuthenticated" class="nav-item" data-target=".navbar-collapse.show" data-toggle="collapse">
            <router-link class="nav-link" to="/"
              ><button class="logout-button" @click="handleLogout()" data-test="logout">Выйти</button></router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

export default defineComponent({
  name: "Header",
  computed: { ...mapState(["isUserAuthenticated", "currentUser"]) },
  methods: {
    ...mapActions(["deleteDataFromLocalStorage"]),
    handleLogout() {
      this.deleteDataFromLocalStorage();
      this.$router.push("/");
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
.header-navbar,
.logout-button {
  background: url("../../public/BA_VK_Template_1_1_header_no_logo_h50_2.webp") no-repeat top left;
  margin: 0;
  padding-bottom: 0;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1.1rem;
  line-height: 1.1875;
  letter-spacing: 0.4em;
}
.logout-button {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  background-color: transparent;
  border: transparent;
}
a,
.logout-button {
  color: #d59758 !important;
  font-family: Noto Sans, Arial, sans-serif;
}

.logo-image {
  padding-left: 36px;
  margin-top: -7px;
}
</style>
