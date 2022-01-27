<template>
  <div class="container">
    <b-card class="mb-1 card-description" border-variant="white">
      <b-card-text>
        Durante la clase online, puedes tomar notas rápidas. Por ejemplo, una palabra o frase en la que el alumno
        cometió un error. O vocabulario nuevo. O un error de pronunciación. Después de la lección, puedes editar las
        notas y después de presionar el botón confirmar, el estudiante verá este informe en su cuenta personal.
      </b-card-text>
    </b-card>

    <div class="container-sm login-form d-flex flex-column mt-5">
      <b-card class="mb-1">
        <b-form-group
          label-cols-lg="3"
          label="Apunte para el alumno:"
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
                description="El error del alumno aquí, por favor"
                label="El mensaje para el alumno"
                label-for="input-mensaje"
                valid-feedback="¡Gracias!"
                floating
              >
                <b-form-input
                  id="input-mensaje"
                  v-model="message"
                  trim
                  placeholder="Entra el mensaje, por favor!"
                ></b-form-input>
              </b-form-group>
            </div>
            <div>
              <b-form-group
                id="errorComment"
                description="Frase o palabra correcta aquí, por favor"
                label="Correcto sería:"
                label-for="input-errorComment"
                valid-feedback="Thank you!"
                floating
              >
                <b-form-input
                  id="input-errorComment"
                  v-model="errorComment"
                  trim
                  placeholder="Entra la frase correcta, por favor!"
                ></b-form-input>
              </b-form-group>
            </div>
          </b-form>
        </b-form-group>
        <b-form-group
          label-class="fw-bold pt-0"
          class="mb-0"
          label-size="lg"
          label="Tipo de error:"
          label-cols-sm="3"
          label-align-sm="start"
          v-slot="{ ariaDescribedby }"
        >
          <b-form-radio-group
            buttons
            button-variant="outline-secondary"
            size="md"
            class="pt-2"
            v-model="mixedGroupedSelected"
            :options="mixedGroupedOptions"
            :aria-describedby="ariaDescribedby"
          ></b-form-radio-group>
        </b-form-group>
      </b-card>
      <b-button :disabled="isDisabled" @click="handleMakeMessageWithError" type="submit" pill
        >{{ isDisabled ? "Ingrese algo" : "Enviar" }} {{ !isDisabled ? mixedGroupedSelected : "" }}</b-button
      >
    </div>
  </div>
  <StudentErrorsVue />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { mapActions, mapState } from "vuex";
import StudentErrorsVue from "../components/StudentErrors.vue";

export default defineComponent({
  setup() {
    const mixedGroupedSelected = ref();
    const mixedGroupedOptions = [
      { text: "Nueva palabra", value: "Nueva palabra" },
      { text: "Fallo", value: "Fallo" },
      { text: "Pronunciación", value: "Pronunciación" },
      { text: "Otro", value: "Otro" },
    ];
    return {
      mixedGroupedOptions,
      mixedGroupedSelected,
    };
  },
  name: "OnlineLesson",
  components: {
    StudentErrorsVue,
  },
  data() {
    return {
      isDisabled: true,
      message: "",
      errorComment: "",
    };
  },

  computed: {
    ...mapState(["currentStudentErrors"]),
  },

  methods: {
    ...mapActions(["addErrorToUser", "getUserErrorsById"]),
    checkForm() {
      if (this.message.length > 4) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
    async handleMakeMessageWithError() {
      if (this.message !== "") {
        const userError = {
          errorMessage: this.message,
          errorComment: this.errorComment,
          errorType: this.mixedGroupedSelected,
          date: new Date(),
        };
        await this.addErrorToUser({ userId: this.$route.params.id, userError });
        this.message = "";
        this.errorComment = "";
      }
    },
  },
  mounted() {
    this.getUserErrorsById(this.$route.params.id);
  },
});
</script>

<style scoped>
.card-description {
  font-size: 20px;
  font-family: "Tenor-sans", sans-serif;
  text-align: justify;
}
</style>
