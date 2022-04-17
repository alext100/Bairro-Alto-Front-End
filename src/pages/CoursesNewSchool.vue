<template>
  <div class="container ck-content m-4">
    <n-card :bordered="false" hoverable>
      <div v-html="coursesSchool[0].body"></div>
    </n-card>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { NCard } from "naive-ui";
import { Post } from "@/types/interfaces";
import Footer from "@/components/Footer.vue";
import { computed, onBeforeMount, onMounted } from "vue";

const { state, dispatch } = useStore();

onBeforeMount(() => dispatch("getWebContent"));
onMounted(() => {
  document.body.style.backgroundColor = "white";
});

const coursesSchool = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.title.match("Офлайн ДЛЯ НАЧИНАЮЩИХ"))
);
</script>
