<template>
  <div class="container d-flex justify-content-center m-5">
    <n-card
      size="huge"
      hoverable
      :bordered="false"
      embedded
      content-style="align-self: center; font-size: 20px;"
      footer-style="display: flex; justify-content: center;"
      >Аккаунт активирован!
      <template #footer>
        <router-link class="login-link" to="/Login"> Войти </router-link>
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { NCard } from "naive-ui";
import { useRoute } from "vue-router";
import { useHead } from "@vueuse/head";
import { computed, onMounted, reactive } from "vue";

const siteData = reactive({
  title: `Добро пожаловать`,
  description: `Школа португальского языка в Санкт-Петербурге Байрру Алту, Bairro Alto`,
});
useHead({
  title: computed(() => siteData.title),
  meta: [
    {
      name: `description`,
      content: computed(() => siteData.description),
    },
  ],
});

const route = useRoute();
const { dispatch } = useStore();

onMounted(() => {
  dispatch("verifyUser", route.params.confirmationCode);
});
</script>

<style scoped>
.n-card {
  max-width: fit-content;
}
.login-link {
  text-decoration: none;
  font-size: 22px;
  font-weight: 600;
  color: var(--bairro-alto-logo-color);
}
.login-link:hover {
  color: var(--hover-color);
}
</style>
