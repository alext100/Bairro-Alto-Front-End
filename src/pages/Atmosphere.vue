<template>
  <div class="container p-3 mt-2">
    <div v-if="atmosphere[0]?.body" class="atmosphere" v-html="atmosphereBody?.body"></div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { useHead } from "@vueuse/head";
import { Post } from "@/types/interfaces";
import Footer from "@/components/Footer.vue";
import getTitleAndBody from "@/utils/getTitleAndBody";
import { computed, onBeforeMount, onMounted, reactive } from "vue";

const siteData = reactive({
  title: `Атмосфера в школе`,
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

const { state, dispatch } = useStore();

onBeforeMount(() => dispatch("getWebContent"));
onMounted(() => {
  document.body.style.backgroundColor = "white";
});

const atmosphere = computed(() =>
  state.webContent?.posts.filter((post: Post) => post?.title?.match("Атмосфера - полное описание"))
);
const atmosphereBody = computed(() => getTitleAndBody(atmosphere?.value[0].body));
</script>

<style scoped>
.atmosphere {
  text-align: justify;
}
</style>
