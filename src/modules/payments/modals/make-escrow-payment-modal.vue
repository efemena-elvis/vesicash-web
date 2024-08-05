<template>
  <ModalCover
    :show_close_btn="false"
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xxl' }"
    class="escrow-payment-modal"
  >
    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="h5-text grey-900">Escrow payment</div>
        <div class="h2-text green-600 mgy-16">$500,000</div>
        <div class="details-card">
          <div class="detail-item">
            <div>
              <div class="grey-400 tertiary-1-text mgb-2">Account number</div>
              <div class="teal-800 secondary-1-text">0159494476</div>
            </div>
            <CopyIcon />
          </div>
        </div>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";
import CopyIcon from "@/shared/components/icon-comps/copy-icon";

export default {
  name: "MakeEscrowPaymentModal",

  components: {
    ModalCover,
    CopyIcon,
  },
};
</script>

<style lang="scss" scoped>
.details-card {
  border-radius: toRem(20);
  padding: toRem(10);

  .detail-item {
    @include flex-row-nowrap("space-between", "center");
  }
}
</style>

<style lang="scss">
.modal-overlay.escrow-payment-modal {
  .modal-outer-container {
    width: 1800px !important;
    max-width: 99%;
  }
}
</style>
