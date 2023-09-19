<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Add naira account</div>
        <div class="tertiary-2-text grey-600 wt-75">
          Add a new naira account
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div
          class="skeleton-loader bank-skeleton rounded-3 mgb-15"
          v-if="loading_banks"
        ></div>

        <div class="form-group" v-else>
          <div class="form-label">Select bank</div>

          <!-- SELECT INPUT FIELD -->
          <DropSelectInput
            placeholder="Select bank"
            :options="bank_name_options"
            :allow_search="true"
            @optionSelected="bank = $event"
            @searchItem="filterBankList"
          />
        </div>

        <div class="form-group">
          <BasicInput
            label_title="Enter your account number"
            label_id="acct-details"
            :input_value="form.account_number"
            is_required
            placeholder="Enter account number"
            @getInputState="updateFormState($event, 'account_number')"
            :error_handler="{
              type: 'minimum',
              message: 'Enter a valid account number',
              minimum: 10,
            }"
          />
        </div>

        <!-- ACCOUNT CONFIRM CARD -->
        <div
          class="account-confirm-card grey-10-bg rounded-12 mgt--10"
          v-if="account_details || verification_message"
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
  name: "AddLocalAccountModal",

  components: {
    ModalCover,
  },

  props: {
    account_type: {
      type: String,
    },

    selected_currency: {
      type: Object,
    },
  },

  computed: {
    getBankDetails() {
      return {
        account_name: this.account_details?.account_name,
        account_no: "" + this.account_details?.account_number,
        bank_id: this.bank.id,
        sort_code: this.bank.code,
        bank_name: this.bank.name,
        country: this.selected_currency.country.toLowerCase(),
        currency: this.selected_currency.short,
        category: this.account_type,
      };
    },
  },

  watch: {
    bank: {
      async handler(state) {
        this.account_details = null;
        // this.$emit("nairaBankUpdated", null);
        if (state && this.form.account_number.length >= 10)
          await this.verifyAccount(this.form.account_number, state.code);
      },
    },

    "form.account_number": {
      async handler(state) {
        this.account_details = null;
        // this.$emit("nairaBankUpdated", null);
        if (state.length >= 10 && this.bank)
          await this.verifyAccount(state, this.bank.code);
      },
    },
  },

  async mounted() {
    await this.fetchBanksInCountry();
  },

  data: () => ({
    bank_name_options_repo: [],
    bank_name_options: [],

    bank: null,
    form: {
      account_number: "",
    },

    validity: {
      account_number: true,
    },

    loading_banks: false,

    account_details: null,
    verification_message: "",
    invalid_account: false,
  }),

  methods: {
    ...mapActions({
      getAllBanks: "general/getAllBanks",
      verifyBankAccount: "general/verifyBankAccount",
      addNewBank: "settings/addNewBank",
      fetchAllBanks: "settings/fetchAllBanks",
    }),

    async addAccountDetails() {
      this.handleClick("save", "Adding account...");

      const response = await this.addNewBank({
        account_id: this.getAccountId,
        ...this.getBankDetails,
      });

      if ([200, 201].includes(response.code)) {
        this.handleClick("save", "Updating bank list...");
        await this.fetchAllBanks(this.getAccountId);
        this.handleClick("save", "Add account", false);
        this.$emit("saved", "You have successfully added another bank account");
      } else {
        this.handleClick("save", "Add account", false);
        this.pushToast(
          response.message || "Failed to add new bank account",
          "warning"
        );
      }
    },

    async fetchBanksInCountry() {
      this.loading_banks = true;
      const response = await this.getAllBanks({
        country_code: this.selected_currency.country.toLowerCase(),
      });
      this.loading_banks = false;

      if (response?.code === 200) {
        let bank_options = response.data;

        bank_options.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        });

        let filtered_banks = [];

        bank_options.map((bank) => {
          if (filtered_banks.findIndex((b) => b.code === bank.code) === -1)
            filtered_banks.push(bank);
        });

        this.bank_name_options_repo = this.bank_name_options = filtered_banks;
      }
    },

    async verifyAccount(account_number, bank_code) {
      this.invalid_account = false;
      this.verification_message = "Verifying account...";

      const payload = {
        bank_code,
        account_number,
      };

      const response = await this.verifyBankAccount(payload);

      if (response?.code === 200) {
        this.verification_message = "";
        this.account_details = response.data;
        // this.$emit("nairaBankUpdated", this.getBankDetails);
      } else {
        this.verification_message =
          response?.message || response?.status
            ? "Account number is invalid"
            : "Failed to verify account";
        this.invalid_account = true;
      }
    },

    // FILTER THROUGH BANK NAMES
    filterBankList($event) {
      let filtered_list = [];

      if ($event.length) {
        this.bank_name_options_repo.map((bank) => {
          if (bank.name.toLowerCase().includes($event.toLowerCase())) {
            filtered_list.push(bank);
          }
        });
        this.bank_name_options = filtered_list;
      } else this.bank_name_options = this.bank_name_options_repo;
    },
  },
};
</script>

<style lang="scss" scoped>
.account-confirm-card {
  border: toRem(1) dashed getColor("grey-200");
  margin-bottom: toRem(20);
  padding: toRem(14) toRem(16);
}

.bank-skeleton {
  height: toRem(35);
}
</style>
