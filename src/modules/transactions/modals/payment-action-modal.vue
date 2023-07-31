<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    :show_close_btn="false"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header"></template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body mgb-20">
        <!-- ICON WRAPPER -->
        <div class="icon-wrapper rounded-circle teal-50-bg mgt-10 mgb-24">
          <MoneyIcon fill />
        </div>

        <!-- TITLE TEXT -->
        <div class="title-text fw-600 grey-900 text-center h5-text mgb-8 w-100">
          {{ isExcessAmountPaid.status ? "Fund Reversal" : "Make Payment" }}
        </div>

        <!-- DESCRIPTION TEXT -->
        <div class="description-text text-center tertiary-1-text">
          <!-- IF AMOUNT PAID IS 0 -->
          <template v-if="transaction.amount_paid === 0">
            <!-- IF OWNER OF TRANSACTION -->
            <template v-if="isTransactionOwner">
              A payment of
              {{ transaction.total_amount }} for
              {{ transaction.title }}
              transaction, is currently pending.
            </template>

            <!-- IF NOT OWNER OF TRANSACTION -->
            <template v-else>
              {{ transaction.owner }} invited you to make a payment of
              {{ transaction.total_amount }} for
              {{ transaction.title }} transaction
            </template>
          </template>

          <!-- CHECK IF PAYMENT IS COMPLETE -->
          <template v-else>
            <template v-if="isLessAmountPaid.status">
              A complete payment for
              {{ transaction.title }} transaction of

              {{ transaction.currency
              }}{{ $utils.formatCurrencyWithComma(isLessAmountPaid.amount) }}

              is currently pending.
            </template>

            <template v-else>
              An excess amount of {{ transaction.currency
              }}{{
                $utils.formatCurrencyWithComma(isExcessAmountPaid.amount)
              }}
              was paid for {{ transaction.title }} transaction.
              <br />
              Initiate an immediate reversal of excess fund to your wallet.
            </template>
          </template>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <template v-if="isExcessAmountPaid.status">
          <button
            class="btn btn-primary btn-md wt-100 mgb-4"
            ref="refundBtn"
            @click="reverseExcessFund"
          >
            Initiate Reversal
          </button>
        </template>

        <template v-else>
          <button
            class="btn btn-primary btn-md wt-100 mgb-4"
            @click="makePaymentForTransaction"
          >
            Make Payment
          </button>

          <button
            class="btn btn-secondary btn-md wt-100 mgt-18"
            v-if="!isTransactionOwner"
          >
            Reject
          </button>
        </template>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import MoneyIcon from "@/shared/components/icon-comps/money-icon";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "PaymentActionModal",

  components: {
    ModalCover,
    MoneyIcon,
  },

  props: {
    transaction: {
      type: Object,
      default: () => ({
        owner: "",
        title: "",
        amount_paid: "",
        total_amount: "",
      }),
    },
  },

  computed: {
    getTransactionInfo() {
      let is_owner = this.getUser.email === this.transaction.owner;

      let total_amount = Number(
        this.transaction.total_amount.slice(1)?.split(",").join("")
      );

      let balance_amount = total_amount - this.transaction.amount_paid;

      return {
        is_owner,
        balance_amount,
      };
    },

    isTransactionOwner() {
      return this.getUser.email === this.transaction.owner;
    },

    getTotalAmount() {
      return Number(
        this.transaction.total_amount.slice(1)?.split(",").join("")
      );
    },

    isExcessAmountPaid() {
      let excess_amount = this.transaction.amount_paid - this.getTotalAmount;

      return {
        status: excess_amount > 0 ? true : false,
        amount: excess_amount,
      };
    },

    isLessAmountPaid() {
      let less_amount = this.getTotalAmount - this.transaction.amount_paid;

      return {
        status: less_amount > 0 ? true : false,
        amount: less_amount,
      };
    },
  },

  methods: {
    ...mapActions({
      walletToWalletTransfer: "transactions/walletToWalletTransfer",
    }),

    makePaymentForTransaction() {
      // CHECK IF USER HAS ALREADY ACCEPTED TRANSACTION
      // TOGGLE MAKE PAYMENT OPTIONS
      this.$emit("togglePaymentOptions");
    },

    reverseExcessFund() {
      this.handleClick("refundBtn");

      let request_payload = {
        sender_account_id: this.getAccountId,
        recipient_account_id: this.getAccountId,
        final_amount: this.isExcessAmountPaid.amount,
        sender_currency: `ESCROW_${this.transaction.currency_value}`,
        recipient_currency: this.transaction.currency_value,
        transaction_id: this.$route.params.id,
        refund: "yes",
      };

      this.walletToWalletTransfer(request_payload)
        .then((response) => {
          this.handleClick("refundBtn", "Initiate Reversal", false);

          if (response?.code === 200) {
            this.pushToast(
              "Excess funds has been reversed to your wallet.",
              "success"
            );

            setTimeout(() => location.reload(), 3000);
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @include flex-column("center", "center");

  .icon-wrapper {
    @include flex-column("center", "center");
    @include draw-shape(115);
    position: relative;

    svg {
      @include draw-shape(64);
    }
  }

  .description-text {
    @include font-height(14.75, 24);
    width: 90%;
  }
}
</style>
