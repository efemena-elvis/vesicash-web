<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    :trigger_self_close="false"
    :show_close_btn="false"
    place_center
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header"> </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <component :is="getPaymentIcon" backgroundColor="#043B56" />

        <!-- TITLE TEXT -->
        <div class="h5-text grey-900 mgb-12 text-center">{{ getTitle }}</div>

        <!-- DESCRIPTION TEXT -->
        <div
          class="description-text tertiary-1-text grey-600 text-center"
          v-html="getDescription"
        ></div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer pdt-0 mgb-10">
        <button
          class="btn btn-primary btn-md wt-100 pdy-13"
          @click="verifyPayment"
        >
          {{ getBtnCopy }}
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";
import SuccessIcon from "@/shared/components/icon-comps/success-icon";
import ErrorIcon from "@/shared/components/icon-comps/error-icon";
import { constants } from "@/utilities";

export default {
  name: "CheckoutStatusModal",

  components: {
    ModalCover,
    SuccessIcon,
    ErrorIcon,
  },

  props: {
    transaction_info: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    getPaymentReference() {
      return this.$route.params.reference;
    },

    isSuccessful() {
      return this.transaction_info.status === "successful";
    },

    getPaymentIcon() {
      return this.isSuccessful ? "SuccessIcon" : "ErrorIcon";
    },

    getTitle() {
      return this.isSuccessful ? "Merchant Payment" : "Merchant payment failed";
    },

    getDescription() {
      return this.isSuccessful
        ? "Your payment status has been updated, click <span class='fw-semibold'>Confirm transaction</span> to verify the transaction"
        : "Your checkout payment failed while processing, please retry";
    },

    getBtnCopy() {
      return this.isSuccessful ? "Confirm transaction" : "Retry payment";
    },
  },

  methods: {
    ...mapActions({ verifyPaymentInfo: "merchantDeveloper/verifyPaymentInfo" }),

    async verifyPayment() {
      if (this.isSuccessful) {
        try {
          const response = await this.handleDataRequest({
            action: "verifyPaymentInfo",
            payload: { reference: this.getPaymentReference },
            show_alert: false,
          });

          if (response.code === 200) {
            let { redirect, reference, status } = this.transaction_info;

            if (redirect) {
              let user_redirect_url = `${redirect}?reference=${reference}&status=${status}`;

              this.$utils.createAndClickAnchor(user_redirect_url);
            } else {
              let vesicash_redirect_url = `${constants.VESICASH_APP_URL}/merchant/developer?type=checkout&reference=${reference}&status=${status}`;

              this.$utils.createAndClickAnchor(vesicash_redirect_url);
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else this.$emit("closeTriggered");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @include flex-column("center", "center");
  padding: toRem(50) toRem(40) toRem(40);

  svg {
    @include draw-shape(120);
    margin-bottom: toRem(24);

    @include breakpoint-down(xs) {
      @include draw-shape(115);
    }
  }

  .title-text {
    font-size: toRem(20);
  }
}
</style>
