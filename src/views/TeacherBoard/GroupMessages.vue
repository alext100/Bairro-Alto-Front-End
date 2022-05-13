<template>
  <div class="container ck-content">
    <n-h2 class="mb-4 text-center">TPC:</n-h2>
    <div class="row">
      <div class="col-xl-12 col-lg-12 cards-container ck-content reverseorder">
        <full-card
          v-for="homeworkToDo in currentGroup.homeworkToDo || []"
          :key="homeworkToDo"
          type="body"
          class="mb-4 mt-4 mb-xl-0"
          :shadow="true"
          shadowSize="md"
          :hover="true"
        >
          <n-h3 class="text-center card-title text-uppercase mb-1">{{ homeworkToDo.title }}</n-h3>
          <div class="m-2 card-text">
            <div v-viewer="{ toolbar: true }">
              <div v-html="homeworkToDo.message"></div>
            </div>
          </div>
          <div v-if="homeworkToDo.audios !== []">
            <div v-for="audio in homeworkToDo.audios || []" :key="audio">
              <audio controls="true">
                <source :src="audio" type="audio/ogg" />
                <source :src="audio" type="audio/mpeg" />
                <source :src="audio" type="audio/mp3" />
                <source :src="audio" type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
          <template v-slot:footer>
            <span class="text-nowrap text-muted footer">
              Создано {{ new Date(homeworkToDo.time).toLocaleString() }}.
              <span class="font-weight-bold"> </span>
              <button v-tippy="'Редактировать'" class="button-edit btn-light" @click="handleEditMessage(homeworkToDo)">
                <em class="far fa-edit"></em>
              </button>
              <button
                v-tippy="'Удалить'"
                class="button-delete align-self-center btn-light"
                @click="handleDeleteMessage(homeworkToDo.time), $toast('Удалено')"
              >
                <em class="fa fa-trash-alt"></em>
              </button>
            </span>
          </template>
        </full-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { NH2, NH3 } from "naive-ui";
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import FullCard from "@/components/FullCard.vue";

interface HomeWorks {
  message: string;
  time: string;
}

export default defineComponent({
  name: "Messages",
  components: {
    NH2,
    NH3,
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
.button-delete,
.button-edit {
  font-size: 16px;
  background-color: transparent;
  border: transparent;
}
.footer {
  display: flex;
  justify-content: space-between;
}
</style>
