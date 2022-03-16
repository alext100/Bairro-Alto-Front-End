<template>
  <div class="container">
    <h4>Добавить студента</h4>
    <div class="button-container">
      <button v-if="rowIsSelected" v-on:click="handleAddUserToGroup(), $toast('Добавлено!')" class="btn btn-danger m-1">
        Добавить
      </button>
    </div>
    <div style="height: 100%; box-sizing: border-box">
      <ag-grid-vue
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        :pagination="true"
        paginationAutoPageSize="true"
        @grid-ready="onGridReady"
        :animateRows="true"
        :getRowId="getRowNodeId"
        :rowSelection="rowSelection"
        @row-selected="onRowSelected"
      >
        >
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { computed, defineComponent } from "vue";
import { mapActions, mapState, useStore } from "vuex";

export default defineComponent({
  name: "AddUser",
  components: {
    AgGridVue,
  },

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
          width: 30,
          minWidth: 25,
          maxWidth: 35,
          sortable: false,
          filter: false,
          editable: false,
        },
        {
          field: "firstName",
          headerName: "Имя",
          filter: true,
          editable: false,
          maxWidth: 350,
          minWidth: 100,
          resizable: true,
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
          maxWidth: 350,
          minWidth: 100,
          resizable: true,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
        {
          field: "email",
          headerName: "email",
          filter: true,
          editable: false,
          maxWidth: 350,
          minWidth: 100,
          resizable: true,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
      ],
      rowData: computed(() => store.state.allUsers),
      defaultColDef: {
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
    return { rowIsSelected: false };
  },

  computed: {
    ...mapState(["allUsers"]),
  },
  methods: {
    ...mapActions(["addMemberToGroup", "getAllUsersFromApi"]),

    async handleAddUserToGroup() {
      const api = this.gridApi;
      const selectedRows = api.getSelectedRows();

      if (!selectedRows || selectedRows.length === 0) {
        console.error("No rows selected!");
        return;
      }
      await selectedRows.forEach((row) => {
        const userId = row.id;
        const groupId = this.$route.params.id;
        this.addMemberToGroup({ groupId, userId });
      });
      api.applyTransaction({ update: selectedRows });
      api.deselectAll();
    },

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },

    getRowNodeId({ data }) {
      return data.id;
    },
    onRowSelected(event) {
      this.rowIsSelected = event.node.isSelected();
    },
  },

  created() {
    this.editType = "fullRow";
    this.rowSelection = "multiple";
  },
  mounted() {
    this.getAllUsersFromApi();
  },
});
</script>

<style scoped>
@import "~ag-grid-community/dist/styles/ag-grid.css";
@import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
.items-list {
  list-style: none;
}
.list-group-item-success {
  background-color: var(--bairro-alto-logo-color);
}
.ag-theme-alpine {
  width: 100%;
  height: 800px;
  justify-content: center;
}
.button-container {
  min-height: 60px;
}
</style>
