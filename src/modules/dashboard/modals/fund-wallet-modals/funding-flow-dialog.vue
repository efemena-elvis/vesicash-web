<template>
  <ModalCover
    class="wallet-select-modal"
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    :show_close_btn="flows[0].show_close_btn"
    :trigger_self_close="flows[0].trigger_self_close"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <template v-if="active_flow === 0">
          <div class="modal-cover-title">Fund wallet</div>
          <div class="modal-cover-meta">
            Please select a payment funding option
          </div>
        </template>

        <template v-else>
          <!-- BACK BUTTON -->
          <PageBackBtn custom_mode @clicked="goToPreviousFlow" />
          <div class="modal-cover-title h5-text mgt--4">
            {{ flows[1].payment_selection.title }}
          </div>
        </template>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <keep-alive>
          <component
            :is="getActiveFlow"
            :payment_type="flows[1].payment_selection"
            :amount="funding_amount"
            :currency="funding_currency"
            @fundingOptionSelected="goToNextFlow"
            @loadBankDetails="goToBankTransferFlow"
          />
        </keep-alive>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";

export default {
  name: "FundingFlowDialog",

  components: {
    ModalCover,
    PageBackBtn,
    FundWalletSelectModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/fund-wallet-modals/fund-wallet-select-modal"
      ),
    FundWalletEntryModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/fund-wallet-modals/fund-wallet-entry-modal"
      ),
    FundTransferListModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/fund-wallet-modals/fund-transfer-list-modal"
      ),
  },

  computed: {
    ...mapGetters({ getTransactionCharges: "general/getTransactionCharges" }),

    getActiveFlow() {
      if (this.active_flow === 0) return "FundWalletSelectModal";
      else if (this.active_flow === 1) return "FundWalletEntryModal";
      else if (this.active_flow === 2) return "FundTransferListModal";
    },
  },

  data() {
    return {
      active_flow: 0,
      funding_amount: 0,
      funding_currency: null,

      flows: [
        {
          show_close_btn: true,
          trigger_self_close: true,
          payment_selection: {},
        },
        {
          show_close_btn: false,
          trigger_self_close: false,
          payment_selection: {},
        },
        {
          show_close_btn: false,
          trigger_self_close: false,
          payment_selection: {},
        },
      ],
    };
  },

  async mounted() {
    if (!this.getTransactionCharges?.wallet_funding)
      await this.fetchCharges("wallet_funding");
  },

  methods: {
    ...mapActions({ fetchCharges: "general/fetchCharges" }),

    goToPreviousFlow() {
      this.active_flow -= 1;
    },

    goToNextFlow($event) {
      this.active_flow += 1;
      this.flows[1].payment_selection = $event;
    },

    goToBankTransferFlow(data) {
      this.active_flow += 1;
      this.funding_amount = data.amount;
      this.funding_currency = data.currency;
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
