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
          <div class="modal-cover-title">Transfer funds</div>
          <div class="modal-cover-meta">
            Please select a fund transfer option
          </div>
        </template>

        <template v-else>
          <!-- BACK BUTTON -->
          <PageBackBtn custom_mode @clicked="goToPreviousFlow" />
          <div class="modal-cover-title h5-text mgt--4">
            {{ flows[active_flow].transfer_selection.title }}
          </div>
        </template>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <component
          :is="getActiveFlow"
          :account_type="flows[1].transfer_selection"
          @accountTypeSelected="goToNextFlow"
          @confirmAccountSelected="goToNextFlow"
          @verifyWithdrawalOTP="closeTransferDialogVerifyOTP"
        />
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";

export default {
  name: "TransferFlowDialog",

  components: {
    ModalCover,
    PageBackBtn,
    WithdrawSelectModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/withdraw-modals/withdraw-select-modal"
      ),
    WithdrawAccountModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/withdraw-modals/withdraw-account-modal"
      ),
    WithdrawConfirmModal: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/modals/withdraw-modals/withdraw-confirm-modal"
      ),
  },

  computed: {
    getActiveFlow() {
      return this.flows[this.active_flow].flow_comp;
    },
  },

  data() {
    return {
      active_flow: 0,

      flows: [
        {
          flow_comp: "WithdrawSelectModal",
          show_close_btn: true,
          trigger_self_close: true,
          transfer_selection: {},
        },
        {
          flow_comp: "WithdrawAccountModal",
          show_close_btn: false,
          trigger_self_close: false,
          transfer_selection: {},
        },
        {
          flow_comp: "WithdrawConfirmModal",
          show_close_btn: false,
          trigger_self_close: false,
          transfer_selection: {},
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
      this.flows[this.active_flow].transfer_selection = $event;
    },

    closeTransferDialogVerifyOTP() {
      this.$emit("verifyTransferOTP");
      this.$emit("closeTriggered");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
}
</style>
