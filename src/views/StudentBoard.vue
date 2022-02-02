<template>
  <div v-if="!isLoading" style="height: 100%">
    <div class="button-container"></div>
    <div style="height: 100%; box-sizing: border-box">
      <ag-grid-vue
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        :pagination="true"
        paginationAutoPageSize="true"
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

function dateFormatter(params) {
  return new Date(params.value).toLocaleDateString();
}

export default defineComponent({
  name: "StudentBoard",
  components: {
    AgGridVue,
  },

  setup() {
    const store = useStore();

    return {
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
        { field: "errorMessage", headerName: "Замечание", flex: 1, editable: true, autoHeight: true, wrapText: true },
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
    return {};
  },
  computed: {
    ...mapState(["groupErrors", "isLoading"]),
  },
  async mounted() {
    await this.getGroupsFromApi();
    this.getGroupErrorsById(this.getCurrentStudentGroup());
  },

  methods: {
    ...mapActions(["getGroupsFromApi", "getGroupErrorsById"]),

    getCurrentStudentGroup() {
      const studentGroup = state.groups.find((group) => {
        if (group.members.find((member) => member === this.$route.params.id)) {
          return group.id;
        }
        return group.id;
      });
      return studentGroup.id;
    },
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
