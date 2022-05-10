<template>
  <div class="container">
    <div class="ck-content">
      <h1 class="events-title m-3">Мероприятия</h1>
      <full-card
        v-for="event in events || []"
        :key="event"
        type="body"
        class="mb-4 mt-4 mb-xl-0"
        :shadow="true"
        shadowSize="md"
        :hover="false"
      >
        <h2 class="text-center card-title text-uppercase text-muted mb-0">{{ event.title }}</h2>
        <div class="m-2 card-text">
          <div v-html="event?.body"></div>
        </div>
      </full-card>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { useHead } from "@vueuse/head";
import { Post } from "@/types/interfaces";
import Footer from "@/components/Footer.vue";
import FullCard from "@/components/FullCard.vue";
import useSplitText from "@/composables/useSplitText";
import { computed, onBeforeMount, onMounted, reactive } from "vue";

const siteData = reactive({
  title: `Мероприятия`,
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

const events = computed(() => state.webContent?.posts?.filter((post: Post) => post?.category === "Мероприятия"));

useSplitText(".events-title", "charsWave");
</script>

<style scoped>
.events-title {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
</style>
