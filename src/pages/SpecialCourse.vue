<template>
  <div class="container">
    <div class="ck-content">
      <n-h1 class="special-courses-title m-3">Спецкурсы</n-h1>
      <div class="container cards-container">
        <n-card :bordered="false" hoverable header-style="font-size: 30px" footer-style="font-size: 18px">
          <template #header>{{ filteredPost[0]?.title }}</template>
          <div v-html="postBody?.body" ref="cardContainer"></div>
          <template #footer>
            <router-link class="nav-link" to="/special-courses">Вернуться к спецкурсам</router-link>
          </template>
        </n-card>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Footer from "@/components/Footer.vue";
import { Post } from "@/types/interfaces";
import getTitleAndBody from "@/utils/getTitleAndBody";
import { useHead } from "@vueuse/head";
import { NCard, NH1 } from "naive-ui";
import { computed, ComputedRef, onBeforeMount, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
/* eslint-disable @typescript-eslint/no-explicit-any */

const route = useRoute();
const { state, dispatch } = useStore();

onBeforeMount(() => dispatch("getWebContent"));
onMounted(() => {
  document.body.style.backgroundColor = "white";
});

const filteredPost: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.id === route.params.id)
);
const postBody: ComputedRef<{ title: string; body: string }> = computed(() =>
  filteredPost.value.length > 0 ? getTitleAndBody(filteredPost?.value[0]?.body) : { title: "", body: "" }
);

const siteData = reactive({
  title: `${filteredPost.value[0].title}` || `Спецкурсы`,
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

// usePixiGlitchFilter("figure.image img", postBody?.value?.body, "src");
</script>

<style scoped>
.n-card-header__main {
  color: blue !important;
  font-weight: 900;
}
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
.special-courses-title {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
</style>
