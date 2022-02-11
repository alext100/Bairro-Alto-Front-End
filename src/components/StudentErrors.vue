<template>
  <div style="height: 100%">
    <div class="button-container">
      <button v-if="rowIsSelected" v-on:click="onBtDelete()" class="btn btn-danger m-1">Удалить</button>
    </div>
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
</template>

<script>
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { computed, defineComponent } from "vue";
import { mapActions, mapState, useStore } from "vuex";

function dateFormatter(params) {
  return new Date(params.value).toLocaleString();
}

export default defineComponent({
  name: "StudentErrors",
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
          width: 25,
          minWidth: 20,
          maxWidth: 30,
          sortable: false,
          filter: false,
          editable: false,
        },
        {
          field: "errorType",
          headerName: "Тип ошибки",
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: ["Новое слово", "Ошибка", "Произношение", "Другое"],
          },
          filter: false,
          editable: true,
          maxWidth: 150,
          minWidth: 100,
          resizable: false,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
        { field: "errorMessage", headerName: "Заметка", editable: true, autoHeight: true, wrapText: true },
        { field: "errorComment", headerName: "Правильный вариант", editable: true, autoHeight: true, wrapText: true },
        {
          field: "date",
          headerName: "Дата",
          editable: false,
          filter: false,
          minWidth: 50,
          maxWidth: 150,
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
    ...mapState(["groupErrors"]),
  },
  mounted() {
    this.getGroupErrorsById(this.$route.params.id);
  },
  created() {
    this.editType = "fullRow";
    this.rowSelection = "multiple";
  },

  methods: {
    ...mapActions(["getGroupErrorsById", "updateGroupErrorsById", "deleteGroupError"]),
    async onCellValueChanged(event) {
      await this.updateGroupErrorsById(event.data);
      await this.getGroupErrorsById(this.$route.params.id);
    },

    async onBtDelete() {
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
    },

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
