<template>
  <div>
    <!-- MODAL COVER BODY -->
    <div>
      <!-- TRANSFER OPTION VIEW -->
      <template>
        <div class="description-text mgb-10 grey-600 tertiary-2-text">
          Please transfer the amount to the bank account below.
        </div>

        <!-- LOADING TRANSFER DETAILS -->
        <div class="modal-items-wrapper rounded-4 green-50-bg mgb-20">
          <template v-if="bank_details_loading">
            <ModalListItem v-for="(_, index) in 3" :key="index" loading />
          </template>

          <template v-else>
            <ModalListItem
              v-for="(data, index) in transfer_info"
              :title="data.title"
              :value="data.value"
              :key="index"
            />
          </template>
        </div>
      </template>
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
import { mapActions } from "vuex";

export default {
  name: "FundTransferListModal",

  components: {
    ModalListItem: () =>
      import(
        /* webpackChunkName: "dashboard-modal-module" */ "@/modules/dashboard/components/modal-comps/modal-list-item"
      ),
  },

  props: {
    amount: {
      type: Number,
      default: 0,
    },

    currency: {
      type: Object,
    },

    gateway: {
      type: String,
      default: "rave",
    },
  },

  watch: {
    amount: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) this.handleFetchingOfTransferDetails();
      },
      immediate: true,
    },
  },

  data() {
    return {
      bank_details_loading: true,
      displayed_bank_details: ["account number", "bank name", "account name"],
      account_reference_id: "",
      transfer_info_repo: [],
      transfer_info: [],
    };
  },

  methods: {
    ...mapActions({
      fetchTransferAccountBankDetails:
        "dashboard/fetchTransferAccountBankDetails",
    }),

    // ========================================
    // HANDLE FETCHING OF BANK TRANSFER DETAILS
    // ========================================
    handleFetchingOfTransferDetails() {
      this.bank_details_loading = true;
      this.transfer_info_repo = [];
      this.transfer_info = [];

      let request_payload = {
        account_id: this.getAccountId,
        amount: +this.amount,
        transaction_id:
          this.$route?.query?.transaction_id ?? this.$route?.params?.id,
        gateway: "rave",
        new: true,
      };

      if (!this.gateway) delete request_payload?.gateway;

      this.fetchTransferAccountBankDetails(request_payload)
        .then((response) => {
          this.bank_details_loading = false;
          this.transfer_info = [];

          if (response?.code === 200) {
            let account = response?.data ?? {};
            this.account_reference_id = account.payment_account_id;

            for (const prop in account) {
              let prop_obj = {};
              prop_obj.title = prop.split("_").join(" ");
              prop_obj.value = account[prop];
              this.transfer_info_repo.push(prop_obj);
            }

            this.transfer_info_repo.map((detail) => {
              if (this.displayed_bank_details.includes(detail.title))
                this.transfer_info.push(detail);
            });

            // let account_name = this.transfer_info.at(-1).value;
            // this.transfer_info.at(-1).value = `Vesicash-${account_name}`;
          }
          // else if (response?.code === 500) {
          //   this.handleFetchingOfTransferDetails();
          // }
        })
        .catch(() => (this.bank_details_loading = false));
    },

    // ===============================
    // VERIFY USER WALLET PAYMENT
    // ===============================
    async handleFundSuccess() {
      this.$router.push({
        name: "SuccessfulWalletFund",
        query: {
          type: "transfer",
          currency: this.currency.short,
          amount: +this.amount,
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
  