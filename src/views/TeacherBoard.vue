<template>
  <div class="container">
    <h1>Привет {{ currentUser.firstName }}!</h1>
    <b-card border-variant="light" class="m-4 teacher-card" style="min-width: 300px">
      <b-card-text
        >В этом разделе можно найти все группы школы и добавить группы в твой список или удалить их оттуда. Перейдя в
        конкретную группу можно добавить или удалить студентов из группы. Назначить им домашнее задание. Или делать
        заметки во время онлайн урока.</b-card-text
      >
    </b-card>
    <div class="container">
      <h2>Мои группы:</h2>
      <ul class="list-group-item-success">
        <li v-for="group in userGroups || []" :key="group" class="d-flex flex-column items-list">
          <b-card>
            <div class="mt-3">
              <b-card-group deck>
                <b-card bg-variant="light" class="text-center">
                  <router-link :to="'/group/' + group.id"
                    ><b-card-text>{{ group.groupName }}</b-card-text>
                  </router-link>

                  <template #footer>
                    <b-button
                      @click="handleDeleteGroupe(group.id), $toast('Удалено из твоих групп')"
                      pill
                      class="btn-lg button-delete align-self-center"
                      ><em class="far fa-trash-alt"></em>
                    </b-button>
                  </template>
                </b-card>
              </b-card-group>
            </div>
          </b-card>
        </li>
      </ul>
    </div>

    <b-button v-on:click="isHiddenFormToCreate = !isHiddenFormToCreate" pill class="b-card__button mb-5 mt-5 w-100">{{
      isHiddenFormToCreate ? "Показать все группы" : "Скрыть список групп"
    }}</b-button>

    <div v-if="!isHiddenFormToCreate" class="container">
      <h2>Все группы:</h2>
      <ul class="list-group-item-success">
        <li v-for="group in groups || []" :key="group" class="d-flex flex-column items-list">
          <b-card>
            <div class="mt-3">
              <b-card-group deck>
                <b-card bg-variant="light" class="text-center">
                  <router-link :to="'/group/' + group.id">
                    <b-card-text>{{ group.groupName }}</b-card-text>
                  </router-link>
                  <template #footer>
                    <b-button
                      @click="handleAddToMyGroups(group.id), $toast('Добавлено в твои группы')"
                      pill
                      class="btn-lg button-delete align-self-center"
                      ><em class="bi bi-plus-circle"></em>
                    </b-button>
                  </template>
                </b-card>
              </b-card-group>
            </div>
          </b-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

export default defineComponent({
  name: "TeacherBoard",

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
      isHiddenFormToCreate: true,
    };
  },
});
</script>

<style lang="scss" scoped>
.b-card__button {
  min-width: fit-content;
}
.button-delete {
  background-color: inherit;
  background-color: transparent;
  color: currentColor;
  border: none;
  width: fit-content;
}

.items-list {
  list-style: none;
}
.list-group-item-success {
  background-color: var(--bairro-alto-logo-color);
}
.teacher-card {
  font-size: 20px;
  background-color: transparent;
  font-family: "Tenor-sans", sans-serif;
  text-align: justify;
}
</style>
