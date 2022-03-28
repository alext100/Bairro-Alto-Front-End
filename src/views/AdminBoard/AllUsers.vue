<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" @click="handleLogout" :isExitButton="true" />
  <div class="container">
    <n-h1>Все пользователи</n-h1>
    <n-p> Чтобы изменить права пользователя, используйте значения true и false в соответствующих столбцах. </n-p>
    <n-p> Данные в каждом столбце можно отсортировать. </n-p>
    <n-p> Так же работает поиск по имени, фамилии, почте </n-p>
    <div style="height: 100%">
      <div style="height: 100%; box-sizing: border-box">
        <ag-grid-vue
          class="ag-theme-alpine"
          :rowData="rowData"
          :pagination="true"
          :animateRows="true"
          :editType="editType"
          :columnDefs="columnDefs"
          :paginationAutoPageSize="true"
          :defaultColDef="defaultColDef"
          @grid-ready="onGridReady"
          @cell-value-changed="onCellValueChanged"
        >
          ></ag-grid-vue
        >
      </div>
    </div>
  </div>
</template>

<script>
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { computed, defineComponent, onMounted } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { useStore } from "vuex";
import { NP, NH1 } from "naive-ui";
import { useRouter } from "vue-router";
import sideBarAdminMenuItems from "./sideBarAdminMenuItems";

export default defineComponent({
  name: "AdminBoard",
  components: { SidebarMenu, AgGridVue, NP, NH1 },
  setup() {
    const { state, dispatch } = useStore();
    const router = useRouter();
    const lastLoadedUser = computed(() => state.lastLoadedUser);
    let rowIsSelected = false;
    let gridApi = null;
    let gridColumnApi = null;

    onMounted(() => {
      document.body.style.backgroundColor = "white";
      dispatch("getAllUsersFromApi");
    });

    const onGridReady = (params) => {
      gridApi = params.api;
      gridColumnApi = params.columnApi;
    };

    const getRowNodeId = ({ data }) => data.id;

    const onRowSelected = (event) => {
      rowIsSelected = event.node.isSelected();
      return rowIsSelected;
    };

    const onCellValueChanged = async (event) => {
      const userToUpdate = event.data;
      await dispatch("updateUser", userToUpdate);
    };

    const handleLogout = (event) => {
      if (event.target.classList.contains("profile__log_out")) {
        dispatch("deleteDataFromLocalStorage");
        router.push("/");
      }
    };

    return {
      gridApi,
      onGridReady,
      getRowNodeId,
      handleLogout,
      gridColumnApi,
      rowIsSelected,
      onRowSelected,
      columnApi: null,
      onCellValueChanged,
      editType: "fullRow",
      rowSelection: "multiple",
      columnDefs: [
        {
          field: "firstName",
          headerName: "Имя",
          editable: false,
          maxWidth: 750,
          minWidth: 200,
          filter: true,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
        {
          field: "lastName",
          headerName: "Фамилия",
          filter: true,
          editable: false,
          maxWidth: 750,
          minWidth: 200,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
        {
          field: "email",
          headerName: "Почта",
          filter: true,
          editable: false,
          maxWidth: 750,
          minWidth: 200,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
        {
          field: "adminAccess",
          headerName: "Админ",
          hide: true,
          editable: true,
          maxWidth: 100,
          minWidth: 80,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
        {
          field: "teacherAccess",
          headerName: "Преподаватель",
          editable: true,
          maxWidth: 140,
          minWidth: 90,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
        {
          field: "studentAccess",
          headerName: "Студент",
          editable: true,
          maxWidth: 120,
          minWidth: 90,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
      ],
      defaultColDef: {
        width: 500,
        floatingFilter: true,
        sortable: true,
        resizable: true,
        flex: 1,
        suppressSizeToFit: true,
        enableCellChangeFlash: true,
        headerTooltip: "Сортировать",
      },
      lastLoadedUser,
      isHiddenFormToCreate: true,
      menuItems: sideBarAdminMenuItems(),
      rowData: computed(() => state.allUsers),
      profileName: state.currentUser.firstName,
    };
  },
});
</script>

<style lang="scss" scoped>
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
