<template>
  <div class="new-wallet-account">
    <!-- BANK ACCOUNT NO -->
    <div class="form-group">
      <BasicInput
        label_title="Wallet account ID"
        label_id="account_id"
        input_type="number"
        :input_value="form.account_id"
        is_required
        placeholder="Wallet account id"
        @getInputState="updateFormState($event, 'account_id')"
        :error_handler="{
          type: 'required',
          message: 'Enter wallet account id',
        }"
      />
    </div>

    <!-- ACCOUNT CONFIRM CARD -->
    <div
      class="account-confirm-card grey-10-bg rounded-12 mgt--10"
      v-if="account_details?.account_name || verification_message"
    >
      <div
        class="name tertiary-2-text"
        :class="invalid_account ? 'red-600' : 'grey-900'"
      >
        {{
          account_details ? account_details.account_name : verification_message
        }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import FormHelper from "@/modules/auth/mixins/auth-helper";

export default {
  name: "NewWalletAccount",

  mixins: [FormHelper],

  components: {
    BasicInput: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/form-comps/basic-input"
      ),
  },

  watch: {
    "form.account_id": {
      async handler(state) {
        this.account_details = null;

        if (state.length >= 10) await this.verifyAccount(state);
      },
    },
  },

  data: () => ({
    form: {
      account_id: "",
    },

    validity: {
      account_id: true,
    },

    account_details: null,
    verification_message: "",
    invalid_account: false,
  }),

  methods: {
    ...mapActions({
      verifyBankAccount: "general/verifyBankAccount",
    }),

    async verifyAccount(account_number, bank_code) {
      this.invalid_account = false;
      this.verification_message = "Verifying account...";

      const payload = {
        bank_code,
        account_number,
      };

      const response = await this.verifyBankAccount(payload);

      if (response?.status === "ok") {
        this.verification_message = "";
        this.account_details = response.data;

        this.$emit("bankDetailsUpdated", this.getNairaBankDetails);
      } else {
        this.verification_message =
          response?.message || "Please check account details";
        this.invalid_account = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.account-confirm-card {
  border: toRem(1) dashed getColor("grey-200");
  padding: toRem(14) toRem(16);
}
</style>
