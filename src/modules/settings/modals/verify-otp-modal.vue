<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    :trigger_self_close="false"
    :place_center="true"
    show_close_btn
    class="verify-otp-modal"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title text-center mt-3">Enter OTP code</div>

        <div
          class="tertiary-2-text text-center grey-600"
          v-html="title"
          v-if="title"
        ></div>
        <div class="tertiary-2-text text-center grey-600" v-else>
          Please enter the OTP code that was sent to
          <b>{{ input }}</b> for verification
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <!-- OTP BODY -->
        <div class="auth-page">
          <!-- OTP ENTRY INPUTS -->
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
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <!-- BUTTON AREA -->
        <div class="btn-area mgb-10">
          <button
            class="btn btn-primary btn-md w-100"
            :disabled="getOTPToken.length === 6 ? false : true"
            @click="handleUserOTPVerification"
          >
            Verify OTP code
          </button>
        </div>

        <!-- HELP BLOCK TEXT -->
        <template v-if="resend_countdown === 0">
          <div
            class="help-block text-center grey-600 pointer"
            @click="resendOTPCode"
          >
            Resend OTP code
          </div>
        </template>

        <template v-else>
          <div class="help-block text-center grey-600 pointer">
            Resending in.. 0.{{ resend_countdown }}s
          </div>
        </template>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "VerifyOTPModal",

  components: {
    ModalCover,
  },

  props: {
    email: {
      type: Boolean,
      default: false,
    },

    input: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },
  },

  computed: {
    checkOTPOne() {
      return this.otp_one.length === 1 ? false : true;
    },

    checkOTPTwo() {
      return this.otp_two.length === 1 ? false : true;
    },

    checkOTPThree() {
      return this.otp_three.length === 1 ? false : true;
    },

    checkOTPFour() {
      return this.otp_four.length === 1 ? false : true;
    },

    checkOTPFive() {
      return this.otp_five.length === 1 ? false : true;
    },

    getOTPToken() {
      return `${this.otp_one}${this.otp_two}${this.otp_three}${this.otp_four}${this.otp_five}${this.otp_six}`;
    },
  },

  watch: {
    otp_one: {
      handler(value) {
        if (value.length === 1) this.$nextTick(() => this.$refs.otpTwo.focus());
        else if (value.length > 1) this.checkPastedContent(value);
      },
    },

    otp_two: {
      handler(value) {
        if (value.length === 1)
          this.$nextTick(() => this.$refs.otpThree.focus());
      },
    },

    otp_three: {
      handler(value) {
        if (value.length === 1)
          this.$nextTick(() => this.$refs.otpFour.focus());
      },
    },

    otp_four: {
      handler(value) {
        if (value.length === 1)
          this.$nextTick(() => this.$refs.otpFive.focus());
      },
    },

    otp_five: {
      handler(value) {
        if (value.length === 1) this.$nextTick(() => this.$refs.otpSix.focus());
      },
    },

    otp_six: {
      handler(value) {
        if (value.length === 1) {
          this.$nextTick(() => this.$refs.otpSix.blur());
          // this.handleUserOTPVerification();
        }
      },
    },
  },

  data() {
    return {
      otp_one: "",
      otp_two: "",
      otp_three: "",
      otp_four: "",
      otp_five: "",
      otp_six: "",

      user_details: {
        account_id: this.$route.params.account_id,
        email_address: this.$route.query?.user_email || "",
      },

      resend_countdown: 0,
    };
  },

  mounted() {
    // ==================================================
    // SET FIRST INPUT TO FOCUS STATE ON INITIAL MOUNT
    // ==================================================
    this.$nextTick(() => this.$refs?.otpOne?.focus());
  },

  methods: {
    ...mapActions({
      sendUserOTP: "settings/requestOTP",
      verifyUserOTP: "settings/verifyOTP",
      verifyEmailOTP: "settings/verifyEmailOTP",
      sendEmailOTP: "settings/requestEmailOTP",
    }),
    // ===============================
    // CLEAR OUT ALL OTP INPUTS
    // ===============================
    clearOutInput() {
      this.otp_one = "";
      this.otp_two = "";
      this.otp_three = "";
      this.otp_four = "";
      this.otp_five = "";
      this.otp_six = "";
    },

    // ========================================================
    // CHECK IF A VALUE WAS PASTED INTO THE FIRST INPUT FIELD
    // ========================================================
    checkPastedContent(value) {
      this.$nextTick(() => {
        let splitted = value.split("");

        this.otp_one = splitted[0] || "";
        this.otp_two = splitted[1] || "";
        this.otp_three = splitted[2] || "";
        this.otp_four = splitted[3] || "";
        this.otp_five = splitted[4] || "";
        this.otp_six = splitted[5] || "";
      });
    },

    // ===================================
    // VERIFY USER ACCOUNT OTP ENTRY
    // ===================================
    handleUserOTPVerification() {
      let request_payload = {
        account_id: this.getAccountId,
        code: +this.getOTPToken,
      };

      let request_email_payload = {
        account_id: this.getAccountId,
        code: +this.getOTPToken,
      };

      const payload = this.email ? request_email_payload : request_payload;

      const action = this.email ? "verifyEmailOTP" : "verifyUserOTP";

      this[action](payload)
        .then((response) => {
          if (response?.code === 200) {
            this.handleToastPushMx("OTP was verified successfully", "success");
            this.$emit("done");
            this.$emit("closeTriggered");
          }

          // HANDLE NON 200 RESPONSE
          else {
            this.pushToast("You entered an invalid OTP token", "error");
            this.clearOutInput();
          }
        })
        .catch(() => {
          this.pushToast("Unable to verify OTP token", "error");
          this.clearOutInput();
        });
    },

    // ===================================
    // SEND OUT OTP VERIFICATION CODE
    // ===================================
    sendOutOTPVerificationCode() {
      let request_payload = {
        account_id: this.getAccountId,
        // phone_number: `+${this.input}`,
      };

      let request_email_otp_payload = {
        account_id: this.getAccountId,
        email_address: this.email,
      };

      const payload = this.email ? request_email_otp_payload : request_payload;
      const action = this.email ? "sendEmailOTP" : "sendUserOTP";

      this[action](payload)
        .then((response) => {
          if (response?.code === 200)
            this.pushToast(`An OTP code has been sent to you`, "success");
        })
        .catch(() => this.pushToast("Unable to generate an OTP code", "error"));
    },

    // ===================================
    // RESEND USER OTP CODE
    // ===================================
    resendOTPCode() {
      this.triggerResetCountdown(30);
      this.sendOutOTPVerificationCode();
    },

    // ===================================
    // TRIGGER SENDING A NEW OTP CODE
    // ===================================
    triggerResetCountdown(count) {
      this.resend_countdown = count;
      const intervalCall = setInterval(() => {
        this.resend_countdown -= 1;

        if (this.resend_countdown === 0) clearInterval(intervalCall);
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-page {
  .form-group {
    @include flex-row-nowrap("center", "center");

    .form-control {
      padding: toRem(8) toRem(10);
      @include draw-shape(36);
      margin: 0 toRem(5);
      text-align: center;
    }
  }

  .help-block {
    @include transition(0.4s);

    &:hover {
      color: getColor("grey-800");
    }
  }
}
</style>

<style lang="scss" scoped>
.verify-otp-modal {
  .modal-cover-body {
    min-height: auto;
  }
}
</style>
