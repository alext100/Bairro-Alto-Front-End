<template>
  <div class="container">
    <h2 class="mb-4">Студенты группы:</h2>
    <ul class="list-group-item-success">
      <li v-for="userFromGroup in loadedUsersFromGroup || []" :key="userFromGroup" class="container__list items-list">
        <b-card>
          <div class="mt-3">
            <b-card-group deck>
              <b-card bg-variant="light" class="text-center">
                <router-link :to="'/online-lesson/' + userFromGroup.id">
                  <b-card-text>{{ userFromGroup.firstName }} {{ userFromGroup.lastName }}</b-card-text>
                </router-link>

                <template #footer>
                  <b-button
                    @click="handleDeleteUser(userFromGroup.id), $toast('Студент удалён из группы')"
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import { UserModel } from "@/types/interfaces";

export default defineComponent({
  name: "GroupMembers",

  computed: {
    ...mapState(["currentGroup", "loadedUsersFromGroup"]),
  },

  methods: {
    ...mapActions(["getGroupById", "getUserById", "deleteLoadedUsers", "deleteMemberFromGroup", "getAllUsersFromApi"]),
    async handleDeleteUser(userId: string) {
      await this.deleteMemberFromGroup({ groupId: this.$route.params.id, userId });
      await this.getGroupById(this.$route.params.id);
      const groupMembers = this.currentGroup.members;
      groupMembers.forEach((member: UserModel) => this.getUserById(member));
      this.deleteLoadedUsers();
    },
  },

  // eslint-disable-next-line consistent-return
  async mounted() {
    try {
      await this.getGroupById(this.$route.params.id);
      const groupMembers = this.currentGroup.members;
      await groupMembers.forEach((member: UserModel) => this.getUserById(member));
      this.deleteLoadedUsers();
    } catch {
      return false;
    }
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
