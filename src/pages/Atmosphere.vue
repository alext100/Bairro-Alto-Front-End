<template>
  <div class="container p-3 mt-2">
    <div v-if="atmosphere[0]?.body" class="features-text" v-html="atmosphereBody?.body"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { mapActions, useStore } from "vuex";
import getTitleAndBody from "@/utils/getTitleAndBody";
import { Post } from "@/types/interfaces";

export default defineComponent({
  name: "Atmosphere",

  setup() {
    const { state, dispatch } = useStore();
    onMounted(() => dispatch("getWebContent"));

    const atmosphere = computed(() =>
      state.webContent?.posts.filter((post: Post) => post.title === "Атмосфера - полное описание")
    );
    const atmosphereBody = computed(() => getTitleAndBody(atmosphere?.value[0].body));

    return {
      atmosphere,
      atmosphereBody,
    };
  },

  methods: {
    ...mapActions(["getWebContent"]),
  },
});
</script>

<style>
.features-text {
  text-align: justify;
  text-justify: inter-word;
}
</style>
