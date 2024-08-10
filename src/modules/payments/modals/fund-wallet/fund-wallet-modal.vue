<template>
  <ModalCover
    class="wallet-select-modal"
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    show_close_btn
    :trigger_self_close="false"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Fund wallet</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <keep-alive>
          <component
            :is="getActiveFlow"
            :account_details="account_details"
            @displayBankDetails="goToBankTransferFlow($event)"
          />
        </keep-alive>
      </div>
    </template>
  </ModalCover>
</template>

<script>
// import { mapActions, mapGetters } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "FundWalletModal",

  components: {
    ModalCover,
    FundWalletEntry: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/fund-wallet/fund-wallet-entry"
      ),
    FundWalletDetails: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/fund-wallet/fund-wallet-details"
      ),
  },

  computed: {
    // ...mapGetters({ getTransactionCharges: "general/getTransactionCharges" }),

    getActiveFlow() {
      if (this.active_flow === 0) return "FundWalletEntry";
      else if (this.active_flow === 1) return "FundWalletDetails";
    },
  },

  data() {
    return {
      active_flow: 0,
      account_details: {},
    };
  },

  // async mounted() {
  //   if (!this.getTransactionCharges?.wallet_funding)
  //     await this.fetchCharges("wallet_funding");
  // },

  methods: {
    // ...mapActions({ fetchCharges: "general/fetchCharges" }),

    goToBankTransferFlow(data) {
      this.active_flow += 1;
      this.account_details = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  min-height: max-content;
  height: auto;
  max-height: 85vh;
}
</style>
