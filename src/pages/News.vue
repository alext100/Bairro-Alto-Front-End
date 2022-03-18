<template>
  <div class="container">
    <div class="ck-content">
      <h1 class="features-title m-3">Новости</h1>

      <full-card
        v-for="theNews in news || []"
        :key="theNews"
        type="body"
        class="mb-4 mt-4 mb-xl-0"
        :shadow="true"
        shadowSize="md"
        :hover="false"
      >
        <h2 class="text-center card-title text-uppercase text-muted mb-0">{{ theNews.title }}</h2>
        <div class="m-2 card-text">
          <div v-html="theNews?.body"></div>
        </div>
      </full-card>
    </div>
  </div>
  <Footer />
</template>

<script lang="ts">
import { Post } from "@/types/interfaces";
import { computed, defineComponent, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import FullCard from "@/components/FullCard.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "News",
  components: { FullCard, Footer },
  setup() {
    onMounted(() => {
      document.body.style.backgroundColor = "white";
    });
    onUnmounted(() => {
      document.body.style.backgroundColor = "";
    });

    const { state } = useStore();
    const news = computed(() => state.webContent?.posts?.filter((post: Post) => post?.category === "Новости"));

    return {
      news,
    };
  },
});
</script>

<style scoped>
.features-title {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
</style>
