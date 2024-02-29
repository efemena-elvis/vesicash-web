<template>
  <div>
    <div class="body-area">
      <div class="form-group">
        <div class="form-label">Select beneficiary</div>
        <div class="label-subtitle mgt--2 mgb-20">
          Select from a list of already added beneficiaries
        </div>

        <DropSelectInput
          placeholder="Select beneficiary"
          @multiSelected="selectBeneficiary($event)"
          :pre_select_multiple="pre_select_beneficiaries"
          :multi_options="beneficiaries"
          extend_value
          multi
        />
        <!-- allow_search -->
      </div>
    </div>

    <div class="footer-area pdb-30">
      <button
        ref="btnRef"
        :disabled="isDisabled"
        class="btn btn-primary btn-md pdy-10 wt-100"
        @click="addAccountToSendMoney()"
      >
        Add selected account
      </button>
    </div>
  </div>
</template>
        
  <script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ExistingBeneficiary",

  computed: {
    ...mapGetters({
      getRecipientAccounts: "payments/getRecipientAccounts",
    }),

    isDisabled() {
      return this.selected_beneficiaries.length ? false : true;
    },

    getGroupPayload() {
      const base_payload = {
        group_name: this.$route.query.name,
        accounts: [...this.selected_beneficiaries],
      };

      if (this.$route.query.group_id) {
        return {
          group_id: +this.$route.query.group_id,
          ...base_payload,
        };
      } else return base_payload;
    },
  },

  data() {
    return {
      pre_select_beneficiaries: [],
      beneficiaries: [],

      selected_beneficiaries: [],
    };
  },

  mounted() {
    this.fetchBeneficiaryList();
  },

  methods: {
    ...mapActions({
      fetchBankDetails: "dashboard/fetchBankDetails",
      addToAccountList: "payments/addToAccountList",
    }),

    async fetchBeneficiaryList() {
      const response = await this.handleDataRequest({
        action: "fetchBankDetails",
        payload: this.getAccountId,
        alert_handler: {
          error: "Unable to fetch user beneficiaries",
          request_error: "Unable to fetch user beneficiaries",
        },
      });

      if (response.code === 200) {
        this.beneficiaries = response.data.map((data) => {
          return {
            ...data,
            name: data.account_name,
            value: `${data.account_name} ${data.bank_name ? "&bull;" : ""} ${
              data.bank_name
            } &bull; ${data.account_no}`,
          };
        });
      }
    },

    selectBeneficiary(beneficiary) {
      this.selected_beneficiaries = beneficiary.map((data) => ({
        ...data,
        amount: 0,
      }));
    },

    addAccountToSendMoney() {
      let filtered_accounts = [];
      let duplicate_accounts = [];

      this.selected_beneficiaries.map((user) => {
        let account_found = this.getRecipientAccounts.find(
          (account) => account.account_no === user.account_no
        );

        if (!account_found) filtered_accounts.push(user);
        else duplicate_accounts.push(user);
      });

      if (duplicate_accounts.length)
        this.pushToast("Duplicated account has been filtered out", "warning");

      let updated_beneficiaries = filtered_accounts.map((account) => {
        return { ...account, amount: 0, charge_fee: 0 };
      });

      this.addToAccountList(updated_beneficiaries);
      this.$emit("closeTriggered");
    },
  },
};
</script>
    
  <style lang="scss" scoped>
.label-subtitle {
  @include font-height(13.5, 21);
}
</style>