<template>
  <div class="fund-payment">
    <div class="row">
      <div class="col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6">
        <!-- PAYMENT TITLE -->
        <div class="payment-title mgb-32">
          You are making payment for
          <span>“{{ getTransactionSetup.name }}”.</span>
        </div>

        <!-- PAYMENT DESCRIPTION -->
        <div class="payment-description mgb-32">
          Your payment will be held in Escrow and you can monitor the status on
          your dashboard
        </div>

        <!-- TOTAL DISPLAY CARDS -->
        <div class="mgb-40">
          <SumTotalDisplayCard
            total_text="Total amount to pay"
            :total_value="`${getCurrencySign} ${$utils.formatCurrencyWithComma(
              getTransactionCharge?.total || getTransactionAmount.total_fee
            )}`"
          />
        </div>
      </div>
    </div>

    <!-- CTA ACTION ROW -->
    <div class="action-row mgt-14">
      <button
        ref="pay"
        class="btn btn-primary btn-md"
        @click="togglePaymentOptionModal"
      >
        Make Payment
      </button>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_payment_option_modal">
        <PaymentsModal
          :paymentDetails="transactionDetails"
          @closeTriggered="togglePaymentOptionModal"
          @initiateWireTransfer="closePaymentOpenWire"
          @initiateFWBizPayment="closePaymentOpenFWBiz"
          @initiateCardPayment="initiateCardPayment"
          @initiateWalletTransfer="toggleWalletTransferModal"
        />
      </transition>

      <transition name="fade" v-if="show_wire_transfer_modal">
        <WireTransferModal
          :paymentDetails="transactionDetails"
          @closeTriggered="toggleWireTransferModal"
          @goBackPaymentSelection="closeWTPaymentOpenPayment"
          @paid="closeWireAndOpenSuccess"
        />
      </transition>

      <transition name="fade" v-if="show_naira_transfer_modal">
        <WalletDetailsModal
          @closeTriggered="toggleNairaTransferModal"
          @goBackWalletSelection="closeNairaPaymentOpenPayment"
          @walletFunded="closeFundDetailsAndOpenSuccess"
          :gateway="gateway"
          :amount="transactionDetails.total_fee"
          :currency="transactionDetails.currency.short"
        />
      </transition>

      <transition name="fade" v-if="show_fw_biz_modal">
        <FlutterwaveBusinessPaymentModal
          @closeTriggered="toggleFWBizModal"
          @goBackWalletSelection="closeFWBizOpenPayment"
          @walletFunded="closeFundDetailsAndOpenSuccess"
          :gateway="gateway"
          :amount="transactionDetails || '0'"
        />
      </transition>

      <transition name="fade" v-if="show_failed_wallet_transfer">
        <FailedWalletTransferModal
          @closeTriggered="toggleWalletTransfer"
          @goBackPaymentSelection="closeWalletTransferOpenPayment"
          :message="message"
        />
      </transition>

      <transition name="fade" v-if="show_wallet_transfer_modal">
        <WalletTransferModal
          @closeTriggered="toggleWalletTransferModal"
          @goBackOptionSelection="toggleWalletTransferModal"
          @transfer="transferFromWallet"
          :currency="getCurrency"
          :amount="transactionAmount"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import paymentHelper from "@/modules/transactions/mixins/payment-mixins";

export default {
  name: "TransactionPayment",

  mixins: [paymentHelper],

  metaInfo: {
    title: "Transaction Payment",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    SumTotalDisplayCard: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/card-comps/sum-total-display-card"
      ),
  },

  computed: {
    ...mapGetters({
      getTransactionSetup: "transactions/getTransactionSetup",
      getTransactionAmount: "transactions/getTransactionAmount",
      getTransactionCharge: "transactions/getTransactionCharge",
    }),

    transactionDetails() {
      const charge = this.getTransactionCharge;
      const amount = this.getTransactionAmount;
      return charge
        ? { ...amount, escrow_fee: charge.fee_charge, total_fee: charge.total }
        : amount;
    },

    transactionAmount() {
      return this.getTransactionCharge?.total || 0;
    },
  },

  mounted() {
    // console.log("----", this.getTransactionAmount);
  },
};
</script>

<style lang="scss" scoped>
.fund-payment {
  .payment-title,
  .payment-description {
    @include generate-font-type("h7");
    @include font-height(18.5, 30);

    @include breakpoint-down(md) {
      @include font-height(17.5, 28);
    }

    @include breakpoint-down(sm) {
      @include font-height(15.25, 28);
    }

    span {
      font-weight: 700;
    }
  }

  .action-row {
    padding-bottom: toRem(55);

    .btn {
      padding: toRem(9.5) toRem(24);
      width: toRem(260);

      @include breakpoint-down(xs) {
        width: 100%;
      }
    }
  }
}
</style>
