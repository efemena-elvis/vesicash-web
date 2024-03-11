<template>
  <div class="wallet-metric-card rounded-12 teal-900-bg">
    <!-- TITLE TEXT -->
    <div
      class="wallet-title-text tertiary-2-text neutral-50 fw-semibold mgb-18"
    >
      Primary wallet balance
    </div>

    <!-- TOP ROW -->
    <div class="top-row row mgb-20">
      <!-- WALLET COLUMN -->
      <div
        class="col-12 col-md-4"
        v-for="(wallet, index) in wallet_balance"
        :key="index"
      >
        <WalletColumn
          :index="index"
          :wallet="wallet"
          :loading_wallet="loading_wallet"
        />
      </div>
    </div>

    <div class="bottom-row">
      <template v-if="$route.name === 'VesicashDashboard'">
        <button
          class="btn btn-secondary btn-md fund-btn"
          @click="toggleFundingFlow()"
        >
          <img :src="loadImage('wallet-icon.svg', 'dashboard')" alt="fund" />
          <div class="text">Fund Wallet</div>
        </button>

        <button class="btn btn-secondary btn-md tsf-btn" @click="sendMoney">
          <img :src="loadImage('cash-icon.svg', 'dashboard')" alt="transfer" />
          <div class="text">Send Money</div>
        </button>
      </template>

      <button
        v-else
        class="btn btn-secondary btn-md fund-btn"
        @click="$router.push({ name: 'VesicashEchangeSetup' })"
      >
        <img :src="loadImage('wallet-icon.svg', 'dashboard')" alt="exchange" />
        <div class="text">Exchange Money</div>
      </button>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_fund_wallet">
        <FundWalletModal @closeTriggered="toggleFundingFlow" />
      </transition>
    </portal>
  </div>
</template>

<script>
import WalletColumn from "@/modules/dashboard/components/card-comps/wallet-column";

export default {
  name: "PrimaryWalletCard",

  components: {
    WalletColumn,
    FundWalletModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/payments/modals/fund-wallet/fund-wallet-modal"
      ),
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

  data: () => ({
    show_fund_wallet: false,
  }),

  watch: {
    $route: {
      handler(value) {
        // INITIATE FUNDING BASED ON QUERY PARAMS
        if (value?.query?.fund_wallet) {
          this.toggleFundingFlow();

          setTimeout(() => {
            this.$router.replace({ name: this.$route.name });
          }, 1000);
        }
      },
      immediate: true,
    },
  },

  methods: {
    toggleFundingFlow() {
      this.show_fund_wallet = !this.show_fund_wallet;
    },

    sendMoney() {
      this.$router.push("/payments/send-money");
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet-metric-card {
  padding: toRem(18) toRem(20) toRem(20);
  width: 100%;

  .wallet-title-text {
    @include breakpoint-down(xs) {
      font-size: toRem(11.75);
    }
  }

  .bottom-row {
    @include flex-row-wrap("flex-start", "center");
    gap: toRem(16);

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
