<template>
  <div class="container p-3 mt-2">
    <div v-if="methodic[0]?.body" class="methodic" v-html="methodicBody?.body"></div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { Post } from "@/types/interfaces";
import Footer from "@/components/Footer.vue";
import getTitleAndBody from "@/utils/getTitleAndBody";
import { computed, ComputedRef, onBeforeMount, onMounted } from "vue";

const { state, dispatch } = useStore();

onBeforeMount(() => dispatch("getWebContent"));
onMounted(() => {
  document.body.style.backgroundColor = "white";
});

const methodic: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts.filter((post: Post) => post?.title?.match("Лексический подход - полное описание"))
);
const methodicBody: ComputedRef<{ title: string; body: string }> = computed(() =>
  methodic.value.length > 0 ? getTitleAndBody(methodic.value[0].body) : { title: "", body: "" }
);
</script>

<style>
.methodic {
  text-align: justify;
  text-justify: inter-word;
}
</style>
