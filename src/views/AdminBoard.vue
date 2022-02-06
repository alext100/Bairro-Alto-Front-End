<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <div class="container"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import state from "@/store/state";

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
          link: `/admin/all-groups`,
          name: "Все группы",
          icon: "bx-group",
        },
        {
          link: `/admin`,
          name: "User",
          tooltip: "User",
          icon: "bx-user",
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

  methods: {},
});
</script>
