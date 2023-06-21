<template>
  <div class="transaction">
    <!-- TITLE TOP BLOCK -->
    <TitleTopBlock title="MoR Transactions" />

    <MetricCard
      metric_title="Processed transaction summary"
      metric_theme="teal"
    />

    <PageSwitcher
      :page_data="pages"
      :full_width="false"
      @swapItem="updateTransactionChanges($event)"
    />

    <template>
      <MoRTransactionTable />
    </template>
  </div>
</template>

<script>
import MetricCard from "@/modules/merchant-of-records/modules/dashboard/components/metric-card";
import TitleTopBlock from "@/shared/components/block-comps/title-top-block";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";

export default {
  name: "MoRTransaction",

  components: {
    TitleTopBlock,
    MetricCard,
    PageSwitcher,
    MoRTransactionTable: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/transactions/components/mor-transaction-table"
      ),
  },

  data() {
    return {
      pages: [
        {
          title: "Inflow",
          value: "inflow",
          active: true,
        },
        {
          title: "Outflow",
          value: "outflow",
          active: false,
        },
      ],
    };
  },

  methods: {
    // MANUALLY UPDATE TRANSACTION CHANGES
    updateTransactionChanges(selected_value) {
      this.filters.transaction = selected_value;

      this.$router
        .replace({
          name: this.$route.name,
          query: { ...this.$route.query, transaction: selected_value },
        })
        .catch((error) => {
          if (error.name != "NavigationDuplicated") throw error;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.transaction {
}
</style>
