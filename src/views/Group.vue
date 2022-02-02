<template>
  <div class="container">
    <h1>Группа {{ currentGroup.groupName }}</h1>

    <b-card no-body>
      <b-tabs active-nav-item-class="h-3 list-group-item-success" content-class="mt-3" justified>
        <b-tab title="Домашнее задание" active><GroupInputMessageVue /> <MessagesVue /></b-tab>
        <b-tab title="Студенты группы"><GroupMembersVue /></b-tab>
        <b-tab title="Добавить студента в группу"><AddUserVue /></b-tab>
        <b-tab title="Онлайн-заметки"><OnlineLessonVue /></b-tab>
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
import OnlineLessonVue from "./OnlineLesson.vue";

export default defineComponent({
  name: "GroupPage",
  components: {
    MessagesVue,
    GroupMembersVue,
    GroupInputMessageVue,
    AddUserVue,
    OnlineLessonVue,
  },
  computed: {
    ...mapState(["currentGroup", "loadedUsersFromGroup"]),
  },
});
</script>

<style>
.list-group-item-success {
  background-color: #ffc107 !important;
}
.container__list {
  list-style: none;
}
</style>
