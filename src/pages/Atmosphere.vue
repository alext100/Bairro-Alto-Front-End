<template>
  <div class="container p-3 mt-2">
    <div v-if="atmosphere[0]?.body" class="atmosphere" v-html="atmosphereBody?.body"></div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { Post } from "@/types/interfaces";
import Footer from "@/components/Footer.vue";
import getTitleAndBody from "@/utils/getTitleAndBody";
import { computed, onBeforeMount, onMounted } from "vue";

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
