<template>
  <div class="wallet-metric-card rounded-12 teal-900-bg">
    <!-- TITLE TEXT -->
    <div class="wallet-title-text tertiary-2-text neutral-50 fw-semibold">
      Primary wallet balance
    </div>

    <!-- TOP ROW -->
    <div class="top-row">
      <!-- WALLET COLUMN SECTION -->
      <PrimaryWalletColumn
        v-for="(wallet, index) in wallet_balance"
        :key="index"
        :index="index"
        :wallet="wallet"
        :loading_wallet="loading_wallet"
      />
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
import PrimaryWalletColumn from "@/modules/dashboard/components/card-comps/primary-wallet-column";

export default {
  name: "PrimaryWalletCard",

  components: {
    PrimaryWalletColumn,
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
    @include flex-row-wrap("flex-start", "center");
    padding: toRem(6) toRem(22) toRem(6);
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
