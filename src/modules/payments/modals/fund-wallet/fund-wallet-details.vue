<template>
  <div>
    <div class="description-text mgb-10 grey-600 tertiary-2-text">
      Transfer
      {{
        $utils.formatCurrency({
          input: account_details.currency,
          output: "sign",
        })
      }}{{ $utils.formatCurrencyWithComma(account_details.amount) }}
      to the bank account below.
    </div>

    <!-- LOADING TRANSFER DETAILS -->
    <div class="modal-items-wrapper rounded-4 green-50-bg mgb-20">
      <ModalListItem
        v-for="(data, index) in account_details.bank_transfer_details"
        :title="data.title"
        :value="data.value"
        :key="index"
      />
    </div>

    <!-- MODAL COVER FOOTER -->
    <div class="pdb-30">
      <button class="btn btn-primary btn-md wt-100" @click="handleFundSuccess">
        I have funded
      </button>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "FundWalletDetails",

  components: {
    ModalListItem: () =>
      import(
        /* webpackChunkName: "dashboard-modal-module" */ "@/modules/dashboard/components/modal-comps/modal-list-item"
      ),
  },

  props: {
    account_details: {
      type: Object,
      default: () => ({
        bank_transfer_details: [],
        amount: 0,
        currency: "",
      }),
    },
  },

  methods: {
    // ===============================
    // VERIFY USER WALLET PAYMENT
    // ===============================
    async handleFundSuccess() {
      this.$router.push({
        name: "SuccessfulWalletFund",
        query: {
          type: "transfer",
          currency: this.account_details.currency,
          amount: this.account_details.amount,
        },
      });
    },
  },
};
</script>
    
    <style lang="scss" scoped>
.amount-meta {
  @include flex-row-nowrap("space-between", "center");
}

.modal-items-wrapper {
  border: toRem(1) dashed getColor("green-500");
  padding: toRem(2) toRem(18);
}
</style>
    