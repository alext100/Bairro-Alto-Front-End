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
        <template v-slot:header
          ><span v-tippy="'Название курса'" class="font-weight-bold">{{ lesson.courseName }}.</span
          ><span v-tippy="'Уровень курса'" class="font-weight-bold"> {{ lesson.level }}</span></template
        >
        <h2 class="text-center card-title text-uppercase text-muted mb-0">{{ lesson.title }}</h2>
        <div class="m-2 card-text">
          <div v-viewer="{ toolbar: true }">
            <div v-html="lesson?.body"></div>
          </div>
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
            >Создано {{ new Date(lesson.date).toLocaleString() }}.<b-button
              v-tippy="'Редактировать урок'"
              pill
              class="button-edit btn-light"
              @click="handleEditLesson(lesson)"
              ><em class="far fa-edit"></em> </b-button
            ><b-button
              v-tippy="'Удалить урок'"
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
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import FullCard from "@/components/FullCard.vue";
import { Lesson } from "@/types/interfaces";

export default defineComponent({
  name: "Lessons",
  components: { FullCard },
  emits: ["updateLesson"],
  setup(props, ctx) {
    const { state, dispatch } = useStore();

    onMounted(() => dispatch("getLessonsFromApi"));

    const lessons = computed(() => state.lessons);
    const isLoading = computed(() => state.isLoading);

    const handleDeleteLesson = async (lessonId: string) => {
      await dispatch("deleteLessonById", lessonId);
      await dispatch("getAllCourseNames");
    };

    const handleEditLesson = async (lesson: Lesson) => {
      ctx.emit("updateLesson", lesson);
      await dispatch("getAllCourseNames");
    };

    return {
      lessons,
      isLoading,
      handleEditLesson,
      handleDeleteLesson,
    };
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
