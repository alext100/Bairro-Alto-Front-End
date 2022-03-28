<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <div v-if="!isLoading" style="height: 100%" class="m-5">
    <h1 v-if="lastLoadedUser.studentGroups[0] !== undefined" class="h1">{{ currentGroup.groupName }}</h1>
    <h1 v-if="lastLoadedUser.studentGroups[0] === undefined" class="h1">Вас ещё не добавили ни в одну группу!</h1>
    <div style="height: 100%; box-sizing: border-box">
      <ag-grid-vue
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        :pagination="true"
        :paginationAutoPageSize="true"
      >
        ></ag-grid-vue
      >
    </div>
  </div>
  <div v-if="isLoading" class="spinner-border" role="status">
    <span class="visually-hidden">Загружается...</span>
  </div>
</template>

<script>
import state from "@/store/state";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { computed, defineComponent } from "vue";
import { mapActions, mapState, useStore } from "vuex";
import SidebarMenu from "@/components/SidebarMenu.vue";
import sideBarStudentMenuItems from "./sideBarStudentMenuItems";

function dateFormatter(params) {
  return new Date(params.value).toLocaleDateString();
}

export default defineComponent({
  name: "StudentErrors",
  components: {
    AgGridVue,
    SidebarMenu,
  },

  setup() {
    const store = useStore();

    return {
      /*     getUser: () => store.dispatch(`getUserById(${this.currentUser.id})`), */
      columnDefs: [
        {
          field: "errorType",
          headerName: "Тип ошибки",
          filter: false,
          maxWidth: 200,
          resizable: false,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
        { field: "errorMessage", headerName: "Замечание", flex: 1, editable: false, autoHeight: true, wrapText: true },
        {
          field: "errorComment",
          headerName: "Корректная форма",
          flex: 1,

          autoHeight: true,
          wrapText: true,
        },
        {
          field: "date",
          headerName: "Дата",
          filter: false,
          width: 40,
          valueFormatter: dateFormatter,
          sort: "desc",
        },
      ],
      rowData: computed(() => store.state.groupErrors),
      defaultColDef: {
        width: 400,
        minWidth: 200,
        maxWidth: 600,
        floatingFilter: true,
        sortable: true,
        resizable: true,
        filter: true,
        suppressSizeToFit: true,
        enableCellChangeFlash: true,
      },
    };
  },

  data() {
    return {
      profileName: state.currentUser.firstName,
      menuItems: sideBarStudentMenuItems(),
    };
  },
  methods: {
    ...mapActions(["getGroupErrorsById", "getGroupById", "getUserById"]),
  },
  computed: {
    ...mapState(["groupErrors", "isLoading", "currentUser", "currentGroup", "lastLoadedUser"]),
  },
  async mounted() {
    await this.getUserById(this.currentUser.id);

    if (this.lastLoadedUser?.studentGroups[0]) {
      await this.getGroupById(this.lastLoadedUser?.studentGroups[0]);
      await this.getGroupErrorsById(this.lastLoadedUser?.studentGroups[0]);
    } else console.log("error");
  },
  async created() {
    await this.getUserById(this.currentUser.id);
  },
});
</script>

<style lang="scss">
@import "~ag-grid-community/dist/styles/ag-grid.css";
@import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
.ag-theme-alpine {
  width: 100%;
  height: 800px;
  justify-content: center;
}
.button-container {
  min-height: 60px;
}
</style>
