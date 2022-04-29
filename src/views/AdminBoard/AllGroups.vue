<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" @click="handleLogout" :isExitButton="true" />
  <div class="container">
    <n-h1>Все группы</n-h1>
    <n-p class="ms-2">
      Страница для удаления не нужных групп и редактирования названия группы. В целях безопасности кнопка для удаления
      сейчас не активирована.
    </n-p>
    <n-p class="ms-2"> Для редактирования кликните два раза по названию группы</n-p>
    <div style="height: 100%">
      <div class="button-container">
        <SubmitButton
          v-if="!rowIsSelected"
          v-on:click="onBtDelete()"
          class="delete-group-button btn btn-danger m-1"
          :buttonDisabled="true"
          v-tippy="'Кнопка для удаления сейчас не активирована'"
        >
          Удалить
        </SubmitButton>
      </div>
      <div style="height: 100%; box-sizing: border-box">
        <ag-grid-vue
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowData="rowData"
          :animateRows="true"
          :editType="editType"
          :pagination="true"
          :paginationAutoPageSize="true"
          :getRowId="getRowNodeId"
          :rowSelection="rowSelection"
          @grid-ready="onGridReady"
          @row-selected="onRowSelected"
          @cell-value-changed="onCellValueChanged"
        >
        </ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { NP, NH1 } from "naive-ui";
import { useRouter } from "vue-router";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/dist/styles/ag-grid.css";
import SidebarMenu from "@/components/SidebarMenu.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { computed, defineComponent, onMounted } from "vue";
import sideBarAdminMenuItems from "./sideBarAdminMenuItems";

export default defineComponent({
  name: "AdminBoard",
  components: { SidebarMenu, AgGridVue, NP, NH1, SubmitButton },
  setup() {
    const { state, dispatch } = useStore();
    const router = useRouter();
    const groups = computed(() => state.actions.groups);
    const lastLoadedUser = computed(() => state.actions.lastLoadedUser);
    let rowIsSelected = false;
    let gridApi = null;
    let gridColumnApi = null;

    onMounted(() => {
      document.body.style.backgroundColor = "white";
      dispatch("getGroupsFromApi");
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
      const groupToUpdate = event.data;
      await dispatch("updateGroup", groupToUpdate);
    };

    const handleLogout = (event) => {
      if (event.target.classList.contains("profile__log_out")) {
        dispatch("deleteDataFromLocalStorage");
        router.push("/");
      }
    };

    const onBtDelete = async () => {
      const api = gridApi;
      const selectedRows = api.getSelectedRows();

      if (!selectedRows || selectedRows.length === 0) {
        console.error("No rows selected!");
        return;
      }
      await selectedRows.forEach((row) => {
        const groupId = row.id;
        dispatch("deleteGroup", { groupId });
      });
      api.applyTransaction({ remove: selectedRows });
    };

    return {
      columnDefs: [
        {
          field: "",
          checkboxSelection: true,
          headerCheckboxSelection: true,
          width: 35,
          minWidth: 25,
          maxWidth: 45,
          sortable: false,
          filter: false,
          editable: false,
        },
        {
          field: "groupName",
          headerName: "Название группы",
          editable: true,
          maxWidth: 750,
          minWidth: 200,
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
        filter: true,
        suppressSizeToFit: true,
        enableCellChangeFlash: true,
      },
      groups,
      gridApi,
      onBtDelete,
      onGridReady,
      getRowNodeId,
      gridColumnApi,
      handleLogout,
      rowIsSelected,
      onRowSelected,
      lastLoadedUser,
      columnApi: null,
      onCellValueChanged,
      editType: "fullRow",
      rowSelection: "multiple",
      isHiddenFormToCreate: true,
      menuItems: sideBarAdminMenuItems(),
      rowData: computed(() => state.groups),
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
  min-height: 70px;
}
.delete-group-button {
  width: 180px !important;
  height: 50px;
}
</style>
