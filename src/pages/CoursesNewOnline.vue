<template>
  <div class="container ck-content m-4">
    <n-card :bordered="false" hoverable>
      <div v-html="coursesOnline[0].body"></div>
    </n-card>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { NCard } from "naive-ui";
import { useHead } from "@vueuse/head";
import { Post } from "@/types/interfaces";
import Footer from "@/components/Footer.vue";
import { computed, onBeforeMount, onMounted, reactive } from "vue";

const siteData = reactive({
  title: `Курсы для начинающих онлайн`,
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

const coursesOnline = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.title.match("Онлайн ДЛЯ НАЧИНАЮЩИХ"))
);
</script>
