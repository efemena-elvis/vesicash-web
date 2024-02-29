<template>
  <div>
    <div class="body-area">
      <div class="form-group">
        <div class="form-label">Select beneficiary</div>
        <div class="label-subtitle mgt--2 mgb-20">
          You can select from a list of already added beneficiaries
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
        @click="addGroupBeneficiary()"
      >
        Save beneficiary group
      </button>
    </div>
  </div>
</template>
      
<script>
import { mapActions } from "vuex";

export default {
  name: "ExistingBeneficiary",

  computed: {
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
      createUpdateBankGroup: "settings/createUpdateBankGroup",
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

    async addGroupBeneficiary() {
      const response = await this.handleDataRequest({
        action: "createUpdateBankGroup",
        payload: this.getGroupPayload,
        btn_text: "Save beneficiary group",
        alert_handler: {
          success: "Group beneficiary account created successfully",
          error: "Unable to save group beneficiary account",
          request_error: "Unable to save group beneficiary account",
        },
      });

      if (response.code === 201) {
        setTimeout(
          () =>
            this.$router
              .push({
                name: this.$route.name,
                query: { ...this.$route.query, refresh: true },
              })
              .catch((error) => {
                if (error.name != "NavigationDuplicated") throw error;
              }),
          1000
        );
      }
    },
  },
};
</script>
  
<style lang="scss" scoped>
.label-subtitle {
  @include font-height(13.5, 21);
}
</style>