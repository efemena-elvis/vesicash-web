<template>
  <ModalCover
    show_close_btn
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
  >
    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="body-area">
          <SuccessIcon backgroundColor="#043B56" />

          <!-- TITLE TEXT -->
          <div class="title-text grey-800 mgb-10 text-center">
            Transfer Successful
          </div>

          <!-- DESCRIPTION TEXT -->
          <div class="description-text grey-600 text-center">
            Your transfer of
            <span class="fw-semibold">{{ getTransferAmount }}</span> has been
            successfully sent out to the receiving recipient
          </div>

          <!-- BUTTON AREA -->
          <div class="btn-area mgt-24 wt-100">
            <button
              class="btn btn-primary btn-md wt-100 mgb-10"
              @click="$emit('viewPayments', 'payments')"
            >
              View Payments
            </button>

            <button
              class="btn btn-md btn-secondary wt-100"
              @click="$emit('closeTriggered', 'close')"
            >
              Send money again
            </button>
          </div>
        </div>
      </div>
    </template>
  </ModalCover>
</template>
    
<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";
import SuccessIcon from "@/shared/components/icon-comps/success-icon";

export default {
  name: "BulkTransferSuccessModal",

  components: {
    ModalCover,
    SuccessIcon,
  },

  props: {
    currency: {
      type: String,
      default: "",
    },

    total_amount: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    getTransferAmount() {
      return `${this.$utils.formatCurrency({
        input: this.currency,
        output: "sign",
      })}${this.$utils.formatCurrencyWithComma(this.total_amount, true)}`;
    },
  },

  data() {
    return {};
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  min-height: auto;

  .body-area {
    @include flex-column("center", "center");
    padding: toRem(16) 0 toRem(30);

    svg {
      @include draw-shape(94);
      margin-bottom: toRem(20);
    }

    .title-text {
      @include font-height(18, 26, 700);
    }

    .description-text {
      @include font-height(14.25, 21);
    }
  }
}
</style>
    