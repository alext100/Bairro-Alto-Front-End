<template>
  <div class="container ck-content m-4">
    <n-card :bordered="false" hoverable>
      <div v-html="coursesOnline[0].body"></div>
    </n-card>
  </div>
  <Footer />
</template>

<script lang="ts">
import { Post } from "@/types/interfaces";
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { NCard } from "naive-ui";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "CoursesContOnline",
  components: { NCard, Footer },

  setup() {
    const { state, dispatch } = useStore();
    onMounted(() => {
      dispatch("getWebContent");
      document.body.style.backgroundColor = "white";
    });
    const coursesOnline = computed(() =>
      state.webContent?.posts?.filter((post: Post) => post?.title.match("Онлайн ДЛЯ ПРОДОЛЖАЮЩИХ"))
    );

    return {
      coursesOnline,
    };
  },
});
</script>
