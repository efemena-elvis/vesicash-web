<template>
  <div class="mor-dashboard">
    <template>
      <div class="wrapper">
        <!-- <div class="title-text h5-text grey-900 mgb-8">Your Metrics</div> -->

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

          <MetricCard
            metric_title="MoR Transaction volume"
            metric_theme="teal"
            :metric_data="getTransactionVolume"
            :is_currency_type="false"
            :is_loading="loading"
          />
        </div>

        <!-- <div class="cards-area">
          <MetricCard
            metric_title="MoR Collected Tax metrics"
            metric_theme="yellow"
          />

          <MetricCard
            metric_title="MoR Remitted Tax metrics"
            metric_theme="yellow"
          />
        </div> -->
      </div>
    </template>

    <template>
      <div class="wrapper mgy-40">
        <div class="title-text h5-text grey-900 mgb-8">Recent transactions</div>

        <PageSwitcher
          :page_data="pages"
          :full_width="false"
          @swapItem="updateTransactionChanges($event)"
        />

        <template>
          <div class="table-title primary-1-text grey-900 mgb-16">
            <!-- {{ getTableTitle }} -->
          </div>
          <component :is="active_transaction_view" />
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

  computed: {
    getTableTitle() {
      return this.active_transaction_view === "MoRTransactionTable"
        ? "MoR Transactions"
        : "Escrow Transactions";
    },
  },

  data() {
    return {
      active_transaction_view: "DashboardTransactions",

      pages: [
        {
          title: "Payments",
          value: "DashboardTransactions",
          active: true,
        },
        {
          title: "Merchant of Records",
          value: "MoRTransactionTable",
          active: false,
        },
        {
          title: "Escrow",
          value: "TransactionTable",
          active: false,
        },
      ],
    };
  },

  methods: {
    updateTransactionChanges(selected_value) {
      this.active_transaction_view = selected_value;
      this.pages.find((page) => page.value === selected_value).active = true;
    },
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
