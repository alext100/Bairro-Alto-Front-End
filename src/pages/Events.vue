<template>
  <div class="container">
    <div class="ck-content">
      <h1 class="events-title m-3">Мероприятия</h1>
      <full-card
        v-for="event in events || []"
        :key="event"
        type="body"
        class="mb-4 mt-4 mb-xl-0"
        :shadow="true"
        shadowSize="md"
        :hover="false"
      >
        <h2 class="text-center card-title text-uppercase text-muted mb-0">{{ event.title }}</h2>
        <div class="m-2 card-text">
          <div v-html="event?.body"></div>
        </div>
      </full-card>
    </div>
  </div>
  <Footer />
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import { Post } from "@/types/interfaces";
import FullCard from "@/components/FullCard.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "Events",
  components: { FullCard, Footer },

  setup() {
    const { state, dispatch } = useStore();
    onBeforeMount(() => dispatch("getWebContent"));
    onMounted(() => {
      document.body.style.backgroundColor = "white";
    });

    const events = computed(() => state.webContent?.posts?.filter((post: Post) => post?.category === "Мероприятия"));

    return { events };
  },
});
</script>

<style scoped>
.events-title {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
</style>
