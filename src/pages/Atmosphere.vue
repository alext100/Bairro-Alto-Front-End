<template>
  <div class="container p-3 mt-2">
    <div v-if="atmosphere[0]?.body" class="atmosphere" v-html="atmosphereBody?.body"></div>
  </div>
  <Footer />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import getTitleAndBody from "@/utils/getTitleAndBody";
import { Post } from "@/types/interfaces";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "Atmosphere",
  components: { Footer },

  setup() {
    const { state, dispatch } = useStore();
    onMounted(() => {
      dispatch("getWebContent");
      document.body.style.backgroundColor = "white";
    });
    onUnmounted(() => {
      document.body.style.backgroundColor = "";
    });

    const atmosphere = computed(() =>
      state.webContent?.posts.filter((post: Post) => post?.title?.match("Атмосфера - полное описание"))
    );
    const atmosphereBody = computed(() => getTitleAndBody(atmosphere?.value[0].body));

    return {
      atmosphere,
      atmosphereBody,
    };
  },
});
</script>

<style>
.atmosphere {
  text-align: justify;
  text-justify: inter-word;
}
</style>
