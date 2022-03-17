<template>
  <div class="container ck-content m-4">
    <n-card :bordered="false" hoverable>
      <div v-html="courses[0].body"></div>
    </n-card>
  </div>
</template>

<script lang="ts">
import { Post } from "@/types/interfaces";
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { NCard } from "naive-ui";

export default defineComponent({
  name: "Courses",
  components: { NCard },

  setup() {
    const { state, dispatch } = useStore();
    onMounted(() => {
      dispatch("getWebContent");
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
