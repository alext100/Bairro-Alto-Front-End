<template>
  <div class="container">
    <h2 class="m-3">Заметки {{ loadedOneUserById.firstName }}:</h2>
    <ul class="list-group-item-success reverseorder">
      <li v-for="error in currentStudentErrors || []" :key="error" class="container__list items-list">
        <b-card>
          <div class="mt-3">
            <b-card-group deck>
              <b-card bg-variant="light" :header="new Date(error.date).toLocaleString()" class="text-center">
                <b-card-sub-title><strong>Tipo:</strong> {{ error.errorType }}</b-card-sub-title>
                <b-card-text><strong>Entrada: </strong>{{ error.errorMessage }}</b-card-text>
                <b-card-text><strong>Comentario:</strong> {{ error.errorComment }}</b-card-text>
                <b-button @click="handleDeleteError(error.id)"><em class="far fa-trash-alt"></em></b-button>
              </b-card>
            </b-card-group>
          </div>
        </b-card>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

export default defineComponent({
  name: "StudentErrors",
  computed: {
    ...mapState(["currentStudentErrors", "loadedOneUserById"]),
  },
  methods: {
    ...mapActions(["getUserErrorsById", "getOneUserById", "deleteErrorFromUser"]),
    async handleDeleteError(userErrorId: string) {
      await this.deleteErrorFromUser({ userId: this.$route.params.id, userErrorId });
    },
  },
  mounted() {
    this.getUserErrorsById(this.$route.params.id);
    this.getOneUserById(this.$route.params.id);
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
</style>
