<template>
  <div class="transaction">
    <!-- TITLE TOP BLOCK -->
    <TitleTopBlock title="MoR Summary" />

    <div
      class="metric-card-section mgb-48"
      v-if="$route.name === 'MerchantTransaction'"
    >
      <MetricCard
        metric_title="MoR Revenue metrics"
        metric_theme="teal"
        :metric_data="getTransactionRevenue"
        :is_loading="loading"
      />

      <!-- <MetricCard
        v-if="false"
        metric_title="MoR Transaction volume"
        metric_theme="teal"
        :metric_data="getTransactionVolume"
        :is_currency_type="false"
        :is_loading="loading"
      /> -->
    </div>

    <template>
      <div class="wrapper mgy-40">
        <div class="title-text h5-text grey-900 mgb-20">MoR Transactions</div>

        <template>
          <MoRTransactionTable />
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import MoRSummary from "@/modules/merchant-of-records/modules/dashboard/mixins/mor-summary";
import MetricCard from "@/modules/merchant-of-records/modules/dashboard/components/metric-card";
import TitleTopBlock from "@/shared/components/block-comps/title-top-block";

export default {
  name: "MoRTransaction",

  mixins: [MoRSummary],

  components: {
    TitleTopBlock,
    MetricCard,
    MoRTransactionTable: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/transactions/components/mor-transaction-table"
      ),
  },

  data() {
    return {};
  },

  methods: {},
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
