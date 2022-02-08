<template>
  <div class="container ck-content">
    <h2 class="mb-4 text-center">Сообщения группы:</h2>
    <div v-if="!isLoading" class="row">
      <div class="col-xl-12 col-lg-12 cards-container ck-content reverseorder">
        <full-card
          v-for="homeworkToDo in currentGroup.homeworkToDo || []"
          :key="homeworkToDo"
          type="body"
          icon="fas fa-user-edit"
          class="mb-4 mt-4 mb-xl-0"
          :shadow="true"
          shadowSize="md"
          :hover="true"
        >
          <h2 class="text-center card-title text-uppercase mb-1">{{ homeworkToDo.title }}</h2>
          <div class="m-2 card-text">
            <div v-html="homeworkToDo.message"></div>
          </div>
          <template v-slot:footer>
            <span class="text-nowrap text-muted footer"
              >Создано {{ new Date(homeworkToDo.time).toLocaleString() }}.<span class="font-weight-bold"></span
              ><b-button pill class="button-edit btn-light" @click="handleEditMessage(homeworkToDo)"
                ><em class="far fa-edit"></em> </b-button
              ><b-button
                pill
                class="button-delete align-self-center btn-light"
                @click="handleDeleteMessage(homeworkToDo.time), $toast('Сообщение удалено')"
                ><em class="fa fa-trash-alt"></em>
              </b-button>
            </span>
          </template>
        </full-card>
      </div>
    </div>
    <div v-if="isLoading" class="spinner-border" role="status">
      <span class="visually-hidden">Загружается...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import FullCard from "./FullCard.vue";

interface HomeWorks {
  message: string;
  time: string;
}

export default defineComponent({
  name: "Messages",
  components: {
    FullCard,
  },
  emits: ["updateMessage"],
  computed: {
    ...mapState(["currentGroup", "isLoading", "lessons"]),
  },

  methods: {
    ...mapActions(["updateGroup", "getGroupById"]),

    async handleDeleteMessage(messageTime: string) {
      const groupToUpdate = {
        homeworkToDo: [
          ...this.currentGroup.homeworkToDo.filter((homework: HomeWorks) => homework.time !== messageTime),
        ],
        id: this.currentGroup.id,
      };
      await this.updateGroup(groupToUpdate);
    },

    handleEditMessage(homeworkToDo: HomeWorks) {
      this.$emit("updateMessage", homeworkToDo);
    },
  },
});
</script>

<style scoped>
.reverseorder {
  display: flex;
  flex-direction: column-reverse;
}
.items-list {
  list-style: none;
}
.list-group-item-success {
  background-color: var(--bairro-alto-logo-color);
}
.button-delete {
  font-size: 16px;
  background-color: transparent;
  border: transparent;
}
.footer {
  display: flex;
  justify-content: space-between;
}
</style>
