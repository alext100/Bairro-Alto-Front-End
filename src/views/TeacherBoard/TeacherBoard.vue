<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <div class="teacher-board container d-flex flex-column align-items-center">
    <n-h1 class="m-2">Мои группы</n-h1>
    <n-card
      content-style="padding: 16px; font-size: 16px"
      class="teacher-board__teacher-card"
      style="min-width: 300px"
      :bordered="false"
      size="huge"
    >
      В этом разделе можно найти все группы школы и добавить группы в твой список или удалить их оттуда. Перейдя в
      конкретную группу можно добавить или удалить студентов из группы. Назначить им домашнее задание. Или делать
      заметки во время онлайн урока.
    </n-card>
    <div class="container">
      <ul class="teacher-board__list-group-item--success">
        <li v-for="group in userGroups || []" :key="group" class="d-flex flex-column">
          <n-card>
            <div class="mt-3">
              <n-list bordered>
                <n-layout embedded content-style="padding: 14px;">
                  <n-card :hoverable="true" class="text-center" content-style="font-size: 18px;">
                    <router-link :to="'/group/' + group.id">
                      {{ group.groupName }}
                    </router-link>
                    <template #footer>
                      <button
                        v-tippy="'Удалить группу из моего списка'"
                        @click="handleDeleteGroupe(group.id), $toast('Удалено из твоих групп')"
                        class="btn-lg teacher-board__button-delete align-self-center"
                      >
                        <em class="far fa-trash-alt"></em>
                      </button>
                    </template>
                  </n-card>
                </n-layout>
              </n-list>
            </div>
          </n-card>
        </li>
      </ul>
    </div>
    <SubmitButton v-on:click="isHiddenFormToCreate = !isHiddenFormToCreate" class="mb-5 mt-5 w-75">
      {{ isHiddenFormToCreate ? "Показать все группы" : "Скрыть список групп" }}
    </SubmitButton>
    <div v-if="!isHiddenFormToCreate" class="container">
      <n-h2 class="m-2">Все группы:</n-h2>
      <ul class="teacher-board__list-group-item--success">
        <li v-for="group in groups || []" :key="group" class="d-flex flex-column">
          <n-layout>
            <div class="mt-3">
              <n-list bordered>
                <n-layout embedded content-style="padding: 14px;">
                  <n-card :hoverable="true" class="text-center" content-style="font-size: 18px;">
                    <router-link :to="'/group/' + group.id">
                      {{ group.groupName }}
                    </router-link>
                    <template #footer>
                      <button
                        v-tippy="'Добавить группу в мой список'"
                        @click="handleAddToMyGroups(group.id), $toast('Добавлено в твои группы')"
                        class="btn-lg teacher-board__button-add align-self-center"
                      >
                        <em class="bi bi-plus-circle"></em>
                      </button>
                    </template>
                  </n-card>
                </n-layout>
              </n-list>
            </div>
          </n-layout>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import state from "@/store/state";
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import SidebarMenu from "@/components/SidebarMenu.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import { NCard, NH1, NH2, NList, NLayout } from "naive-ui";
import sidebarTeacherMenuItems from "@/views/TeacherBoard/sideBarTeacherMenuItems";

export default defineComponent({
  name: "TeacherBoard",
  components: { NH1, NH2, NList, NCard, NLayout, SidebarMenu, SubmitButton },

  computed: {
    ...mapState(["currentUser", "groups", "userGroups"]),
  },
  methods: {
    ...mapActions(["getGroupsFromApi", "getUserGroupsFromApi", "addGroupToTeacher", "deleteUserGroup"]),
    async handleAddToMyGroups(groupID: string) {
      await this.addGroupToTeacher(groupID);
    },
    async handleDeleteGroupe(groupID: string) {
      await this.deleteUserGroup(groupID);
    },
  },
  mounted() {
    this.getGroupsFromApi();
    this.getUserGroupsFromApi();
  },
  data() {
    return {
      menuItems: sidebarTeacherMenuItems(),
      isHiddenFormToCreate: true,
      profileName: state.currentUser.firstName,
    };
  },
});
</script>

<style lang="scss" scoped>
.teacher-board {
  &__teacher-card {
    font-family: "Tenor-sans", sans-serif;
    text-align: justify;
    padding: 17px;
  }
  &__list-group-item--success {
    background-color: var(--bairro-alto-logo-color);
  }
  &__button-delete,
  &__button-add {
    background-color: inherit;
    background-color: transparent;
    color: currentColor;
    border: none;
    width: fit-content;
  }
}

.n-card a {
  text-decoration: none;
}
.container ul {
  padding-left: 1rem;
}
</style>
