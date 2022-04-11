<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <div class="container">
    <!-- <button :disabled="updatingData" @click="addData">Add Data</button> -->
    <chat-container v-if="showChat" :current-user-id="currentUser.id" :theme="theme" :is-device="isDevice" />
  </div>
</template>

<script>
import { useStore } from "vuex";
import "vue-advanced-chat/dist/vue-advanced-chat.css";
import ChatContainer from "@/views/ChatContainer.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import sideBarStudentMenuItems from "./sideBarStudentMenuItems";

export default {
  name: "StudentChat",
  components: {
    SidebarMenu,
    ChatContainer,
  },
  setup() {
    const { state } = useStore();
    const isDevice = ref(false);

    onMounted(() => {
      isDevice.value = window.innerWidth < 500;
      window.addEventListener("resize", (ev) => {
        if (ev.isTrusted) isDevice.value = window.innerWidth < 500;
      });
    });

    const currentUser = computed(() => state.currentUser);
    const isLoading = computed(() => state.isLoading);
    const allUsers = computed(() => state.allUsers);

    onUnmounted(() => {
      document.body.removeEventListener("resize", (ev) => {
        if (ev.isTrusted) isDevice.value = window.innerWidth < 500;
      });
    });

    return {
      isDevice,
      allUsers,
      isLoading,
      currentUser,
      theme: "light",
      showChat: true,
      currentUserId: "",
      updatingData: false,
      menuItems: sideBarStudentMenuItems(),
      profileName: state.currentUser.firstName,
    };
  },

  /*     methods: {
         async addData() { // Update all users data in Cloud Firestore.  _id, username - required!
      await this.getAllUsersFromApi();
      this.updatingData = true;
      const users = this.allUsers;
      console.log("users: ", users);
      await users.forEach((user) => {
        firestoreService.addIdentifiedUser(user.id, {
          _id: user.id,
          username: `${user.firstName} ${user.lastName.charAt(0)}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      });
    },
  }, */
};
</script>

<style lang="scss">
body {
  background: #fafafa;
  margin: 0;
}

input {
  -webkit-appearance: none;
}

.app-container {
  font-family: "Quicksand", sans-serif;
  padding: 20px 30px 30px;
}

.app-mobile {
  padding: 0;

  &.app-mobile-dark {
    background: #131415;
  }

  .user-logged {
    margin: 10px 5px 0 10px;
  }

  select {
    margin: 10px 0;
  }

  .button-theme {
    margin: 10px 10px 0 0;

    .button-github {
      height: 23px;

      img {
        height: 23px;
      }
    }
  }
}

.user-logged {
  font-size: 12px;
  margin-right: 5px;
  margin-top: 10px;

  &.user-logged-dark {
    color: #fff;
  }
}

select {
  height: 20px;
  outline: none;
  border: 1px solid #e0e2e4;
  border-radius: 4px;
  background: #fff;
  margin-bottom: 20px;
}

.button-theme {
  float: right;
  display: flex;
  align-items: center;

  .button-light {
    background: #fff;
    border: 1px solid #46484e;
    color: #46484e;
  }

  .button-dark {
    background: #1c1d21;
    border: 1px solid #1c1d21;
  }

  button {
    color: #fff;
    outline: none;
    cursor: pointer;
    border-radius: 4px;
    padding: 6px 12px;
    margin-left: 10px;
    border: none;
    font-size: 14px;
    transition: 0.3s;
    vertical-align: middle;

    &.button-github {
      height: 30px;
      background: none;
      padding: 0;
      margin-left: 20px;

      img {
        height: 30px;
      }
    }

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }

    @media only screen and (max-width: 768px) {
      padding: 3px 6px;
      font-size: 13px;
    }
  }
}

.version-container {
  padding-top: 20px;
  text-align: right;
  font-size: 14px;
  color: grey;
}
</style>
