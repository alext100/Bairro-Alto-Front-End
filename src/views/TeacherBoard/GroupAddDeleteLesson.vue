<template>
  <div class="container">
    <h4>Добавить или удалить урок из этой группы</h4>
    <div class="button-container">
      <button
        v-if="rowIsSelected"
        v-on:click="handleAddLessonToGroup(), $toast('Добавлено!')"
        class="btn btn-danger m-1"
      >
        Сохранить
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
        :getRowNodeId="getRowNodeId"
        :rowSelection="rowSelection"
        @row-selected="onRowSelected"
        :enableCellChangeFlash="true"
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
  name: "GroupLesson",
  components: {
    AgGridVue,
  },

  setup() {
    const store = useStore();

    const nameFormatter = (params) => {
      if (params.data.author[0] === store.state.currentUser.id) {
        return store.state.currentUser.firstName;
      }
      return "";
    };

    const addLessonToCurrentGroup = (params) => {
      const lessonId = params.data.id;
      const currentGroupLessons = store.state.currentGroup.lessons;
      return currentGroupLessons && !currentGroupLessons.includes(lessonId);
    };

    const deleteLessonFromCurrentGroup = (params) => {
      const lessonId = params.data.id;
      const currentGroupLessons = store.state.currentGroup.lessons;
      return currentGroupLessons && currentGroupLessons.includes(lessonId);
    };

    function dateFormatter(params) {
      return new Date(params.value).toLocaleString();
    }

    return {
      editType: "",
      rowSelection: null,
      gridApi: null,
      columnApi: null,
      columnDefs: [
        {
          field: "",
          headerName: "Добавить",
          checkboxSelection: addLessonToCurrentGroup,
          headerCheckboxSelection: false,
          width: 90,
          minWidth: 45,
          maxWidth: 99,
          sortable: false,
          filter: false,
          editable: false,
        },
        {
          field: "title",
          headerName: "Название урока",
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
          field: "author",
          headerName: "Автор",
          filter: true,
          editable: false,
          maxWidth: 350,
          minWidth: 100,
          resizable: true,
          valueFormatter: nameFormatter,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
        {
          field: "level",
          headerName: "Уровень",
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
          field: "date",
          headerName: "Дата создания",
          filter: true,
          editable: false,
          maxWidth: 350,
          minWidth: 100,
          resizable: true,
          valueFormatter: dateFormatter,
          icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
          },
        },
        {
          field: "",
          headerName: "Удалить",
          checkboxSelection: deleteLessonFromCurrentGroup,
          headerCheckboxSelection: false,
          width: 75,
          minWidth: 65,
          maxWidth: 90,
          sortable: false,
          filter: false,
          editable: false,
        },
      ],
      rowData: computed(() => store.state.lessons),
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
    ...mapState(["lessons", "currentGroup"]),
  },
  methods: {
    ...mapActions(["toggleLessonInGroup", "getLessonsFromApi", "getGroupById"]),

    async handleAddLessonToGroup() {
      const api = this.gridApi;
      const selectedRows = api.getSelectedRows();

      if (!selectedRows || selectedRows.length === 0) {
        console.error("No rows selected!");
        return;
      }
      await selectedRows.forEach((row) => {
        const lessonId = row.id;
        const groupId = this.$route.params.id;
        this.toggleLessonInGroup({ groupId, lessonId });
      });
      api.applyTransaction({ update: selectedRows });
      api.deselectAll();
      setTimeout(() => {
        this.gridApi.redrawRows();
      }, 500);
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

  created() {
    this.editType = "fullRow";
    this.rowSelection = "multiple";
  },
  mounted() {
    this.getLessonsFromApi();
    this.getGroupById(this.$route.params.id);
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
