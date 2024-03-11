<template>
  <div class="actions-block rounded-12 mgb-32">
    <div class="card-title grey-900 primary-1-text mgb-16">Quick actions</div>

    <div class="row">
      <div
        class="col-12 col-sm-6 col-md-4"
        v-for="(card, index) in getCardActions"
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
          :message="success_message"
          main_cta_title="Done"
          @done="transferDone"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
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

  computed: {
    ...mapGetters({
      getWalletTransferDetails: "general/getWalletTransferDetails",
      getTransactionCharges: "general/getTransactionCharges",
    }),

    getCardActions() {
      return this.isMoRSetupEnabled
        ? this.card_actions
        : this.card_actions.filter((item) => !item.isMor);
    },
  },

  data: () => ({
    success_message: "",
    card_actions: [
      // {
      //   title: "Transfer money anywhere",
      //   description: "Send money globally with ease",
      //   icon: "cash-icon.svg",
      //   action: "toggleTransferFlow",
      //   isMor: false,
      // },
      // {
      //   title: "Fund your wallet",
      //   description: "Top up wallet for swift payments",
      //   icon: "wallet-icon.svg",
      //   action: "toggleFundingFlow",
      //   isMor: false,
      // },
      // {
      //   title: "Create escrow",
      //   description: "Engage in transparent transactions",
      //   icon: "central-icon.svg",
      //   link: "/transactions/setup",
      //   isMor: false,
      // },
      {
        title: "Exchange funds",
        description: "Exchange money across currencies",
        icon: "swap-icon.svg",
        link: "/exchange/setup",
        internal: true,
      },
      {
        title: "Deploy MoR",
        description: "Setup MoR for any country",
        icon: "subscription-icon.svg",
        link: "/settings/mor-setup",
        internal: true,
      },
      {
        title: "API Documentation",
        description: "Explore our API documentation",
        icon: "subscription-icon.svg",
        link: "https://docs.vesicash.com/",
        internal: false,
      },
      // {
      //   title: "Payment via checkout",
      //   description: "Integrate MoR checkout api",
      //   icon: "subscription-icon.svg",
      //   link: "/merchant/developer?type=checkout",
      //   isMor: true,
      // },
    ],

    show_funding_flow: false,
    show_transfer_flow: false,

    show_otp_modal: false,
    show_success_modal: false,

    withdrawn_amount: "",
    selected_withdraw_account: "",
  }),

  created() {
    this.$bus.$on("cardActionClicked", (action) => this[action]());
  },

  methods: {
    ...mapMutations({
      resetTransferDetails: "general/RESET_WALLET_TRANSFER_DETAILS",
    }),

    ...mapActions({ fetchCharges: "general/fetchCharges" }),

    async fetchTransferCharges() {
      if (!this.getTransactionCharges?.wallet_withdrawal)
        await this.fetchCharges("wallet_withdrawal");

      if (!this.getTransactionCharges?.mor_withdrawal)
        await this.fetchCharges("mor_withdrawal");
    },

    processModalActions(action) {
      this[action]();
    },

    toggleFundingFlow() {
      this.show_funding_flow = !this.show_funding_flow;
    },

    toggleTransferFlow() {
      this.fetchTransferCharges();
      this.show_transfer_flow = !this.show_transfer_flow;
    },

    toggleOTPModal() {
      this.show_otp_modal = !this.show_otp_modal;
    },

    transferDone() {
      this.success_message = "";
      this.resetTransferDetails();
      this.show_success_modal = false;
    },

    toggleSuccessModal() {
      this.show_otp_modal = false;
      const { amount, currency, beneficiary } = this.getWalletTransferDetails;

      const cost = `${this.$money.getSign(
        currency
      )}${this.$utils.formatCurrencyWithComma(amount)}`;
      const name = beneficiary.account_name;

      this.success_message = `Your transfer of ${cost} has been sent to Vesicash account ${name}`;
      this.show_success_modal = !this.show_success_modal;
    },
  },
};
</script>

<style lang="scss" scoped>
.actions-block {
  background: rgba(getColor("teal-100"), 0.78);
  padding: toRem(24);
  .row {
    row-gap: toRem(18);
  }
}
</style>
