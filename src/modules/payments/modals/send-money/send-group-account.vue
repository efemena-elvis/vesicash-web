<template>
  <div>
    <div class="body-area">
      <div class="form-group">
        <div class="form-label">Select beneficiary group</div>
        <div class="label-subtitle mgt--2 mgb-20">
          Beneficiaries based on group category
        </div>

        <DropSelectInput
          placeholder="Select beneficiary group"
          @optionSelected="selectBeneficiary($event)"
          :pre_select="pre_select_beneficiaries"
          :options="beneficiaries"
          extend_value
        />
      </div>

      <div
        class="fetching-row green-50-bg rounded-10 mgt--10 mgb-24"
        v-if="selected_beneficiaries.length && show_validation_state"
      >
        <div>
          <div class="primary-2-text grey-700 mgb-2">
            {{
              group_validated
                ? "Accounts retrieved"
                : "Fetching group accounts..."
            }}
          </div>
          <div class="tertiary-3-text grey-600">
            {{ selected_beneficiaries[0]?.number_of_recipients }}
            {{
              selected_beneficiaries[0]?.number_of_recipients === 1
                ? "account"
                : "accounts"
            }}
          </div>
        </div>

        <div class="validated-state">
          <SuccessIcon v-if="group_validated" />
          <div class="loading rounded-circle" v-else></div>
        </div>
      </div>
    </div>

    <div class="footer-area pdb-30">
      <button
        ref="btnRef"
        :disabled="isDisabled"
        class="btn btn-primary btn-md pdy-10 wt-100"
        @click="addAccountToSendMoney()"
      >
        Add selected group
      </button>
    </div>
  </div>
</template>
          
<script>
import { mapActions, mapGetters } from "vuex";
import SuccessIcon from "@/shared/components/icon-comps/success-icon";

export default {
  name: "SendGroupAccount",

  components: {
    SuccessIcon,
  },

  computed: {
    ...mapGetters({
      getRecipientAccounts: "payments/getRecipientAccounts",
    }),

    isDisabled() {
      return this.selected_beneficiaries.length && this.group_validated
        ? false
        : true;
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
      pre_select_beneficiaries: {},
      beneficiaries: [],

      selected_beneficiaries: [],

      show_validation_state: false,
      group_validated: false,
      group_beneficiaries: [],
    };
  },

  mounted() {
    this.fetchGroups();
  },

  methods: {
    ...mapActions({
      addToAccountList: "payments/addToAccountList",
      fetchGroupAccounts: "settings/fetchGroupAccounts",
      fetchGroupBeneficiaryAccounts: "settings/fetchGroupBeneficiaryAccounts",
    }),

    async fetchGroups() {
      let response = await this.handleDataRequest({
        action: "fetchGroupAccounts",
        alert_handler: {
          error: "Unable to fetch beneficiary groups",
          not_found_error: "Beneficiary groups not found",
        },
      });

      if (response.code === 200) {
        this.beneficiaries = response.data.map((data) => {
          return {
            ...data,
            name: data.name,
            value: `${data.name} &bull; ${data.number_of_recipients} ${
              data.number_of_recipients === 1 ? "account" : "accounts"
            }`,
          };
        });
      }
    },

    selectBeneficiary(beneficiary) {
      this.show_validation_state = true;
      this.group_validated = false;

      this.selected_beneficiaries = [beneficiary];
      this.fetchGroupBeneficiaries(beneficiary.id);
    },

    async fetchGroupBeneficiaries(group_id) {
      let response = await this.handleDataRequest({
        action: "fetchGroupBeneficiaryAccounts",
        payload: { group_id },
        show_alert: false,
      });

      if (response.code === 200) {
        this.group_beneficiaries = response.data;
        this.group_validated = true;

        setTimeout(() => (this.show_validation_state = false), 2500);
      }
    },

    addAccountToSendMoney() {
      let filtered_accounts = [];
      let duplicate_accounts = [];

      this.group_beneficiaries.map((user) => {
        let account_found = this.getRecipientAccounts.find(
          (account) => account.account_no === user.account_no
        );

        if (!account_found) filtered_accounts.push(user);
        else duplicate_accounts.push(user);
      });

      if (duplicate_accounts.length)
        this.pushToast("Duplicated account has been filtered out", "warning");

      let updated_beneficiaries = filtered_accounts.map((account) => {
        return { ...account, amount: +account.amount, charge_fee: 0 };
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

.fetching-row {
  @include flex-row-nowrap("space-between", "center");
  padding: toRem(12);

  .validated-state {
    padding-right: toRem(6);

    .loading {
      @include draw-shape(24);
      background-color: getColor("green-300");
      animation: zoomInOut 0.8s ease-in-out infinite;
    }

    svg {
      @include draw-shape(30);
    }
  }
}
</style>