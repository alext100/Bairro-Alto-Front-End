<template>
  <div class="home container dflex mb-5">
    <div v-motion :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0 }" :delay="200">
      <h1 class="main-page__title">Уютная школа португальского языка</h1>
    </div>
    <Teachers :allTeachers="allTeachers" />
    <Banner url="/particlesText.json" id="tsparticles" v-if="!$isMobile()" />
    <div v-if="!$isMobile()" class="banner-container"></div>
    <Features
      :methodic="methodic"
      :methodicBody="methodicBody"
      :atmosphere="atmosphere"
      :atmosphereBody="atmosphereBody"
    />
    <News :newsBody="newsBody" />
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { useHead } from "@vueuse/head";
import { Post } from "@/types/interfaces";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import getTitleAndBody from "@/utils/getTitleAndBody";
import News from "@/pages/MainPageComponents/News.vue";
import Teachers from "@/pages/MainPageComponents/Teachers.vue";
import Features from "@/pages/MainPageComponents/Features.vue";
import { computed, ComputedRef, onMounted, reactive } from "vue";

const { state, dispatch } = useStore();
const siteData = reactive({
  title: `Bairro Alto`,
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

onMounted(async () => {
  await dispatch("getWebContent");
  document.body.style.backgroundColor = "white";
});

const allTeachers: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post.category === "Преподаватели")
);

const methodic: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.title?.match("Лексический подход - главная страница"))
);
const methodicBody: ComputedRef<{ title: string; body: string }> = computed(() =>
  methodic.value.length > 0 ? getTitleAndBody(methodic.value[0].body) : { title: "", body: "" }
);

const atmosphere: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.title?.match("Атмосфера - главная страница"))
);
const atmosphereBody: ComputedRef<{ title: string; body: string }> = computed(() =>
  atmosphere.value.length > 0 ? getTitleAndBody(atmosphere.value[0].body) : { title: "", body: "" }
);

const news: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.category === "Новости")
);
const newsBody: ComputedRef<{ title: string; body: string }[]> = computed(() =>
  news.value.map((element: Post) => getTitleAndBody(element?.body))
);
</script>

<style scoped>
.main-page__title {
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  line-height: 1.4;
  font-weight: 400;
}

.banner-container {
  height: 490px;
}

@media (min-width: 480px) {
  .main-page__title {
    max-width: 42rem;
    font-size: 3.5rem;
  }
}

@media (max-width: 479px) {
  .main-page__title {
    font-size: 2.5rem;
  }
}
</style>
