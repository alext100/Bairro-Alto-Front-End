<template>
  <div class="container">
    <div class="event-page__features ck-content">
      <h1 class="features-title features-item m-0">Мероприятия</h1>
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
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { mapActions, useStore } from "vuex";
import { Post } from "@/types/interfaces";
import FullCard from "@/components/FullCard.vue";

export default defineComponent({
  name: "Events",
  components: { FullCard },

  setup() {
    const { state, dispatch } = useStore();
    onMounted(() => {
      dispatch("getWebContent");
      document.body.style.backgroundColor = "white";
    });

    const events = computed(() => state.webContent?.posts?.filter((post: Post) => post?.category === "Мероприятия"));

    return {
      events,
    };
  },

  methods: {
    ...mapActions(["getWebContent"]),
  },
});
</script>
