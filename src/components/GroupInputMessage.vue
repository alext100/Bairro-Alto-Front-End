<template>
  <div class="container-sm d-flex flex-column mt-5">
    <b-card class="mb-1">
      <b-form autoComplete="off" action v-on:keydown.enter.prevent="handleAddMessage" data-test="loginBForm">
        <div>
          <b-form-group
            id="message"
            description="Здесь можно написать сообщение или оставить домашнее задание"
            label="Сообщение:"
            label-for="input-message"
            valid-feedback="Спасибо!"
            :invalid-feedback="floatingInvalidFeedbackMessage"
            :state="floatingStateMessage"
          >
            <b-form-textarea
              size="lg"
              id="input-message"
              type="textarea"
              v-model="message"
              :state="floatingStateMessage"
              trim
              placeholder="Сообщение"
              rows="6"
              no-resize
            ></b-form-textarea>
          </b-form-group>
        </div>
      </b-form>
    </b-card>
    <b-button class="input-form--submit-button mb-3 mt-1" @click="handleAddMessage" type="submit" pill
      >Отправить</b-button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { mapActions, mapState } from "vuex";
import state from "@/store/state";

export default defineComponent({
  setup() {
    const message = ref("");
    const floatingStateMessage = computed(() => message.value.length >= 5);
    const floatingInvalidFeedbackMessage = computed(() =>
      message.value.length > 0 ? "Введите как минимум 5 символов" : "Пожалуйста напишите что-нибудь"
    );

    return {
      message,
      floatingStateMessage,
      floatingInvalidFeedbackMessage,
    };
  },

  name: "GroupInputMessage",
  methods: {
    ...mapActions(["updateGroup"]),
    ...mapState(["currentGroup"]),
    async handleAddMessage() {
      const groupToUpdate = {
        homeworkToDo: [...state.currentGroup.homeworkToDo, { message: this.message, time: new Date() }],
        id: state.currentGroup.id,
      };
      if (this.message !== "") {
        await this.updateGroup(groupToUpdate);
      }
      this.message = "";
    },
  },
});
</script>

<style scoped>
button.input-form--submit-button {
  width: 150px;
  background-color: #fd8904;
  color: white;
}
</style>
