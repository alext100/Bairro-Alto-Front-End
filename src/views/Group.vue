<template>
  <div class="container tabs-container">
    <router-link to="/teacher"
      ><em class="fas fa-arrow-left backward-icon"> <span class="tooltiptext">Назад к группам</span></em></router-link
    >
    <h1 class="m-3">Группа {{ currentGroup.groupName }}</h1>
    <b-card no-body>
      <b-tabs active-nav-item-class="h-3 list-group-item-success" content-class="mt-3" justified>
        <b-tab title="Домашнее задание" active><GroupInputMessageVue /> <MessagesVue /></b-tab>
        <b-tab title="Студенты группы"><GroupMembersVue /></b-tab>
        <b-tab title="Добавить студента в группу"><AddUserVue /></b-tab>
        <b-tab title="Онлайн-заметки"><OnlineLessonVue /> <StudentErrorsVue /></b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import MessagesVue from "@/components/GroupMessages.vue";
import GroupMembersVue from "@/components/GroupMembers.vue";
import GroupInputMessageVue from "@/components/GroupInputMessage.vue";
import AddUserVue from "@/components/GroupAddUser.vue";
import StudentErrorsVue from "@/components/StudentErrors.vue";

import OnlineLessonVue from "./OnlineLesson.vue";

export default defineComponent({
  name: "GroupPage",
  components: {
    MessagesVue,
    GroupMembersVue,
    GroupInputMessageVue,
    AddUserVue,
    OnlineLessonVue,
    StudentErrorsVue,
  },
  computed: {
    ...mapState(["currentGroup", "loadedUsersFromGroup"]),
  },
  methods: {},
  data() {
    return {};
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
}

.tooltiptext {
  transform: translateY(-26%);
  transition: all 1s ease-in;
  visibility: hidden;
  width: 190px;
  background-color: black;
  opacity: 0.6;
  color: #fff;
  text-align: center;
  border-radius: 28px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  font-size: smaller;
}

.backward-icon:hover .tooltiptext {
  visibility: visible;
}
</style>
