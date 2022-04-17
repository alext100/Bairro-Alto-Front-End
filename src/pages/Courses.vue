<template>
  <div class="container ck-content m-4">
    <n-card :bordered="false" hoverable data-test="courses-card">
      <div v-html="courses[0].body"></div>
    </n-card>
  </div>
  <Footer />
</template>

<script lang="ts">
import { Post } from "@/types/interfaces";
import { computed, defineComponent, onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import { NCard } from "naive-ui";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "Courses",
  components: { NCard, Footer },

  setup() {
    const { state, dispatch } = useStore();
    onBeforeMount(() => dispatch("getWebContent"));
    onMounted(() => {
      document.body.style.backgroundColor = "white";
    });
    const courses = computed(() =>
      state.webContent?.posts?.filter((post: Post) => post?.title.match("ОБУЧЕНИЕ В ШКОЛЕ"))
    );

    return {
      courses,
    };
  },
});
</script>
