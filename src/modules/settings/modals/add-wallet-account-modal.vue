<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Add wallet account</div>
        <div class="tertiary-2-text grey-600 wt-75">
          Add a new wallet account id
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <BasicInput
            label_title="Enter account id"
            label_id="acct-details"
            :input_value="form.id"
            is_required
            placeholder="Enter account id"
            @getInputState="updateFormState($event, 'account_id')"
            :error_handler="{
              type: 'minimum',
              message: 'Enter a valid account id',
              minimum: 10,
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
              account_details
                ? account_details.account_name
                : verification_message
            }}
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          :disabled="!account_details"
          ref="save"
          class="btn btn-primary btn-md wt-100"
          @click="addAccountDetails"
        >
          Add account
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "AddWalletAccountModal",

  components: {
    ModalCover,
  },

  props: {
    account_type: {
      type: String,
    },
  },

  computed: {},

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

    account_payload: {},
    account_details: null,
    verification_message: "",
    invalid_account: false,
  }),

  methods: {
    ...mapActions({
      verifyWalletAccountID: "general/verifyWalletAccountID",
      addNewBank: "settings/addNewBank",
    }),

    async addAccountDetails() {
      this.handleClick("save", "Adding account...");

      const response = await this.addNewBank({
        account_id: this.getAccountId,
        updates: this.account_payload,
      });

      if (response?.code === 200) {
        this.handleClick("save", "Updating bank list...");
        this.handleClick("save", "Add account", false);

        this.$emit("saved", "You have successfully added a wallet account");
      } else {
        this.handleClick("save", "Add account", false);
        this.pushToast(
          response.message || "Failed to add new wallet account",
          "warning"
        );
      }
    },

    async verifyWalletID(account_id) {
      this.invalid_account = false;
      this.verification_message = "Verifying account...";

      const response = await this.verifyWalletAccountID(account_id);

      if (response?.code === 200) {
        this.verification_message = "";

        this.account_payload = {
          account_name: response.data.firstname
            ? `${response.data.firstname} ${response.data.lastname}`
            : response.data.email_address,
          account_no: response.data.account_id,
          category: "wallet",
        };

        this.account_details = this.account_payload;
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
.modal-cover-body {
  min-height: toRem(110);
  height: auto;

  .account-confirm-card {
    border: toRem(1) dashed getColor("grey-200");
    margin-bottom: toRem(20);
    padding: toRem(14) toRem(16);
  }
}
</style>
