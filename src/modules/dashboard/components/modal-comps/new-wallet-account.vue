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

export default {
  name: "NewWalletAccount",

  components: {},

  watch: {
    "form.account_id": {
      async handler(state) {
        this.account_details = null;

        if (state.length >= 10) await this.verifyWalletID(state);
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
      verifyWalletAccountID: "general/verifyWalletAccountID",
    }),

    async verifyWalletID(account_id) {
      this.invalid_account = false;
      this.verification_message = "Verifying account...";

      const response = await this.verifyWalletAccountID(account_id);

      if (response?.status === "ok") {
        this.verification_message = "";

        let response_payload = {
          account_name: response.data.firstname
            ? `${response.data.firstname} ${response.data.lastname}`
            : response.data.email_address,
          account_no: response.data.account_id,
          category: "wallet",
          bank_name: "Vesicash",
        };

        this.account_details = response_payload;

        this.$emit("bankDetailsUpdated", response_payload);
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
