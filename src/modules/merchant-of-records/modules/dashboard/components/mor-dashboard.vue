
<!-- !! component is depreceated -->
<template>
  <div class="mor-dashboard">
    <template>
      <div class="wrapper">
        <div
          class="metric-card-section"
          v-if="$route.name === 'MerchantTransaction'"
        >
          <MetricCard
            metric_title="MoR Revenue metrics"
            metric_theme="teal"
            :metric_data="getTransactionRevenue"
            :is_loading="loading"
          />
        </div>
      </div>
    </template>

    <template>
      <div class="wrapper mgy-40">
        <div class="title-text h5-text grey-900 mgb-8">Recent transactions</div>

        <template>
          <DashboardTransactions />
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import MoRSummary from "@/modules/merchant-of-records/modules/dashboard/mixins/mor-summary";
import MetricCard from "@/modules/merchant-of-records/modules/dashboard/components/metric-card";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";

export default {
  name: "MoRDashboard",

  mixins: [MoRSummary],

  components: {
    MetricCard,
    PageSwitcher,
    TransactionTable: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/table-comps/transaction-table"
      ),
    MoRTransactionTable: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/transactions/components/mor-transaction-table"
      ),
    DashboardTransactions: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/dashboard-transactions"
      ),
  },

  data() {
    return {
      active_transaction_view: "DashboardTransactions",
    };
  },
};
</script>

<style lang="scss" scoped>
.mor-dashbaord {
  .title-text {
    font-size: toRem(18);
  }
}

.metric-card-section {
  @include flex-row-wrap("flex-start", "stretch");
  gap: toRem(20);
}
</style>
