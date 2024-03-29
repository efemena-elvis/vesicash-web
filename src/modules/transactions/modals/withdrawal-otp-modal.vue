<template>
  <ModalCover
    show_close_btn
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    class="verify-otp-modal"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title text-center mgt-20">Enter OTP code</div>

        <div class="tertiary-2-text text-center grey-600 mgt-12">
          Enter the OTP code we sent to
          <b>{{ getUserEmail }}</b> and
          <b>{{ getUserPhone }}</b>
          to transfer
          <b>
            {{
              `${$money.getSign(
                getWalletType.slug
              )}${$utils.formatCurrencyWithComma(
                Number(getUpdatedDisplayData.amount) -
                  getUpdatedDisplayData.charge
              )}`
            }}
          </b>
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
            ref="btnRef"
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
import { mapActions, mapGetters, mapMutations } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "WithdrawalOTPModal",

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
    ...mapGetters({
      getWalletType: "dashboard/getWalletType",
      getWithdrawalMeta: "dashboard/getWithdrawalMeta",
      getWithdrawalRequest: "dashboard/getWithdrawalRequest",
    }),

    getUserPhone() {
      return this.$utils.getAsterickedText(this.getUser?.phone, [3, 4, 5]);
    },

    getUserEmail() {
      const email_name = this.getUser?.email
        ? this.getUser?.email?.split("@")[0]
        : "";
      const domain = this.getUser?.email
        ? this.getUser?.email?.split("@")[1]
        : "";
      const astericed_protion = this.$utils.getAsterickedText(
        email_name,
        [3, 4, 5]
      );
      return `${astericed_protion}@${domain}`;
    },

    getUpdatedDisplayData() {
      if (Object.keys(this.getWithdrawalRequest).length) {
        return {
          amount: this.getWithdrawalRequest.amount,
          charge: 0,
        };
      } else
        return {
          amount: this.getWithdrawalMeta.amount,
          charge: this.getWithdrawalMeta.withdrawal_charge,
        };
    },

    getWithdrawalPayload() {
      return {
        account_id: +this.getAccountId,
        beneficiary_name:
          this.getWithdrawalMeta.selected_beneficiary.account_name,
        bank_account_number:
          this.getWithdrawalMeta.selected_beneficiary.account_no.toString(),
        bank_code:
          this.getWithdrawalMeta?.selected_beneficiary?.sort_code ??
          this.getWithdrawalMeta?.selected_beneficiary?.bank_code,
        amount: +this.getWithdrawalMeta.amount,
        currency: this.getWalletType.short,
        debit_currency: this.getWalletType.short,
        gateway: "rave",
        escrow_wallet: "no",
      };
    },

    getWalletTransferDetails() {
      return {
        sender_account_id: +this.getAccountId,
        recipient_account_id:
          +this.getWithdrawalMeta.selected_beneficiary.account_no,
        amount: +this.getWithdrawalMeta.amount,
        final_amount: +this.getWithdrawalMeta.amount,
        sender_currency: this.getWalletType.short,
        recipient_currency: this.getWalletType.short,
      };
    },

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
      sendUserOTP: "auth/sendUserOTP",
      verifyUserOTP: "auth/verifyUserOTP",
      walletToWalletTransfer: "transactions/walletToWalletTransfer",
      withdrawWalletFund: "dashboard/withdrawWalletFund",
      processWithdrawalRequest: "merchantDashboard/processWithdrawalRequest",
    }),

    ...mapMutations({ resetAuthToken: "auth/AUTH_RESET_TOKEN" }),

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
      let payload = {
        account_id: this.getAccountId,
        otp_token: this.getOTPToken,
      };

      const response = await this.handleDataRequest({
        action: "verifyUserOTP",
        payload,
        btn_text: "Verify OTP code",
        alert_handler: {
          error: "Unable to verify OTP token. Try again.",
          request_error: "You entered an invalid OTP",
        },
      });

      if (response.code === 200) {
        // RESET AUTH TOKEN
        this.resetAuthToken(response.data);

        // CHECK IF IT'S A WITHDRAWAL REQUEST
        if (Object.keys(this.getWithdrawalRequest).length)
          await this.initiateWithdrawalRequest();
        else await this.makeWithdrawal();
      }
    },

    // ===================================
    // SEND OUT OTP VERIFICATION CODE
    // ===================================
    sendOutOTPVerificationCode() {
      let payload = {
        account_id: this.getAccountId,
        is_withdrawal: true,
      };

      this.sendUserOTP(payload)
        .then((response) => {
          if (response?.code === 200) this.pushToast(`OTP sent`, "success");
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

    async makeWithdrawal() {
      this.$bus.$emit("show-page-loader", "Processing your transfer");

      try {
        this.handleClick("btnRef");

        const response =
          this.getWithdrawalMeta.selected_beneficiary.category === "wallet"
            ? await this.walletToWalletTransfer(this.getWalletTransferDetails)
            : await this.withdrawWalletFund(this.getWithdrawalPayload);

        this.$bus.$emit("hide-page-loader");
        this.handleClick("btnRef", "Continue", false);

        response?.code == 200
          ? this.$emit("done", {
              amount:
                this.getWithdrawalMeta.amount -
                this.getWithdrawalMeta.withdrawal_charge,
              currency: this.getWalletType.slug,
            })
          : this.pushToast(
              response.message || "Withdrawal failed. Please try again",
              "warning"
            );
      } catch (error) {
        console.log(error);
        this.$bus.$emit("hide-page-loader");
        this.handleClick("btnRef", "Continue", false);
        this.pushToast("Withdrawal failed. Please try again", "error");
      }
    },

    async initiateWithdrawalRequest() {
      const response = await this.handleDataRequest({
        action: "processWithdrawalRequest",
        payload: this.getWithdrawalRequest,
        alert_handler: {
          error: "Unable to request for withdrawal at this time",
          request_error: "Insufficient wallet balance",
        },
      });

      if (response.code === 200) {
        this.$router.push({
          name: "SuccessfulWithdrawal",
          query: {
            type: "pending",
            amount: this.getWithdrawalRequest.amount,
            currency: this.getWithdrawalRequest.currency,
          },
        });
      }
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
