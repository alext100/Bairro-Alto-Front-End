<template>
  <div class="container">
    <Banner id="tsparticles-materials" url="/particlesImages.json" v-if="!$isMobile()" />
    <div class="ck-content">
      <h1 class="materials-title m-3">Материалы</h1>
      <div class="container cards-container">
        <n-card hoverable v-for="material in materials || []" :key="material.id" footer-style="font-size:18px;">
          <template #cover>
            <router-link :to="{ name: 'MaterialsPost', params: { id: material.id } }">
              <img v-if="material.image && material.image !== ''" :src="material.image" alt="Post cover" />
              <em v-else class="bx bxs-image bx-border no-image-icon"></em>
            </router-link>
          </template>
          <template #footer>
            <router-link
              v-tippy="'Читать статью'"
              class="materials-page__router-link"
              :to="'/materials/' + material.id"
            >
              {{ material.title }}
            </router-link>
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
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import useSplitText from "@/composables/useSplitText";
import { computed, ComputedRef, onBeforeMount, onMounted, reactive } from "vue";

const { state, dispatch } = useStore();
const siteData = reactive({
  title: `Материалы`,
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

onBeforeMount(() => dispatch("getWebContent"));
onMounted(() => {
  document.body.style.backgroundColor = "white";
});

const materials: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.category === "Материалы")
);
useSplitText(".materials-title", "charsWave");
</script>

<style scoped>
.n-card {
  width: 300px;
  height: 380px;
  margin: 10px 3px 10px 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cards-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}
.materials-page__router-link {
  color: black;
  text-decoration: none;
}
.materials-title {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
.no-image-icon {
  font-size: 182px;
  color: #8080804d;
}
</style>
