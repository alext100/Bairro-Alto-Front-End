<template>
  <div class="container ck-content m-4">
    <n-card :bordered="false" hoverable>
      <div v-html="coursesSchool[0].body"></div>
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
  name: "CoursesNewSchool",
  components: { NCard, Footer },

  setup() {
    const { state, dispatch } = useStore();
    onBeforeMount(() => dispatch("getWebContent"));
    onMounted(() => {
      document.body.style.backgroundColor = "white";
    });
    const coursesSchool = computed(() =>
      state.webContent?.posts?.filter((post: Post) => post?.title.match("Офлайн ДЛЯ НАЧИНАЮЩИХ"))
    );

    return {
      coursesSchool,
    };
  },
});
</script>
