<template>
  <div>
    <div class="body-area">
      <!-- ACCOUNT NUMBER INPUT -->
      <div class="form-group">
        <FormFieldInput
          label_title="Account number"
          label_id="account_number"
          input_type="number"
          is_required
          placeholder="Your account number"
          :input_value="getFormFieldValueMx(form, 'account_number')"
          @getInputState="updateFormFieldMx($event, 'account_number')"
          :error_handler="{
            type: 'required',
            message: 'Enter your account number',
          }"
        />
      </div>

      <!-- SELECT BANK NAME -->
      <div class="form-group">
        <div class="form-label">Select bank</div>

        <!-- SELECT INPUT FIELD -->
        <DropSelectInput
          placeholder="Select bank name"
          :options="bank_name_options"
          :allow_search="true"
          @optionSelected="bank = $event"
          @searchItem="filterBankList"
        />
      </div>

      <!-- ACCOUNT CONFIRM CARD -->
      <div
        class="account-confirm-card grey-10-bg rounded-12 mgt--10 mgb-14"
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

    <!-- MODAL COVER FOOTER -->
    <div class="footer-area pdb-30">
      <button
        ref="btnRef"
        :disabled="isDisabled"
        @click="addAccountToSendMoney"
        class="btn btn-primary btn-md pdy-10 wt-100"
      >
        Add account
      </button>
    </div>
  </div>
</template>
      
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "SendSingleAccount",

  computed: {
    ...mapGetters({
      getRecipientAccounts: "payments/getRecipientAccounts",
    }),

    getBusinessInfo() {
      let { business_country, currency } = this.getUser;

      return {
        country: business_country?.toLowerCase(),
        currency,
      };
    },

    getBankDetails() {
      return {
        account_id: this.getAccountId,
        account_name: this.account_details?.account_name,
        account_no: this.account_details?.account_number,
        bank_name: this.bank.name,
        sort_code: this.bank.code,
        country: this.getBusinessInfo.country,
        currency: this.getBusinessInfo.currency,
      };
    },

    getGroupPayload() {
      const base_payload = {
        group_name: this.$route.query.name,
        accounts: [{ ...this.getBankDetails, amount: +this.form.amount.value }],
      };

      if (this.$route.query.group_id) {
        return {
          group_id: +this.$route.query.group_id,
          ...base_payload,
        };
      } else return base_payload;
    },

    isDisabled() {
      return this.account_details?.account_name?.length ? false : true;
    },
  },

  watch: {
    bank: {
      async handler(state) {
        this.account_details = null;

        if (state && this.form.account_number.value.length >= 10)
          await this.verifyAccount(this.form.account_number.value, state.code);
      },
    },

    "form.account_number.value": {
      async handler(state) {
        this.account_details = null;

        if (state.length >= 10 && this.bank)
          await this.verifyAccount(state, this.bank.code);
      },
    },
  },

  data() {
    return {
      bank_name_options_repo: [],
      bank_name_options: [],
      bank: null,

      form: {
        account_number: {
          validated: false,
          value: "",
        },
      },

      beneficiary_list: [],

      account_details: null,
      verification_message: "",
      invalid_account: false,
    };
  },

  async mounted() {
    await this.fetchBankList();
    await this.fetchBeneficiaries();
  },

  methods: {
    ...mapActions({
      getAllBanks: "general/getAllBanks",
      fetchBankDetails: "dashboard/fetchBankDetails",
      verifyBankAccount: "general/verifyBankAccount",
      addToAccountList: "payments/addToAccountList",
    }),

    async fetchBankList() {
      const response = await this.handleDataRequest({
        action: "getAllBanks",
        payload: {
          country_code: this.getBusinessInfo.country,
        },
        show_alert: false,
      });

      if (response?.code === 200) {
        let bank_options = response.data.sort((a, b) => {
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

    async fetchBeneficiaries() {
      let response = await this.handleDataRequest({
        action: "fetchBankDetails",
        payload: this.getAccountId,
        show_alert: false,
      });

      if (response.code === 200) {
        this.beneficiary_list = response.data;
      }
    },

    async verifyAccount(account_number, bank_code) {
      this.invalid_account = false;
      this.verification_message = "Verifying bank details...";

      const response = await this.handleDataRequest({
        action: "verifyBankAccount",
        payload: {
          bank_code,
          account_number,
        },
        alert_handler: {
          error: "Unable to verify bank details",
        },
      });

      if (response?.code === 200) {
        this.verification_message = "";
        this.account_details = response.data;
      } else {
        this.verification_message =
          response?.message || "Please check account details";
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

    addAccountToSendMoney() {
      // ADD AMOUNT AND CHARGE PAYLOAD TO ACCOUNT DETAILS
      let account_found = this.getRecipientAccounts.find(
        (account) => account.account_no === this.getBankDetails.account_no
      );

      if (!account_found) {
        const account_payload = [
          { ...this.getBankDetails, amount: 0, charge_fee: 0 },
        ];

        this.addToAccountList(account_payload);
        this.$emit("closeTriggered");
      } else {
        this.pushToast("Duplicated account cannot be added", "warning");
        return false;
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
      