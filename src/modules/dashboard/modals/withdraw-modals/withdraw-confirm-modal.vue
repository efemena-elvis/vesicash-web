<template>
  <div>
    <div class="mgb-24">
      <ModalListItem
        title="Total Amount"
        :value="`${$money.getSign(
          getWalletType.slug
        )}${$utils.formatCurrencyWithComma(getWithdrawalMeta.amount)}`"
      />
      <ModalListItem
        title="Withdrawal fee"
        :value="`${$money.getSign(
          getWalletType.slug
        )}${$utils.formatCurrencyWithComma(
          getWithdrawalMeta.withdrawal_charge
        )}`"
      />
      <ModalListItem
        title="Amount to receive"
        :value="`${$money.getSign(
          getWalletType.slug
        )}${$utils.formatCurrencyWithComma(
          Number(getWithdrawalMeta.amount) - getWithdrawalMeta.withdrawal_charge
        )}`"
      />

      <template v-if="getWalletType.slug === 'naira'">
        <ModalListItem
          v-if="getWithdrawalMeta.selected_beneficiary.category !== 'wallet'"
          title="Bank name"
          :value="getWithdrawalMeta.selected_beneficiary.bank_name"
        />
        <ModalListItem
          :title="
            getWithdrawalMeta.selected_beneficiary.category === 'wallet'
              ? 'Account ID'
              : 'Account number'
          "
          :value="getWithdrawalMeta.selected_beneficiary.account_no"
        />
        <ModalListItem
          title="Account name"
          :value="getWithdrawalMeta.selected_beneficiary.account_name"
        />
      </template>

      <template v-else>
        <ModalListItem title="Country" :value="getWithdrawalMeta.country" />
        <!-- <ModalListItem title="Phone number" :value="getWithdrawalMeta.phone" /> -->
        <ModalListItem
          title="First name"
          :value="getWithdrawalMeta.first_name"
        />
        <ModalListItem title="Last name" :value="getWithdrawalMeta.last_name" />
        <ModalListItem title="Bank name" :value="getWithdrawalMeta.bank_name" />
        <ModalListItem
          title="Iban/Account no."
          :value="getWithdrawalMeta.iban"
        />
        <ModalListItem
          title="Swift code"
          :value="getWithdrawalMeta.swift_code"
        />
        <ModalListItem title="Sort code" :value="getWithdrawalMeta.sort_code" />
        <ModalListItem
          title="Bank Address"
          :value="getWithdrawalMeta.bank_address"
        />
      </template>
    </div>

    <!-- MODAL COVER FOOTER -->
    <div class="pdb-30">
      <button
        class="btn btn-primary btn-md wt-100"
        ref="continue"
        @click="sendOutOTPVerificationCode"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";

export default {
  name: "WithdrawConfirmModal",

  components: {
    ModalCover,
    PageBackBtn,
    ModalListItem: () =>
      import(
        /* webpackChunkName: "dashboard-modal-module" */ "@/modules/dashboard/components/modal-comps/modal-list-item"
      ),
  },

  computed: {
    ...mapGetters({
      getWalletType: "dashboard/getWalletType",
      getWithdrawalMeta: "dashboard/getWithdrawalMeta",
    }),
  },

  methods: {
    ...mapActions({
      sendUserOTP: "auth/sendUserOTP",
    }),

    // ===================================
    // SEND OUT OTP VERIFICATION CODE
    // ===================================
    sendOutOTPVerificationCode() {
      let payload = {
        account_id: this.getAccountId,
        is_withdrawal: true,
      };

      this.handleClick("continue");

      this.sendUserOTP(payload)
        .then((response) => {
          this.handleClick("continue", "Continue", false);
          if (response?.code === 200) {
            this.$emit("verifyWithdrawalOTP");
          } else
            this.pushToast(
              response.message ||
                "Failed to generate OTP for this withdarwal. Try again.",
              "warning"
            );
        })
        .catch(() => {
          this.handleClick("continue", "Continue", false);
          this.pushToast("Unable to generate an OTP code", "error");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
