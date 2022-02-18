<template>
  <div class="container">
    <b-card class="mb-1 card-description" border-variant="white">
      <b-card-text>
        В течении урока на этой странице можно делать быстрые заметки. Например новое слово, ошибка ученика, ошибка в
        произношении или вне категории. После занятия заметки можно отредактировать и студенты группы смогут их увидеть
        в своих личных кабинетах.
      </b-card-text>
    </b-card>

    <div class="container-sm login-form d-flex flex-column mt-5">
      <b-card class="mb-1">
        <b-form-group
          label-cols-lg="3"
          label="Заметка для группы:"
          label-size="lg"
          label-class="fw-bold pt-0"
          class="mb-0"
        >
          <b-form
            @change="checkForm"
            autoComplete="off"
            action
            v-on:keydown.enter.prevent="handleMakeMessageWithError"
            data-test="loginBForm"
          >
            <div>
              <b-form-group
                id="mensaje"
                description=""
                label="Сообщение"
                label-for="input-mensaje"
                valid-feedback="Спасибо!"
                floating
              >
                <b-form-input
                  id="input-mensaje"
                  v-model="message"
                  trim
                  placeholder="Пожалуйста введите сообщение!"
                ></b-form-input>
              </b-form-group>
            </div>
            <div>
              <b-form-group
                id="errorComment"
                description=""
                label="Правильно было бы:"
                label-for="input-errorComment"
                valid-feedback="Спасибо!"
                floating
              >
                <b-form-input
                  id="input-errorComment"
                  v-model="errorComment"
                  trim
                  placeholder="Пожалуйста, напишите правильную фразу или слово!"
                ></b-form-input>
              </b-form-group>
            </div>
          </b-form>
        </b-form-group>
        <b-form-group
          label-class="fw-bold pt-0"
          class="mb-0 text-nowrap"
          label-size="lg"
          label="Тип ошибки:"
          label-cols-sm="3"
          label-align-sm="start"
          v-slot="{ ariaDescribedby }"
        >
          <b-form-radio-group
            buttons
            button-variant="outline-secondary"
            size="md"
            class="pt-3 flex-wrap justify-content-around"
            v-model="mixedGroupedSelected"
            :options="mixedGroupedOptions"
            :aria-describedby="ariaDescribedby"
          ></b-form-radio-group>
          <p v-if="noType" class="no-error-type-alert m-1">Выберите тип заметки</p>
        </b-form-group>
      </b-card>
      <b-button
        :disabled="isDisabled"
        @click="handleMakeMessageWithError"
        type="submit"
        class="mt-3 mb-3 input-form--submit-button"
        pill
        >{{ isDisabled ? "Сообщение должно быть больше 4 символов" : "Отправить" }}
        {{ !isDisabled ? mixedGroupedSelected : "" }}</b-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { mapActions, mapState } from "vuex";

export default defineComponent({
  setup() {
    const mixedGroupedSelected = ref();
    const mixedGroupedOptions = [
      { text: "Новое слово", value: "Новое слово" },
      { text: "Ошибка", value: "Ошибка" },
      { text: "Произношение", value: "Произношение" },
      { text: "Другое", value: "Другое" },
    ];
    return {
      mixedGroupedOptions,
      mixedGroupedSelected,
    };
  },
  name: "OnlineLesson",
  components: {},
  data() {
    return {
      isDisabled: true,
      noType: false,
      message: "",
      errorComment: "",
    };
  },

  computed: {
    ...mapState(["groupErrors", "currentGroup"]),
  },

  methods: {
    ...mapActions(["addErrorToGroup"]),
    checkForm() {
      if (this.message.length > 4) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
    async handleMakeMessageWithError() {
      this.noType = true;
      if (this.message !== "" && this.mixedGroupedSelected !== undefined) {
        const groupError = {
          errorMessage: this.message,
          errorComment: this.errorComment,
          errorType: this.mixedGroupedSelected,
          date: new Date(),
        };
        await this.addErrorToGroup({ groupId: this.$route.params.id, groupError });
        this.noType = false;
        this.message = "";
        this.errorComment = "";
      }
      if (this.mixedGroupedSelected === undefined) {
        this.noType = true;
      }
    },
  },
});
</script>

<style scoped>
.card-description {
  font-size: 20px;
  font-family: "Tenor-sans", sans-serif;
  text-align: justify;
}
.input-form--submit-button {
  width: 100%;
}

.no-error-type-alert {
  color: var(--error-color);
  font-size: larger;
  animation: fade-in 2s;
  position: absolute;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
