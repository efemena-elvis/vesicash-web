<template>
  <div
    class="naira-dollar-metric-card rounded-12 teal-900-bg"
    :class="ongoingTour ? 'tour-index' : null"
  >
    <!-- TOP ROW -->
    <div class="top-row mgb-16">
      <!-- WALLET COLUMN SECTION -->
      <template v-for="(wallet, index) in wallet_balance">
        <div class="column" :key="index">
          <!-- TITLE TEXT -->
          <div class="title-text tertiary-3-text teal-100 mgb-10">
            {{ wallet.title }}
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
                wallet.sign === 'naira' && 'text-white',
                wallet.sign === 'dollar' && 'green-400',
                wallet.sign === 'pound' && 'teal-500',
              ]"
            >
              <span>
                {{ $money.getSign(wallet.sign)
                }}{{ $money.addComma(wallet.value.split(".")[0]) }}</span
              ><span class="amount-zero"
                >.{{ wallet.value.split(".")[1] || "00" }}</span
              >
            </div>
          </template>

          <!-- TITLE DESCRIPTION -->
          <div class="title-description secondary-3-text text-white mgt-5">
            Wallet balance
          </div>
        </div>
      </template>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row" v-if="show_actions">
      <button
        class="btn btn-tertiary btn-md"
        @click="toggleFundWalletSelectModal"
      >
        <div class="icon-plus mgr-6 teal-700 f-size-17"></div>
        Fund Wallet
      </button>

      <button class="btn btn-tertiary btn-md" @click="toggleWalletModal">
        <div class="mgr-8 position-relative" style="top: -1px">
          <MoneyIcon />
        </div>
        Transfer fund
      </button>

      <router-link class="btn btn-tertiary btn-md" to="/exchange/setup">
        <div class="mgr-8 position-relative" style="top: -1px">
          <ExchangeIcon small />
        </div>
        Exchange money
      </router-link>
      <!-- closeWalletOpenAccount will be replaced with toggleWalletModal when dollar withdrawal is ready -->
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_fund_wallet_select_modal">
        <FundWalletSelectModal
          @closeTriggered="toggleFundWalletSelectModal"
          @fundingOptionSelected="closeWalletOpenWalletDetails"
        />
      </transition>

      <transition name="fade" v-if="show_fund_wallet_info_modal">
        <FundWalletEntryModal
          :payment_type="selected_payment_option"
          @closeTriggered="toggleFundWalletDetailsModal"
          @goBackWalletSelection="closeWalletDetailsOpenWalletSelect"
          @walletFunded="closeFundDetailsAndOpenSuccess"
        />
      </transition>

      <transition name="fade" v-if="show_wallet_modal">
        <WithdrawSelectModal
          @accountTypeSelected="closeWalletOpenAccount"
          @closeTriggered="toggleWalletModal"
        />
      </transition>

      <transition name="fade" v-if="show_wallet_account_modal">
        <WithdrawAccountModal
          :account_type="selected_withdraw_account"
          @closeTriggered="toggleWalletAccountModal"
          @goBackWalletSelection="closeAccountOpenWallet"
          @accountSelected="closeAccountOpenConfirm"
        />
      </transition>

      <transition name="fade" v-if="show_wallet_confirm_modal">
        <WithdrawConfirmModal
          @closeTriggered="toggleWalletConfirmModal"
          @goBackAccountSelection="closeConfimWithdrawOpenAccount"
          @openOTPDialog="toggleOTPModal"
        />
      </transition>

      <transition name="fade" v-if="show_otp_modal">
        <WithdrawalOtpModal @done="toggleSuccessModal" />
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
  name: "NairaDollarMetricCard",

  components: {
    ExchangeIcon,
    MoneyIcon,
    FundWalletSelectModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/fund-wallet-modals/fund-wallet-select-modal"
      ),

    FundWalletEntryModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/fund-wallet-modals/fund-wallet-entry-modal"
      ),

    WithdrawSelectModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/withdraw-modals/withdraw-select-modal"
      ),

    WithdrawAccountModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/withdraw-modals/withdraw-account-modal"
      ),

    WithdrawConfirmModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/withdraw-modals/withdraw-confirm-modal"
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

    show_actions: {
      type: Boolean,
      default: true,
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
    show_wallet_modal: false,
    show_wallet_account_modal: false,
    show_wallet_confirm_modal: false,

    show_fund_wallet_select_modal: false,
    show_fund_wallet_info_modal: false,

    show_otp_modal: false,
    show_success_modal: false,

    selected_payment_option: "card",
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
    toggleOTPModal() {
      this.show_otp_modal = !this.show_otp_modal;
      this.show_wallet_confirm_modal = false;
    },

    toggleSuccessModal(amount) {
      this.withdrawn_amount = amount;
      this.show_success_modal = true;
      this.show_otp_modal = false;
    },

    toggleWalletModal() {
      this.show_wallet_modal = !this.show_wallet_modal;
    },

    toggleWalletAccountModal() {
      this.show_wallet_account_modal = !this.show_wallet_account_modal;
    },

    toggleWalletConfirmModal() {
      this.show_wallet_confirm_modal = !this.show_wallet_confirm_modal;
    },

    toggleFundWalletSelectModal() {
      this.show_fund_wallet_select_modal = !this.show_fund_wallet_select_modal;
    },

    toggleFundWalletDetailsModal() {
      this.show_fund_wallet_info_modal = !this.show_fund_wallet_info_modal;
    },

    closeWalletOpenWalletDetails($event) {
      this.selected_payment_option = $event;
      this.show_fund_wallet_select_modal = false;
      this.toggleFundWalletDetailsModal();
    },

    closeWalletDetailsOpenWalletSelect() {
      this.show_fund_wallet_info_modal = false;
      this.toggleFundWalletSelectModal();
    },

    closeFundDetailsAndOpenSuccess() {
      this.show_fund_wallet_info_modal = false;
      this.$router.push({
        name: "SuccessfulWalletFund",
        query: { currency: "NGN" },
      });
    },

    closeWalletOpenAccount($event) {
      this.show_wallet_modal = false;
      this.selected_withdraw_account = $event;
      this.toggleWalletAccountModal();
    },

    closeAccountOpenWallet() {
      this.show_wallet_account_modal = false;
      // this will be un-commented when dollar withdrawal works
      this.toggleWalletModal();
    },

    closeConfimWithdrawOpenAccount() {
      this.show_wallet_confirm_modal = false;
      this.toggleWalletAccountModal();
    },

    closeAccountOpenConfirm() {
      this.show_wallet_account_modal = false;
      this.toggleWalletConfirmModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.naira-dollar-metric-card {
  padding: toRem(24) toRem(24) toRem(16);
  width: toRem(595);

  @include breakpoint-custom-down(530) {
    padding: toRem(20);
    width: 100%;
  }

  .top-row {
    @include flex-row-start-nowrap;

    @include breakpoint-custom-down(530) {
      @include flex-row-start-wrap;
    }

    .column {
      width: 33.3%;

      @include breakpoint-custom-down(530) {
        width: 100%;
      }

      .title-text {
        @include breakpoint-down(xs) {
          font-size: toRem(11.75);
        }
      }

      .amount-value {
        font-size: toRem(23.5);

        @include breakpoint-down(lg) {
          @include generate-font-type("primary-1");
          font-size: toRem(18.5);
        }

        @include breakpoint-custom-down(700) {
          font-size: toRem(16);
        }

        .amount-zero {
          font-size: toRem(18);

          @include breakpoint-custom-down(700) {
            font-size: toRem(16);
          }
        }
      }

      .loading-amount-value {
        @include draw-shape(120, 32);
      }

      border-right: toRem(1) solid getColor("teal-800");
      padding: 0 toRem(24);

      @include breakpoint-custom-down(530) {
        border: 0;
        padding: toRem(16) 0;
        border-bottom: toRem(1) solid getColor("teal-800");
      }

      &:first-of-type {
        padding-left: 0;

        @include breakpoint-custom-down(530) {
          padding-top: 0;
        }
      }

      &:last-of-type {
        border-right: none;
        border-bottom: none;
      }
    }
  }

  .bottom-row {
    @include flex-row-start-wrap;
    gap: toRem(24);

    @include breakpoint-down(md) {
      gap: toRem(20);
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
