<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <div class="container d-flex justify-content-center m-5">
    <n-card :bordered="false">
      <n-h1>Olá {{ profileName }}, tudo bem?</n-h1>
      <n-p v-if="groups.length === 0" class="firstParagraph">
        В этом разделе мы пытаемся создать инструменты для онлайн-обучения в нашей школе. Сейчас вас ещё не добавили ни
        в одну учебную группу, поэтому для начала можете из боковой панели запустить наш чат и найти там вашего
        преподавателя (воспользуйтесь поиском по имени и фамилии). Отправьте сообщение с просьбой добавить вас в группу
        и свой email, чтобы преподавателю вас было проще найти.
      </n-p>
      <n-p v-if="groups.length === 0">
        Этот чат мы используем для коммуникации студентов с преподавателями, студентов друг с другом. Можно создавать
        группы для общения.
      </n-p>
      <n-p v-if="groups.length === 0"> Там же можно отправить свое сделанное домашнее задание преподавателю. </n-p>
      <n-p v-if="groups.length === 0">
        После добавления вас в группу вам станут доступны уроки, замечания и домашние задания
      </n-p>
      <n-p v-if="groups.length !== 0"> </n-p>
    </n-card>
  </div>
</template>

<script>
import state from "@/store/state";
import { defineComponent, onMounted } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { mapState } from "vuex";
import { NCard, NH1, NP } from "naive-ui";
import sideBarStudentMenuItems from "./sideBarStudentMenuItems";

export default defineComponent({
  name: "StudentBoard",
  components: {
    SidebarMenu,
    NCard,
    NH1,
    NP,
  },

  setup() {
    onMounted(() => {
      document.body.style.backgroundColor = "white";
    });

    return {};
  },

  data() {
    return {
      profileName: state.currentUser.firstName,
      menuItems: sideBarStudentMenuItems(),
      groups: state.currentUser.studentGroups,
    };
  },
  computed: {
    ...mapState(["currentUser"]),
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
