<template>
  <nav :class="['navbar', expandClass, 'navbar-light', 'bg-light', 'header-navbar', 'ps-5']">
    <div class="container-fluid">
      <router-link to="/" data-target=".navbar-collapse.show" data-toggle="collapse">
        <img
          class="logo-image"
          src="https://firebasestorage.googleapis.com/v0/b/bairro-alto.appspot.com/o/BA_VK_Template_1_1_logo_h50_1.webp?alt=media&token=8285cfba-9833-4ce1-bc65-f9f37a235f12"
          alt="logo"
        />
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
            <router-link class="nav-link" to="/events">Мероприятия</router-link>
          </li>
          <li class="nav-item" data-target=".navbar-collapse.show" data-toggle="collapse">
            <router-link class="nav-link" to="/special-courses">Спецкурсы</router-link>
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
                <router-link class="dropdown-item" to="/courses/new-school">Хочу изучать с нуля в школе</router-link>
              </li>
              <li data-target=".navbar-collapse.show" data-toggle="collapse">
                <router-link class="dropdown-item" to="/courses/new-online">Хочу изучать с нуля в онлайн</router-link>
              </li>
              <li data-target=".navbar-collapse.show" data-toggle="collapse">
                <router-link class="dropdown-item" to="/courses/cont-school"
                  >Хочу продолжить обучение в школе</router-link
                >
              </li>
              <li data-target=".navbar-collapse.show" data-toggle="collapse">
                <router-link class="dropdown-item" to="/courses/cont-online"
                  >Хочу продолжить обучение онлайн</router-link
                >
              </li>
              <li data-target=".navbar-collapse.show" data-toggle="collapse">
                <router-link class="dropdown-item" to="/courses">Расписание и информация об уровнях</router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item" data-target=".navbar-collapse.show" data-toggle="collapse">
            <router-link class="nav-link" to="/materials">Материалы</router-link>
          </li>
          <li class="nav-item" data-target=".navbar-collapse.show" data-toggle="collapse">
            <router-link class="nav-link" to="/payment">Оплатить</router-link>
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
            <router-link class="nav-link" to="/cms">{{ "Администраторская" }} </router-link>
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
            v-if="currentUser.studentAccess && currentUser.id"
            class="nav-item student-board"
            data-target=".navbar-collapse.show"
            data-toggle="collapse"
          >
            <router-link class="nav-link" :to="{ name: 'StudentBoard', params: { id: currentUser.id } }">{{
              "Мой кабинет"
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
  computed: {
    ...mapState(["isUserAuthenticated", "currentUser"]),
    expandClass() {
      const accessCount = [
        this.currentUser.adminAccess,
        this.currentUser.studentAccess,
        this.currentUser.teacherAccess,
      ].filter(Boolean).length;

      if (accessCount >= 2) {
        return "navbar-expand-l";
      }
      return "navbar-expand-xl";
    },
  },
  methods: {
    ...mapActions(["deleteDataFromLocalStorage", "checkTokenValidity"]),
    handleLogout() {
      this.deleteDataFromLocalStorage();
      this.$router.push("/");
    },
  },
  async mounted() {
    await this.checkTokenValidity();
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
.header-navbar,
.logout-button {
  margin: 0;
  padding-bottom: 0;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1.1rem;
  line-height: 1.1875;
  letter-spacing: 0.4em;
}

.header-navbar {
  background-image: url("../../public/BA_VK_Template_1_1_header_no_logo_421x49.webp");
  background-repeat: repeat-x;
}
.logout-button {
  padding-right: 0.5rem;
  padding-left: 0;
  background-color: transparent;
  border: transparent;
}
a,
.logout-button {
  color: var(--hover-color) !important;
  font-family: Noto Sans, Arial, sans-serif;
}
.logo-image {
  padding-left: 36px;
  margin-top: -7px;
}
.nav-link {
  white-space: nowrap;
}
.dropdown-toggle::after {
  margin-left: -10px;
}
.navbar-toggler {
  margin-top: -10px;
}
</style>
