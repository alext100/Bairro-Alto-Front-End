<template>
  <div class="container tabs-container">
    <router-link to="/teacher">
      <em v-tippy="'Назад к группам'" class="fas fa-arrow-left backward-icon"> </em>
    </router-link>
    <n-h1 class="m-3">Группа {{ currentGroup.groupName }}</n-h1>
    <n-card>
      <n-tabs default-value="Студенты группы" justify-content="space-between" type="line" animated size="large">
        <n-tab-pane name="Студенты группы" tab="Студенты группы" display-directive="show:lazy"
          ><GroupMembersVue />
        </n-tab-pane>
        <n-tab-pane name="Домашнее задание" tab="Домашнее задание" display-directive="show"
          ><GroupInputMessageVue />
        </n-tab-pane>
        <n-tab-pane name="Добавить студента в группу" tab="Добавить студента в группу" display-directive="show:lazy"
          ><AddUserVue />
        </n-tab-pane>
        <n-tab-pane name="Онлайн-заметки" tab="Онлайн-заметки" display-directive="show"
          ><OnlineLessonVue /> <StudentErrorsVue
        /></n-tab-pane>
        <n-tab-pane name="Уроки группы" tab="Уроки группы" display-directive="show:lazy"
          ><GroupAddDeleteLesson />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { NCard, NTabs, NTabPane, NH1 } from "naive-ui";
import { computed, defineComponent, onMounted } from "vue";
import AddUserVue from "@/views/TeacherBoard/GroupAddUser.vue";
import GroupMembersVue from "@/views/TeacherBoard/GroupMembers.vue";
import OnlineLessonVue from "@/views/TeacherBoard/OnlineLesson.vue";
import StudentErrorsVue from "@/views/TeacherBoard/StudentErrors.vue";
import GroupInputMessageVue from "@/views/TeacherBoard/GroupInputMessage.vue";
import GroupAddDeleteLesson from "@/views/TeacherBoard/GroupAddDeleteLesson.vue";

export default defineComponent({
  name: "GroupPage",
  components: {
    NH1,
    NCard,
    NTabs,
    NTabPane,
    AddUserVue,
    OnlineLessonVue,
    GroupMembersVue,
    StudentErrorsVue,
    GroupInputMessageVue,
    GroupAddDeleteLesson,
  },

  setup() {
    const { state } = useStore();
    const currentGroup = computed(() => state.currentGroup);
    const loadedUsersFromGroup = computed(() => state.loadedUsersFromGroup);

    onMounted(() => {
      document.body.style.backgroundColor = "white";
    });

    return {
      currentGroup,
      loadedUsersFromGroup,
    };
  },
});
</script>

<style>
.list-group-item-success {
  background-color: #ffc107 !important;
}
.nav-link {
  color: #0042a4;
}
.container__list {
  list-style: none;
}
.tabs-container {
  min-width: 95vw !important;
}
.backward-icon {
  position: absolute;
  font-size: 44px;
  right: calc(100% - 50px);
  bottom: calc(100% - 50px);
}
</style>
