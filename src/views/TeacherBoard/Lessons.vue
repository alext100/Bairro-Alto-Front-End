<template>
  <h2 class="mb-4 text-center">Уроки:</h2>
  <div class="row">
    <div class="col-xl-12 col-lg-12 cards-container ck-content">
      <full-card
        v-for="lesson in lessons || []"
        :key="lesson"
        type="body"
        class="mb-4 mt-4 mb-xl-0"
        :shadow="true"
        shadowSize="md"
        :hover="true"
      >
        <h2 class="text-center card-title text-uppercase text-muted mb-0">{{ lesson.title }}</h2>
        <div class="m-2 card-text">
          <div v-html="lesson?.body"></div>
          <div v-if="lesson.audios !== []">
            <div v-for="audio in lesson.audios || []" :key="audio">
              <audio controls="true">
                <source :src="audio" type="audio/ogg" />
                <source :src="audio" type="audio/mpeg" />
                <source :src="audio" type="audio/mp3" />
                <source :src="audio" type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>
        <template v-slot:footer>
          <span class="text-nowrap text-muted footer"
            >Создано {{ new Date(lesson.date).toLocaleString() }}.<span class="font-weight-bold"></span> Уровень
            {{ lesson.level
            }}<b-button pill class="button-edit btn-light" @click="handleEditLesson(lesson)"
              ><em class="far fa-edit"></em> </b-button
            ><b-button
              pill
              class="button-delete align-self-center btn-light"
              @click="handleDeleteLesson(lesson.id), $toast('Урок удалён')"
              ><em class="fa fa-trash-alt"></em> </b-button
          ></span>
        </template>
      </full-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import FullCard from "@/components/FullCard.vue";
import { Lesson } from "@/types/interfaces";

export default defineComponent({
  name: "Lessons",
  components: { FullCard },
  emits: ["updateLesson"],
  computed: {
    ...mapState(["lessons", "isLoading"]),
  },
  methods: {
    ...mapActions(["getLessonsFromApi", "deleteLessonById"]),
    async handleDeleteLesson(lessonId: string) {
      await this.deleteLessonById(lessonId);
    },

    handleEditLesson(lesson: Lesson) {
      this.$emit("updateLesson", lesson);
    },
  },
  mounted() {
    this.getLessonsFromApi();
  },
});
</script>

<style lang="scss" scoped>
@import "../../assets/content-styles.css";
.cards-container {
  display: flex;
  flex-direction: column-reverse;
}
.footer {
  display: flex;
  justify-content: space-between;
}
.button-edit,
.button-delete {
  font-size: 16px;
  background-color: transparent;
  border: transparent;
}
</style>
