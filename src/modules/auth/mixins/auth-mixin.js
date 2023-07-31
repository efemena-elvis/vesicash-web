import { mapActions } from "vuex";

const authMixin = {
  methods: {
    ...mapActions({
      sendEmailOTP: "settings/requestEmailOTP",
    }),

    // =======================================
    // HANDLE THE INITIATION OF USER OTP
    // =======================================
    async handleOTPInitiation() {
      await this.handleDataRequest({
        action: "sendEmailOTP",
        payload: {
          account_id: +this.user_details?.account_id,
          // email_address: this.user_details?.email_address,
        },
      });

      this.handleOTPRedirect();
    },

    // =====================================
    // HANDLE USER OTP REDIRECT
    // =====================================
    handleOTPRedirect() {
      setTimeout(() => {
        this.$router.push({
          name: "VesicashVerifyOTP",
          params: { account_id: this.user_details?.account_id },
          query: { user_email: this.user_details?.email_address },
        });
      }, 1500);
    },
  },
};

export default authMixin;
