<template>
  <div
    class="escrow-metric-card position-relative rounded-12 border-green-200 green-50-bg"
  >
    <!-- TITLE TEXT -->
    <div class="wallet-title-text tertiary-2-text grey-700 fw-semibold">
      Escrow wallet balance
    </div>

    <!-- TOP ROW -->
    <div class="top-row">
      <!-- WALLET COLUMN SECTION -->
      <PrimaryWalletColumn
        v-for="(wallet, index) in escrow_balance"
        :key="index"
        :index="index"
        :wallet="wallet"
        :loading_wallet="loading_wallet"
        is_escrow_type
      />
    </div>

    <div class="bottom-row">
      <button
        class="btn btn-tertiary btn-md"
        @click="$router.push('/transactions/setup')"
      >
        <img :src="loadImage('central-icon.svg', 'dashboard')" alt="escrow" />
        <div class="text">Create Escrow</div>
      </button>
    </div>
  </div>
</template>

<script>
import PrimaryWalletColumn from "@/modules/dashboard/components/card-comps/primary-wallet-column";

export default {
  name: "EscrowMetricCard",

  components: {
    PrimaryWalletColumn,
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
    @include flex-row-wrap("flex-start", "center");
  }

  .bottom-row {
    padding: toRem(6) toRem(22) toRem(6);

    button {
      img {
        position: relative;
        margin-left: toRem(-4);
        @include draw-shape(24);
      }

      .text {
        margin-left: toRem(8);
      }

      &.fund-btn {
        img {
          top: toRem(-1.5);
        }
      }
    }
  }
}
</style>
