<template>
  <div class="container">
    <div class="ck-content">
      <h1 class="news-title m-3">Новости</h1>
      <full-card
        v-for="theNews in news || []"
        :key="theNews?.id"
        type="body"
        class="mb-4 mt-4 mb-xl-0"
        :shadow="true"
        shadowSize="md"
        :hover="false"
      >
        <h2 class="text-center card-title text-uppercase text-muted mb-0">{{ theNews?.title }}</h2>
        <div class="m-2 card-text">
          <div v-html="theNews?.body"></div>
        </div>
      </full-card>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { Post } from "@/types/interfaces";
import { computed, ComputedRef, onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import FullCard from "@/components/FullCard.vue";
import Footer from "@/components/Footer.vue";

const { state, dispatch } = useStore();

onBeforeMount(() => dispatch("getWebContent"));
onMounted(() => {
  document.body.style.backgroundColor = "white";
});

const news: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.category === "Новости")
);
</script>

<style scoped>
.news-title {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
</style>
