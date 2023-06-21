<template>
  <div class="mor-dashboard">
    <template>
      <div class="wrapper">
        <div class="title-text h5-text grey-900 mgb-8">Your Metrics</div>

        <MetricCard metric_title="MoR Revenue metrics" metric_theme="teal" />

        <MetricCard metric_title="MoR Transaction volume" metric_theme="teal" />

        <!-- <MetricCard
          metric_title="MoR Collected Tax metrics"
          metric_theme="yellow"
        />

        <MetricCard
          metric_title="MoR Remitted Tax metrics"
          metric_theme="yellow"
        /> -->
      </div>
    </template>

    <template>
      <div class="wrapper mgy-40">
        <div class="title-text h5-text grey-900 mgb-8">Transactions</div>

        <PageSwitcher
          :page_data="pages"
          :full_width="false"
          @swapItem="updateTransactionChanges($event)"
        />

        <template>
          <div class="table-title primary-1-text grey-900 mgb-16">
            {{ getTableTitle }}
          </div>

          <keep-alive>
            <component :is="active_transaction_view" />
          </keep-alive>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import MetricCard from "@/modules/merchant-of-records/modules/dashboard/components/metric-card";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";

export default {
  name: "MoRDashboard",

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
      active_transaction_view: "MoRTransactionTable",

      pages: [
        {
          title: "Merchant of Records",
          value: "merchant",
          active: true,
        },
        {
          title: "Escrow",
          value: "escrow",
          active: false,
        },
      ],
    };
  },

  methods: {
    updateTransactionChanges(selected_value) {
      this.active_transaction_view =
        selected_value === "merchant"
          ? "MoRTransactionTable"
          : "TransactionTable";

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
</style>
