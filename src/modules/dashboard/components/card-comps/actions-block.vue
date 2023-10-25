<template>
  <div class="actions-block teal-50-bg rounded-12 mgb-32">
    <div class="card-title grey-900 primary-1-text mgb-16">
      Get started with quick actions
    </div>

    <div class="row">
      <div
        class="col-12 col-sm-6 col-md-4"
        v-for="(card, index) in card_actions"
        :key="index"
        :card_id="index"
      >
        <ActionCard :card_detail="card" />
      </div>
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
import ActionCard from "@/modules/dashboard/components/card-comps/action-card";

export default {
  name: "ActionsBlock",

  components: {
    ActionCard,
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

  data: () => ({
    card_actions: [
      {
        title: "Transfer money anywhere",
        description: "Send money globally with ease",
        icon: "cash-icon.svg",
        action: "toggleTransferFlow",
      },
      {
        title: "Fund your wallet",
        description: "Top up wallet for swift payments",
        icon: "wallet-icon.svg",
        action: "toggleFundingFlow",
      },
      {
        title: "Create escrow",
        description: "Engage in transparent transactions",
        icon: "central-icon.svg",
        link: "/transactions/setup",
      },
      {
        title: "Exchange money",
        description: "Exchange money across currencies",
        icon: "swap-icon.svg",
        link: "/exchange/setup",
      },
      {
        title: "Payment via checkout",
        description: "Integrate MoR checkout api",
        icon: "subscription-icon.svg",
        link: "/merchant/developer?type=checkout",
      },
      {
        title: "Deploy MoR",
        description: "Setup MoR for any country",
        icon: "subscription-icon.svg",
        link: "/settings/mor-setup",
      },
    ],

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

  created() {
    this.$bus.$on("cardActionClicked", (action) => this[action]());
  },

  methods: {
    processModalActions(action) {
      this[action]();
    },

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
.actions-block {
  padding: toRem(24);

  .row {
    row-gap: toRem(18);
  }
}
</style>
