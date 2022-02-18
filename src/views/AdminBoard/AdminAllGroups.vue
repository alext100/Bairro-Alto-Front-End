<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" @click="handleLogout" :isExitButton="true" />
  <div class="container">
    <div style="height: 100%">
      <!-- <div class="button-container">
      <button v-if="rowIsSelected" v-on:click="onBtDelete()" class="btn btn-danger m-1">Удалить</button>
    </div> -->
      <div style="height: 100%; box-sizing: border-box">
        <ag-grid-vue
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowData="rowData"
          :pagination="true"
          paginationAutoPageSize="true"
          @cell-value-changed="onCellValueChanged"
          @grid-ready="onGridReady"
          :animateRows="true"
          :editType="editType"
          :getRowNodeId="getRowNodeId"
          :rowSelection="rowSelection"
          @row-selected="onRowSelected"
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
import { computed, defineComponent } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import state from "@/store/state";
import { mapActions, mapState, useStore } from "vuex";

export default defineComponent({
  name: "AdminBoard",
  components: { SidebarMenu, AgGridVue },
  setup() {
    const store = useStore();

    return {
      editType: "",
      rowSelection: null,
      gridApi: null,
      columnApi: null,
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
      rowData: computed(() => store.state.groups),
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
    };
  },

  data() {
    return {
      rowIsSelected: false,
      isHiddenFormToCreate: true,
      profileName: state.currentUser.firstName,
      menuItems: [
        {
          link: `/admin`,
          name: "Dashboard",
          tooltip: "Dashboard",
          icon: "bx-grid-alt",
        },
        {
          link: `/admin/all-groups`,
          name: "Все группы",
          icon: "bx-group",
        },
        {
          link: `/admin`,
          name: "User",
          tooltip: "User",
          icon: "bx-user",
        },
        {
          link: `/admin`,
          name: "Settings",
          tooltip: "Setting",
          icon: "bx-cog",
        },
      ],
    };
  },

  methods: {
    ...mapActions(["deleteDataFromLocalStorage", "getGroupsFromApi", "updateGroup"]),
    handleLogout(event) {
      if (event.target.classList.contains("profile__log_out")) {
        this.deleteDataFromLocalStorage();
        this.$router.push("/");
      }
    },

    async onCellValueChanged(event) {
      const groupToUpdate = event.data;
      await this.updateGroup(groupToUpdate);
    },

    /*     async onBtDelete() {
      const api = this.gridApi;
      const selectedRows = api.getSelectedRows();

      if (!selectedRows || selectedRows.length === 0) {
        console.error("No rows selected!");
        return;
      }
      await selectedRows.forEach((row) => {
        const errorId = row.id;
        const groupId = this.$route.params.id;
        this.deleteGroupError({ groupId, errorId });
      });
      api.applyTransaction({ remove: selectedRows });
    }, */

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },

    getRowNodeId(data) {
      return data.id;
    },
    onRowSelected(event) {
      this.rowIsSelected = event.node.isSelected();
    },
  },

  computed: {
    ...mapState(["groups", "lastLoadedUser"]),
  },
  mounted() {
    this.getGroupsFromApi();
  },
  created() {
    this.editType = "fullRow";
    this.rowSelection = "multiple";
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
