<template>
  <Header />
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./views/Header.vue";

export default defineComponent({
  name: "app",
  components: { Header },
});
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
#app {
  font-family: Noto Sans, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
:root {
  --primary-color: #0071fe;
  --error-color: #f23648;
  --error-bg-color: #fddfe2;
  --success-color: #21a67a;
  --success-bg-color: #e0eee4;
  --bairro-alto-logo-color: #fcb73c;
}
</style>
