<template>
  <div class="otp-section">
    <AuthWrapper
      title_text="Enter OTP code"
      :meta_text="`Enter the OTP code we sent to <br> <span class='grey-800'>${user_details.email_address}</span>`"
    >
      <!-- AUTH PAGE -->
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

        <!-- BUTTON AREA -->
        <div class="btn-area mgt-35 mgb-10">
          <button
            class="btn btn-primary btn-md w-100"
            ref="btnRef"
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
    </AuthWrapper>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import OTPMixin from "@/modules/dashboard/mixins/otp-mixin";
import AuthWrapper from "@/modules/auth/components/auth-wrapper";

export default {
  name: "VerifyOTP",

  mixins: [OTPMixin],

  metaInfo: {
    title: "Verify OTP",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    AuthWrapper,
  },

  data() {
    return {
      user_details: {
        account_id: this.$route.params.account_id,
        email_address: this.$route.query?.user_email || "",
      },

      resend_countdown: 0,
    };
  },

  mounted() {
    this.trackRegistration();
  },

  methods: {
    ...mapActions({
      // sendUserOTP: "auth/sendUserOTP",
      // verifyUserOTP: "auth/verifyUserOTP",
      sendEmailOTP: "settings/requestEmailOTP",
      verifyEmailOTP: "settings/verifyEmailOTP",
    }),

    trackRegistration() {
      const saved_account = `TRACKED_USER_${this.$route?.params?.account_id}`;
      const saved_track = localStorage.getItem(saved_account);
      if (!saved_track) {
        window?.fbq("track", "CompleteRegistration");
        localStorage.setItem(saved_account, true);
      }
    },

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
    async handleUserOTPVerification() {
      this.togglePageLoader();

      let request_payload = {
        account_id: this.user_details?.account_id,
        code: +this.getOTPToken,
      };

      const response = await this.handleDataRequest({
        action: "verifyEmailOTP",
        payload: request_payload,
        btn_text: "Verify OTP code",
        alert_handler: {
          success: "Email OTP was successfully verified.",
          error: "You entered an invalid OTP token",
          request_error: "Your OTP token has expired",
        },
      });

      this.togglePageLoader();
      this.clearOutInput();

      if (response?.code === 200) {
        setTimeout(() => {
          this.handleToastPushMx("Email OTP was successfully verified.");
        }, 1000);

        setTimeout(() => (location.href = "/dashboard"), 1500);
      }
    },

    // ===================================
    // SEND OUT OTP VERIFICATION CODE
    // ===================================
    async sendOutOTPVerificationCode() {
      await this.handleDataRequest({
        action: "sendEmailOTP",
        payload: {
          account_id: +this.user_details?.account_id,
          email_address: this.user_details?.email_address,
        },
        alert_handler: {
          success: "An OTP code has been sent to your email",
          error: "Unable to generate an OTP code",
        },
      });
    },

    // ===================================
    // RESEND USER OTP CODE
    // ===================================
    resendOTPCode() {
      this.triggerResetCountdown(15);
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
.otp-section {
  margin-top: toRem(100);

  @include breakpoint-down(sm) {
    margin-top: toRem(80);
  }

  @include breakpoint-down(xs) {
    margin-top: toRem(60);
  }

  .auth-page {
    .form-group {
      @include flex-row-nowrap("flex-start", "center");
      gap: toRem(12);
  
      .form-control {
        padding: toRem(10) toRem(12);
        @include draw-shape(42);
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
}
</style>
