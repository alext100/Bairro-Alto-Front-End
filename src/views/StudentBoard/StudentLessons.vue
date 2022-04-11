<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <div class="container">
    <h2 class="mb-4 text-center">Уроки:</h2>
    <div class="row">
      <div class="col-xl-12 col-lg-12 cards-container ck-content">
        <n-space vertical>
          <n-skeleton v-if="isLoading" height="40px" width="33%" />
          <n-skeleton v-if="isLoading" height="40px" width="66%" :sharp="false" />
          <n-skeleton v-if="isLoading" height="40px" round />
          <n-skeleton v-if="isLoading" height="40px" circle />
        </n-space>
        <full-card
          v-for="lesson in groupLessons || []"
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
            <v-zoomer :mouseWheelToZoom="false" :maxScale="1.4" pivot="cursor" :limitTranslation="false">
              <div v-html="lesson?.body"></div>
            </v-zoomer>
            <div v-if="lesson.audios !== []">
              <div v-for="audio in lesson.audios || []" :key="audio">
                <audio ref="player" controls="true">
                  <source :src="audio" type="audio/ogg" />
                  <source :src="audio" type="audio/mpeg" />
                  <source :src="audio" type="audio/mp3" />
                  <source :src="audio" type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>
          <!--  <template v-slot:footer
            ><b-button
              v-tippy="`Функционал в разработке. Воспользуйтесь чатом с преподавателем`"
              pill
              class="button-redirect btn-light"
              @click="handleRedirect(lesson.id)"
              ><em class="fas fa-keyboard"></em> Перейти к уроку и ответить на вопросы <em class="fas fa-keyboard"></em>
            </b-button>
          </template> -->
        </full-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { NSkeleton, NSpace } from "naive-ui";
import FullCard from "@/components/FullCard.vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { computed, defineComponent, onMounted } from "vue";
import sideBarStudentMenuItems from "./sideBarStudentMenuItems";

export default defineComponent({
  name: "StudentLessons",
  components: { SidebarMenu, FullCard, NSkeleton, NSpace },
  setup() {
    const { state, dispatch } = useStore();
    const router = useRouter();
    const isLoading = computed(() => state.isLoading);
    const currentUser = computed(() => state.currentUser);
    const groupLessons = computed(() => state.groupLessons);

    onMounted(async () => {
      await dispatch("getGroupLessonsById", currentUser.value.studentGroups[0]);
      await dispatch("getGroupById", currentUser.value.studentGroups[0]);
    });

    const handleRedirect = (lessonId: string) => {
      router.push(`student/lesson/${lessonId}`);
    };

    return {
      isLoading,
      currentUser,
      groupLessons,
      handleRedirect,
      menuItems: sideBarStudentMenuItems(),
      profileName: state.currentUser.firstName,
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

.button-redirect {
  font-size: 16px;
  background-color: transparent;
  border: transparent;
  color: blue;
}
</style>
