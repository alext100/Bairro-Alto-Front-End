<template>
  <div class="container tabs-container">
    <router-link to="/teacher"
      ><em v-tippy="'Назад к группам'" class="fas fa-arrow-left backward-icon"> </em
    ></router-link>
    <h1 class="m-3">Группа {{ currentGroup.groupName }}</h1>
    <b-card no-body>
      <b-tabs active-nav-item-class="h-3 list-group-item-success" content-class="mt-3" justified>
        <b-tab title="Домашнее задание" active><GroupInputMessageVue /> </b-tab>
        <b-tab title="Студенты группы"><GroupMembersVue /></b-tab>
        <b-tab title="Добавить студента в группу"><AddUserVue /></b-tab>
        <b-tab title="Онлайн-заметки"><OnlineLessonVue /> <StudentErrorsVue /></b-tab>
        <b-tab title="Уроки группы"><GroupAddDeleteLesson /></b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
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
    GroupMembersVue,
    GroupInputMessageVue,
    AddUserVue,
    OnlineLessonVue,
    StudentErrorsVue,
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
