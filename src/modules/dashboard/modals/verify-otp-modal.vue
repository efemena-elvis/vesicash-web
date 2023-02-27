<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    :show_close_btn="false"
    :trigger_self_close="false"
    :place_center="true"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title text-center mgt-5 mgb--10">
          Enter OTP code
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <p>
          Please enter the OTP code that was sent to your phone number for
          verification
        </p>

        <div class="form-group">
          <input
            type="number"
            class="form-control"
            v-model="otp_one"
            ref="otpOne"
          />
          <input
            type="number"
            class="form-control"
            v-model="otp_two"
            ref="otpTwo"
            :disabled="checkOTPOne"
          />
          <input
            type="number"
            class="form-control"
            v-model="otp_three"
            ref="otpThree"
            :disabled="checkOTPTwo"
          />
          <input
            type="number"
            class="form-control"
            v-model="otp_four"
            ref="otpFour"
            :disabled="checkOTPThree"
          />
          <input
            type="number"
            class="form-control"
            v-model="otp_five"
            ref="otpFive"
            :disabled="checkOTPFour"
          />
          <input
            type="number"
            class="form-control"
            v-model="otp_six"
            ref="otpSix"
            :disabled="checkOTPFive"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button class="btn btn-primary btn-md wt-100 mgb-4" @click="verifyOTP">
          Verify phone number
        </button>

        <button class="btn btn-secondary btn-md wt-100">Resend OTP code</button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapGetters } from "vuex";
import OTPMixin from "@/modules/dashboard/mixins/otp-mixin";
import BasicInput from "@/shared/components/form-comps/basic-input";
import ModalCover from "@/shared/components/modal-cover";

export default {
  name: "verifyOTPModal",

  mixins: [OTPMixin],

  components: {
    ModalCover,
    BasicInput,
  },

  data: () => ({
    form: {
      phone_number: "",
    },

    validity: {
      phone_number: true,
    },
  }),

  mounted() {
    // ==================================================
    // SET FIRST INPUT TO FOCUS STATE ON INITIAL MOUNT
    // ==================================================
    this.$nextTick(() => this.$refs?.otpOne?.focus());
  },

  methods: {
    verifyOTP() {
      this.$emit("verifyUserOTP");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-title {
  font-size: toRem(18.5);
}

.modal-cover-body {
  min-height: toRem(35);
  @include flex-row-center-wrap;

  p {
    @include generate-font-type("tertiary-2");
    color: getColor("grey-700");
    line-height: toRem(22);
    text-align: center;
  }

  .form-group {
    @include flex-row-center-nowrap;

    .form-control {
      padding: toRem(8) toRem(10);
      @include draw-shape(36);
      margin: 0 toRem(5);
      text-align: center;
    }
  }
}

.btn-secondary {
  border: 0 !important;
  color: getColor("grey-600") !important;
}
</style>