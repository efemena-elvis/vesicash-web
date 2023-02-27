<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    :show_close_btn="false"
    :trigger_self_close="false"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">
          <!-- BACK BUTTON -->
          <PageBackBtn custom_mode @clicked="$emit('goBackWalletSelection')" />
          <template>Pay with flutterwave business</template>
        </div>

        <div class="modal-cover-meta">
          Make the payment from your flutterwave business account (with merchant
          ID:
          <b>{{ getMerchantID }}</b
          >) to the vesicash merchant ID below
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body mgb--10">
        <!-- MODAL ITEMS WRAPPER -->
        <div class="modal-items-wrapper green-10-bg rounded-12 mgb-24">
          <!-- NAIRA WALLET TYPE -->
          <template v-if="naira_wallet_loading">
            <ModalListItem
              :loading="naira_wallet_loading"
              v-for="(_, index) in 3"
              :key="index"
            />
          </template>

          <template v-else>
            <ModalListItem
              v-for="(data, index) in fundingInfo"
              :title="data.title"
              :value="data.value"
              :key="index"
            />
          </template>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <div v-if="!getMerchantID" class="tertiary-2-text mgb-15 red-text-400">
          Your account does not have a merchant ID. Add a merchant ID to
          continue.
        </div>

        <template>
          <button
            v-if="getMerchantID"
            class="btn btn-primary btn-md wt-100"
            @click="handleFundSuccess"
            ref="done"
          >
            I have funded
          </button>

          <router-link
            v-else
            class="btn btn-primary btn-md wt-100"
            to="/settings/profile?focus_merchant=true"
            >Add merchant ID</router-link
          >
        </template>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/modal-cover";
import PageBackBtn from "@/shared/components/page-back-btn";
// import { VESICASH_APP_URL } from "@/utilities/constant";

export default {
  name: "FLWBizPayModal",

  components: {
    ModalCover,
    PageBackBtn,
    ModalListItem: () =>
      import(
        /* webpackChunkName: "dashboard-modal-module" */ "@/modules/dashboard/components/modal-comps/modal-list-item"
      ),
  },

  props: {
    wallet_type: {
      type: String,
      default: "naira",
    },

    gateway: {
      type: String,
      default: "",
    },

    amount: {
      type: [String, Number],
      default: "",
    },
  },

  computed: {
    getAmount() {
      const sign = this.$money.getSign(this.wallet_type);
      const amount = this.$money.addComma(this.amount);
      return `${sign}${amount}`;
    },

    getMerchantID() {
      return this.getUser?.flutterwave_merchant_id;
    },

    fundingInfo() {
      return [
        {
          title: "Amount to pay",
          value: this.getAmount,
        },
        {
          title: "Merchant ID",
          value: "6868107",
        },
        {
          title: "Merchant name",
          value: "Vesicash Innovative Technologies",
        },
      ];
    },
  },

  data() {
    return {
      account_reference_id: "",
      naira_wallet_loading: true,
    };
  },

  mounted() {
    this.handleFetchingNairaDetails();
  },

  methods: {
    ...mapActions({
      verifyPaymentAccount: "dashboard/verifyPaymentAccount",
      fetchTransferAccountBankDetails:
        "dashboard/fetchTransferAccountBankDetails",
    }),

    // ========================================
    // HANDLE FETCHING OF NAIRA BANK DETAILS
    // ========================================
    async handleFetchingNairaDetails() {
      let request_payload = {
        account_id: this.getAccountId,
        transaction_id:
          this.$route?.query?.transaction_id ?? this.$route?.params?.id,
        gateway: this.gateway || "rave",
      };

      try {
        const response = await this.fetchTransferAccountBankDetails(
          request_payload
        );
        this.naira_wallet_loading = false;
        if (response.code === 500) this.handleFetchingNairaDetails();
      } catch (e) {
        console.log("ERROR OCCURED", e);
        this.naira_wallet_loading = false;
      }
    },

    // ===============================
    // VERIFY USER WALLET PAYMENT
    // ===============================
    handleFundSuccess() {
      //   this.verifyPaymentAccount({
      //     reference: this.account_reference_id,
      //   });

      this.handleClick("done");

      setTimeout(() => this.$emit("walletFunded"), 1500);
    },

    handlePaymentError(message) {
      this.pushToast(message, "error");
      this.handleClick("fundBtn", "Make payment", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  max-height: 60vh;
  overflow-y: auto;

  .modal-items-wrapper {
    border: toRem(1) dashed getColor("green-500");
    padding: toRem(2) toRem(18);
  }
}
</style>