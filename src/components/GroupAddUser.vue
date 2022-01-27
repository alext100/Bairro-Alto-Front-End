<template>
  <div class="container">
    <h4>Добавить студента</h4>
    <ul class="list-group-item-success">
      <li v-for="user in allUsers || []" :key="user.id" class="container__list items-list">
        <b-card>
          <div class="mt-3">
            <b-card-group deck>
              <b-card bg-variant="light" class="text-center">
                <router-link :to="'/online-lesson/' + user.id">{{ user.firstName }} {{ user.lastName }}</router-link>
                <b-card-text>{{ user.email }}</b-card-text>
                <b-button @click="handleAddUserToGroup(user.id), $toast('Добавлено!')"
                  ><em class="fas fa-user-plus"></em
                ></b-button>
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
  name: "AddUser",
  computed: {
    ...mapState(["allUsers"]),
  },
  methods: {
    ...mapActions(["addGroupToAnyUser", "getAllUsersFromApi"]),
    async handleAddUserToGroup(userId: string) {
      this.addGroupToAnyUser({ groupId: this.$route.params.id, userId });
    },
  },

  mounted() {
    this.getAllUsersFromApi();
  },
});
</script>

<style scoped>
.items-list {
  list-style: none;
}
.list-group-item-success {
  background-color: var(--bairro-alto-logo-color);
}
</style>
