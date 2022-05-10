<template>
  <div class="container">
    <div class="ck-content">
      <h1 class="materials-title m-3">Материалы</h1>
      <div class="container cards-container">
        <n-card :bordered="false" hoverable footer-style="font-size:18px">
          <template #header>{{ postToShow[0]?.title }}</template>
          <div v-html="postToShow[0]?.body"></div>
          <template #footer>
            <router-link class="nav-link" to="/materials">Вернуться к материалам</router-link>
          </template>
        </n-card>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { NCard } from "naive-ui";
import { useHead } from "@vueuse/head";
import { Post } from "@/types/interfaces";
import { useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import usePixiGlitchFilter from "@/composables/usePixiGlitchFilter";
import { computed, ComputedRef, onBeforeMount, onMounted, reactive } from "vue";

const route = useRoute();
const { state, dispatch } = useStore();

onBeforeMount(() => dispatch("getWebContent"));
onMounted(() => {
  document.body.style.backgroundColor = "white";
});

const postToShow: ComputedRef<{ title: string; body: string }[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.id === route.params.id)
);

const siteData = reactive({
  title: `${postToShow.value[0].title}` || `Материалы`,
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

usePixiGlitchFilter("figure.image img", postToShow?.value[0]?.body, "srcset");
</script>

<style scoped>
.n-card {
  width: 1000px;
  min-width: 400px;
  height: fit-content;
  margin: 10px 3px 10px 3px;
}
.cards-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}
.materials-title {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
</style>
