<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <div class="container"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import state from "@/store/state";
import sideBarAdminMenuItems from "@/views/AdminBoard/sideBarAdminMenuItems";

export default defineComponent({
  name: "AdminBoard",
  components: { SidebarMenu },
  data() {
    return {
      isHiddenFormToCreate: true,
      profileName: state.currentUser.firstName,
      menuItems: sideBarAdminMenuItems(),
    };
  },

  methods: {},
});
</script>
