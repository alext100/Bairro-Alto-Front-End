<template>
  <div class="row">
    <div class="col-xl-12 col-lg-12 cards-container ck-content">
      <full-card
        v-for="lesson in lessons || []"
        :key="lesson"
        type="body"
        icon="fas fa-user-edit"
        class="mb-4 mb-xl-0"
        :shadow="true"
        shadowSize="md"
        :hover="true"
      >
        <h2 class="text-center card-title text-uppercase text-muted mb-0">{{ lesson.title }}</h2>
        <div class="m-2 card-text">
          <div v-html="lesson.body"></div>
        </div>
        <template v-slot:footer>
          <span class="text-nowrap text-muted"
            >Создано <span class="font-weight-bold">{{ new Date(lesson.date).toLocaleString() }}.</span> Уровень
            {{ lesson.level }}</span
          >
        </template>
      </full-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import FullCard from "@/components/FullCard.vue";

export default defineComponent({
  name: "Lessons",
  components: { FullCard },
  computed: {
    ...mapState(["lessons", "isLoading"]),
  },
  methods: {
    ...mapActions(["getLessonsFromApi"]),
  },
  mounted() {
    this.getLessonsFromApi();
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/content-styles.css";
.cards-container {
  display: flex;
  flex-direction: column-reverse;
}
</style>
