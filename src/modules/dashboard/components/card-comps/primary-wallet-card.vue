<template>
  <div class="wallet-metric-card rounded-12 teal-900-bg">
    <!-- TITLE TEXT -->
    <div class="wallet-title-text tertiary-2-text neutral-50 fw-semibold">
      Primary wallet balance
    </div>

    <!-- TOP ROW -->
    <div class="top-row">
      <!-- WALLET COLUMN SECTION -->
      <template v-for="(wallet, index) in wallet_balance">
        <PrimaryWalletColumn :key="index" :index="index" :wallet="wallet" :loading_wallet="loading_wallet" />
      </template>
    </div>
  </div>
</template>

<script>
import PrimaryWalletColumn from "@/modules/dashboard/components/card-comps/primary-wallet-column";

export default {
  name: "PrimaryWalletCard",

  components: {
    PrimaryWalletColumn,
  },

  props: {
    wallet_balance: {
      type: Array,
      default: () => [],
    },

    card_type: {
      type: String,
      default: "escrow",
    },

    loading_wallet: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet-metric-card {
  padding: toRem(16) 0 toRem(12);
  width: max-content;

  @include breakpoint-custom-down(530) {
    width: 100%;
  }

  .wallet-title-text {
    padding: toRem(2) toRem(24) toRem(8);

    @include breakpoint-down(xs) {
      font-size: toRem(11.75);
    }
  }

  .top-row {
    @include flex-row-wrap("flex-start", "center")
  }
}
</style>
