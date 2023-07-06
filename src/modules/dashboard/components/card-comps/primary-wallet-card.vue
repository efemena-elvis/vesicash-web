<template>
  <div
    class="wallet-metric-card rounded-12 teal-900-bg"
    :class="ongoingTour ? 'tour-index' : null"
  >
    <!-- TOP ROW -->
    <div class="top-row mgb-16">
      <!-- WALLET COLUMN SECTION -->
      <template v-for="(wallet, index) in wallet_balance">
        <!-- :class="!wallet.enabled && 'disable-wallet'" -->
        <div class="column" :key="index">
          <!-- TITLE TEXT -->
          <div class="title-text tertiary-3-text teal-100 mgb-10">
            <template>
              {{ wallet?.short ?? "----" }}
            </template>
          </div>

          <!-- LOADING AMOUNT VALUE -->
          <template v-if="loading_wallet">
            <div
              class="loading-amount-value rounded-3 skeleton-loader mgb-5"
            ></div>
          </template>

          <template v-else>
            <!-- AMOUNT VALUE -->
            <div
              class="amount-value secondary-1-text mgb-4"
              :class="[
                index === 0 && 'neutral-10',
                index === 1 && 'green-400',
                index === 2 && 'teal-500',
                index === 3 && 'yellow-300',
                index === 4 && 'red-300',
                index === 5 && 'teal-300',
                index === 6 && 'green-300',
              ]"
            >
              <span>
                {{ wallet.sign
                }}{{
                  $utils.formatCurrencyWithComma(
                    wallet.balance?.split(".")[0] ?? wallet.balance
                  )
                }}</span
              ><span class="amount-zero"
                >.{{ wallet.balance?.split(".")[1] ?? "00" }}</span
              >
            </div>
          </template>

          <!-- TITLE DESCRIPTION -->
          <div class="title-description secondary-3-text neutral-10 mgt-5">
            {{ wallet?.description ?? "-----------" }}
          </div>
        </div>
      </template>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row">
      <template v-if="card_type === 'escrow'">
        <button class="btn btn-tertiary btn-md" @click="toggleFundingFlow">
          <div class="icon-plus mgr-6 teal-700 f-size-17"></div>
          Fund Wallet
        </button>

        <button class="btn btn-tertiary btn-md" @click="toggleTransferFlow">
          <div class="mgr-8 position-relative" style="top: -1px">
            <MoneyIcon />
          </div>
          Transfer fund
        </button>
      </template>

      <template v-if="card_type === 'exchange'">
        <router-link class="btn btn-tertiary btn-md" to="/exchange/setup">
          <div class="mgr-8 position-relative" style="top: -1px">
            <ExchangeIcon small />
          </div>
          Exchange money
        </router-link>
      </template>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_funding_flow">
        <FundingFlowDialog @closeTriggered="toggleFundingFlow" />
      </transition>

      <transition name="fade" v-if="show_transfer_flow">
        <TransferFlowDialog
          @closeTriggered="toggleTransferFlow"
          @verifyTransferOTP="toggleOTPModal"
        />
      </transition>

      <transition name="fade" v-if="show_otp_modal">
        <WithdrawalOtpModal
          @closeTriggered="toggleOTPModal"
          @done="toggleSuccessModal"
        />
      </transition>

      <transition name="fade" v-if="show_success_modal">
        <SuccessModal
          :message="`Your withdrawal of ${withdrawn_amount} has been sent to your bank account, Please check your bank account for details`"
          main_cta_title="Done"
          @done="show_success_modal = false"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MoneyIcon from "@/shared/components/icon-comps/money-icon";
import ExchangeIcon from "@/shared/components/icon-comps/exchange-icon";

export default {
  name: "PrimaryWalletCard",

  components: {
    ExchangeIcon,
    MoneyIcon,
    FundingFlowDialog: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/fund-wallet-modals/funding-flow-dialog"
      ),
    TransferFlowDialog: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/withdraw-modals/transfer-flow-dialog"
      ),

    WithdrawalOtpModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/transactions/modals/withdrawal-otp-modal"
      ),
    SuccessModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/shared/modals/success-modal"
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

  computed: {
    ...mapGetters({ getTourData: "general/getTourData" }),

    ongoingTour() {
      const { count, ongoing } = this.getTourData;

      if (ongoing) return [1, 2, 3].includes(count) ? true : false;
      else return false;
    },
  },

  data: () => ({
    show_funding_flow: false,
    show_transfer_flow: false,

    show_otp_modal: false,
    show_success_modal: false,

    withdrawn_amount: "",
    selected_withdraw_account: "",
  }),

  watch: {
    $route: {
      handler(value) {
        // INITIATE FUNDING OR WITHDRAWAL BASED ON QUERY PARAMS
        if (value?.query?.fund_wallet) {
          this.show_fund_wallet_select_modal = true;
          this.$router.replace({ name: this.$route.name });
        } else if (value?.query?.withdraw_money) {
          this.show_wallet_modal = true;
          this.$router.replace({ name: this.$route.name });
        }
      },
      immediate: true,
    },
  },

  methods: {
    toggleFundingFlow() {
      this.show_funding_flow = !this.show_funding_flow;
    },

    toggleTransferFlow() {
      this.show_transfer_flow = !this.show_transfer_flow;
    },

    toggleOTPModal() {
      this.show_otp_modal = !this.show_otp_modal;
    },

    toggleSuccessModal({ amount, currency }) {
      this.$router.push({
        name: "SuccessfulWithdrawal",
        query: { amount, currency },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet-metric-card {
  width: max-content;

  @include breakpoint-custom-down(530) {
    width: 100%;
  }

  .top-row {
    @include flex-row-wrap("flex-start", "center");

    .column {
      position: relative;
      padding: toRem(24) toRem(24) toRem(12);
      min-width: toRem(170);
      width: auto;
      max-width: toRem(240);

      &::after {
        content: "";
        width: toRem(1);
        background: getColor("teal-800");
        height: 66%;
        @include center-placement("y-axis");
        right: 0;
      }

      &:last-of-type {
        &::after {
          width: 0;
        }
      }

      @include breakpoint-custom-down(530) {
        width: 100%;
        max-width: unset;

        &::after {
          width: 92%;
          height: toRem(1);
          right: unset;
          bottom: 0;
          left: 50%;
          top: 105%;
          transform: translateX(-50%) !important;
        }
      }

      .title-text {
        @include breakpoint-down(xs) {
          font-size: toRem(12);
        }
      }

      .amount-value {
        font-size: toRem(22);

        @include breakpoint-down(lg) {
          @include generate-font-type("primary-1");
          font-size: toRem(18.5);
        }

        @include breakpoint-custom-down(700) {
          font-size: toRem(18);
        }

        .amount-zero {
          font-size: toRem(18);

          @include breakpoint-custom-down(700) {
            font-size: toRem(14.5);
          }
        }
      }

      .loading-sign-value {
        @include draw-shape(50, 10);
      }

      .loading-amount-value {
        @include draw-shape(120, 32);
      }
    }

    .disable-wallet {
      opacity: 0.55;
    }
  }

  .bottom-row {
    padding: toRem(0) toRem(24) toRem(16);
    @include flex-row-wrap("flex-start", "center");
    gap: toRem(24);

    @include breakpoint-down(md) {
      gap: toRem(20);
    }

    @include breakpoint-custom-down(530) {
      padding: toRem(20);
    }

    .btn {
      border: toRem(1) solid getColor("teal-100") !important;
      padding: toRem(8) toRem(16);
      color: getColor("teal-700") !important;
      background: getColor("teal-100") !important;

      @include breakpoint-custom-down(530) {
        width: 100%;
      }

      svg {
        @include draw-shape(17);
      }

      @include breakpoint-down(lg) {
        @include get-btn-size("sm");
      }
    }
  }
}

.tour-index {
  @include transition(0.7s);
  z-index: 1099;
}
</style>
