const OTPMixin = {
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
    };
  },

  mounted() {
    // ==================================================
    // SET FIRST INPUT TO FOCUS STATE ON INITIAL MOUNT
    // ==================================================
    this.$nextTick(() => this.$refs?.otpOne?.focus());
  },
};

export default OTPMixin;
