<template>
  <div class="transaction">
    <!-- TITLE TOP BLOCK -->
    <TitleTopBlock title="Tax Records" />

    <div class="metric-card-section mgb-40">
      <MetricCard
        metric_title="Processed Tax Summary"
        metric_theme="teal"
        :metric_data="getTransactionRevenue"
        :is_loading="loading"
        is_tax_type
      />
    </div>

    <template>
      <div class="wrapper mgy-40">
        <!-- <div class="title-text h5-text grey-900 mgb-8">MoR Transactions</div> -->

        <template>
          <MoRTaxTable />
        </template>
      </div>
    </template>
  </div>
</template>
  
  <script>
import MoRSummary from "@/modules/merchant-of-records/modules/dashboard/mixins/mor-summary";
import MetricCard from "@/modules/merchant-of-records/modules/dashboard/components/metric-card";
import TitleTopBlock from "@/shared/components/block-comps/title-top-block";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";

export default {
  name: "MoRTransaction",

  mixins: [MoRSummary],

  components: {
    TitleTopBlock,
    MetricCard,
    PageSwitcher,
    MoRTaxTable: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/transactions/components/mor-tax-table"
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
          title: "Payout",
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
  .metric-card-section {
    @include flex-row-wrap("flex-start", "stretch");
    gap: toRem(20);
  }
}
</style>
  