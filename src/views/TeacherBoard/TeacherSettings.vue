<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <ChangePassword />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import SidebarMenu from "@/components/SidebarMenu.vue";
import sidebarTeacherMenuItems from "@/views/TeacherBoard/sideBarTeacherMenuItems";
import ChangePassword from "@/components/ChangePassword.vue";

export default defineComponent({
  name: "TeacherSettings",
  components: {
    SidebarMenu,
    ChangePassword,
  },
  setup() {
    const { state } = useStore();

    return {
      currentUser: state.currentUser,
      menuItems: sidebarTeacherMenuItems(),
      profileName: state.currentUser.firstName,
    };
  },
});
</script>
