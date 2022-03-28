<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <ChangePassword />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import SidebarMenu from "@/components/SidebarMenu.vue";
import ChangePassword from "@/components/ChangePassword.vue";
import sideBarStudentMenuItems from "./sideBarStudentMenuItems";

export default defineComponent({
  name: "StudentSettings",
  components: {
    SidebarMenu,
    ChangePassword,
  },
  setup() {
    const { state } = useStore();

    return {
      currentUser: state.currentUser,
      menuItems: sideBarStudentMenuItems(),
      profileName: state.currentUser.firstName,
    };
  },
});
</script>
