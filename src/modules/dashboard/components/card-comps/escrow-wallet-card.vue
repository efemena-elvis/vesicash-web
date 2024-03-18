<template>
  <div
    class="escrow-metric-card position-relative rounded-12 border-green-200 green-50-bg"
  >
    <!-- TITLE TEXT -->
    <div class="wallet-title-text tertiary-2-text grey-700 fw-semibold mgb-22">
      Escrow wallet balance
    </div>

    <!-- TOP ROW -->
    <div class="top-row row g-0 mgb-20">
      <!-- WALLET COLUMN -->
      <div
        class="col-12 col-md-4"
        v-for="(wallet, index) in escrow_balance"
        :key="index"
      >
        <WalletColumn
          :index="index"
          :item_length="escrow_balance.length - 1"
          :wallet="wallet"
          :loading_wallet="loading_wallet"
          is_escrow_type
          border_color="green-300"
        />
      </div>
    </div>

    <div class="bottom-row">
      <button
        class="btn btn-primary btn-md pdy-10"
        @click="$router.push('/transactions/setup')"
      >
        <div class="text">Create Escrow</div>
      </button>
    </div>
  </div>
</template>

<script>
import WalletColumn from "@/modules/dashboard/components/card-comps/wallet-column";

export default {
  name: "EscrowMetricCard",

  components: {
    WalletColumn,
  },

  props: {
    escrow_balance: {
      type: Array,
      default: () => [],
    },

    loading_wallet: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    isBalanceHidden() {
      return this.is_hidden;
    },
  },

  data() {
    return {
      is_hidden: true,
    };
  },

  methods: {
    toggleWalletBalance() {
      this.is_hidden = !this.is_hidden;
    },
  },
};
</script>

<style lang="scss" scoped>
.escrow-metric-card {
  .wallet-title-text {
    padding: toRem(18) toRem(20) 0;

    @include breakpoint-down(xs) {
      font-size: toRem(11.75);
    }
  }

  .bottom-row {
    padding: 0 toRem(20) toRem(20);
  }
}
</style>
