<template>
  <div class="container">
    <h2 class="mb-4">Сообщения группы:</h2>
    <ul class="list-group-item-success reverseorder">
      <li v-for="message in currentGroup.homeworkToDo || []" :key="message" class="container__list items-list">
        <b-card>
          <div class="mt-3">
            <b-card-group deck>
              <b-card bg-variant="light" :header="new Date(message.time).toLocaleString()" class="text-center">
                <b-card-text>{{ message.message }}</b-card-text>
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
import { mapState } from "vuex";

export default defineComponent({
  name: "Messages",
  computed: {
    ...mapState(["currentGroup"]),
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
</style>
