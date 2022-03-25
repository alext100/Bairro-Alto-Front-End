<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <h1 class="mb-4 text-center">Trabalhos para casa:</h1>
  <div class="container ck-content">
    <div class="row">
      <div class="col-xl-12 col-lg-12 cards-container ck-content reverseorder">
        <full-card
          v-for="homeworkToDo in studentGroup?.homeworkToDo || []"
          :key="homeworkToDo"
          type="body"
          class="mb-4 mt-4 mb-xl-0"
          :shadow="true"
          shadowSize="md"
          :hover="true"
        >
          <h2 class="text-center card-title text-uppercase mb-1">{{ homeworkToDo.title }}</h2>
          <div class="m-2 card-text">
            <v-zoomer :mouseWheelToZoom="false" :maxScale="2" pivot="cursor" :limitTranslation="false">
              <div v-html="homeworkToDo.message"></div>
            </v-zoomer>
          </div>
          <div v-if="homeworkToDo.audios !== []">
            <div v-for="audio in homeworkToDo.audios || []" :key="audio">
              <audio controls="true">
                <source :src="audio" type="audio/ogg" />
                <source :src="audio" type="audio/mpeg" />
                <source :src="audio" type="audio/mp3" />
                <source :src="audio" type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
          <template v-slot:footer>
            <span class="text-nowrap text-muted footer">{{ new Date(homeworkToDo.time).toLocaleDateString() }}. </span>
          </template>
        </full-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { mapActions, mapState, useStore } from "vuex";
import FullCard from "@/components/FullCard.vue";
import sideBarStudentMenuItems from "./sideBarStudentMenuItems";

export default defineComponent({
  name: "StudentHomework",
  components: {
    SidebarMenu,
    FullCard,
  },

  setup() {
    const { state, dispatch } = useStore();
    const profileName = state.currentUser?.firstName;
    const studentGroup = state.currentGroup;
    onMounted(() => {
      document.body.style.backgroundColor = "white";
      const studentGroupId = state.currentUser?.studentGroups[0];
      dispatch("getGroupById", studentGroupId);
    });

    return {
      studentGroup,
      profileName,
      menuItems: sideBarStudentMenuItems(),
    };
  },

  computed: {
    ...mapState(["currentUser", "isLoading"]),
  },

  methods: {
    ...mapActions(["getGroupById"]),
  },
});
</script>

<style scoped>
.n-card {
  width: 90%;
}
.n-p {
  font-size: 16px;
  background-color: transparent;
  text-align: justify;
}
.firstParagraph {
  text-indent: 10px;
}
</style>
