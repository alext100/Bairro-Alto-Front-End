<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
</template>

<script>
import state from "@/store/state";
import { defineComponent } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { mapState } from "vuex";
import sideBarStudentMenuItems from "./sideBarStudentMenuItems";

export default defineComponent({
  name: "StudentBoard",
  components: {
    SidebarMenu,
  },

  data() {
    return {
      profileName: state.currentUser.firstName,
      menuItems: sideBarStudentMenuItems(),
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
});
</script>
