<template>
  <div class="mor-wallet-block">
    <div class="metric-card-section">
      <MetricCard
        metric_title="MoR Revenue metrics"
        metric_theme="teal"
        :metric_data="getTransactionRevenue"
        :is_loading="loading"
      />
    </div>
  </div>
</template>

<script>
import MoRSummary from "@/modules/merchant-of-records/modules/dashboard/mixins/mor-summary";
import WalletMixin from "@/modules/dashboard/mixins/wallet-mixin";
import MetricCard from "@/modules/merchant-of-records/modules/dashboard/components/metric-card";

export default {
  name: "MoRWalletBlock",

  mixins: [WalletMixin, MoRSummary],

  components: {
    MetricCard,
  },
};
</script>

<style lang="scss" scoped>
.mor-wallet-block {
  .metric-card-section {
    @include flex-row-wrap("flex-start", "stretch");
    gap: toRem(20);
  }
}
</style>
