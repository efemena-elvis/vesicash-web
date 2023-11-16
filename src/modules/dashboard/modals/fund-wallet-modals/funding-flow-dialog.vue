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
            @fundingOptionSelected="goToNextFlow"
          />
        </keep-alive>
      </div>
    </template>
  </ModalCover>
</template>

<script>
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
  },

  computed: {
    getActiveFlow() {
      return this.active_flow === 0
        ? "FundWalletSelectModal"
        : "FundWalletEntryModal";
    },
  },

  data() {
    return {
      active_flow: 0,

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
      ],
    };
  },

  methods: {
    goToPreviousFlow() {
      this.active_flow -= 1;
    },

    goToNextFlow($event) {
      this.active_flow += 1;
      this.flows[1].payment_selection = $event;
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
