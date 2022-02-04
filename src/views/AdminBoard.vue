<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" @click="handleLogout" :isExitButton="true" />
  <div class="container"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import state from "@/store/state";
import { mapActions } from "vuex";

export default defineComponent({
  name: "AdminBoard",
  components: { SidebarMenu },
  data() {
    return {
      isHiddenFormToCreate: true,
      profileName: state.currentUser.firstName,
      menuItems: [
        {
          link: `/admin`,
          name: "Dashboard",
          tooltip: "Dashboard",
          icon: "bx-grid-alt",
        },
        {
          link: `/admin`,
          name: "User",
          tooltip: "User",
          icon: "bx-user",
        },
        {
          link: `/admin`,
          name: "Messages",
          tooltip: "Messages",
          icon: "bx-chat",
        },
        {
          link: `/admin`,
          name: "Settings",
          tooltip: "Setting",
          icon: "bx-cog",
        },
      ],
    };
  },

  methods: {
    ...mapActions(["deleteDataFromLocalStorage"]),
    handleLogout(event: Event) {
      if ((event.target as HTMLInputElement).classList.contains("profile__log_out")) {
        this.deleteDataFromLocalStorage();
        this.$router.push("/");
      }
    },
  },
});
</script>
