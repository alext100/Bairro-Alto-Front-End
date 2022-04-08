<template>
  <div class="container p-3 mt-2">
    <div v-if="methodic[0]?.body" class="methodic" v-html="methodicBody?.body"></div>
  </div>
  <Footer />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import getTitleAndBody from "@/utils/getTitleAndBody";
import { Post } from "@/types/interfaces";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "Methodic",
  components: { Footer },

  setup() {
    const { state, dispatch } = useStore();

    onMounted(() => {
      dispatch("getWebContent");
      document.body.style.backgroundColor = "white";
    });

    const methodic = computed(() =>
      state.webContent?.posts.filter((post: Post) => post?.title?.match("Лексический подход - полное описание"))
    );
    const methodicBody = computed(() => getTitleAndBody(methodic?.value[0].body));

    return {
      methodic,
      methodicBody,
    };
  },
});
</script>

<style>
.methodic {
  text-align: justify;
  text-justify: inter-word;
}
</style>
