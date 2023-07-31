<template>
  <div class="document-table">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="mor-document-tb"
      :table_data="getTableDataSet"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="getEmptyMessage"
    >
      <template v-for="(data, index) in getTableDataSet">
        <MoRDocumentTableRow
          :key="index"
          table_name="mor-document-tb"
          :data="data"
          :index="index"
        />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import TableContainer from "@/shared/components/table-comps/table-container";

export default {
  name: "MoRDocument",

  components: {
    TableContainer,
    MoRDocumentTableRow: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/config/components/mor-document-table-row"
      ),
  },

  props: {
    dataset: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    getEmptyMessage() {
      return "No MoR countries has been selected at the moment.";
    },

    getTableDataSet() {
      return this.dataset;
    },
  },

  data() {
    return {
      table_header: ["#", "Country", "Status", "Actions"],
      table_loading: false,
    };
  },

  methods: {},
};
</script>

<style lang="scss">
.mor-document-tb {
  &-1 {
    min-width: toRem(50);
  }

  &-2 {
    min-width: toRem(150);
  }

  &-3 {
    min-width: toRem(150);
  }

  &-4 {
    min-width: toRem(150);
  }
}
</style>
