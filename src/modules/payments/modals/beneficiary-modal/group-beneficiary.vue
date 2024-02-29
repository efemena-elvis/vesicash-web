<template>
  <div>
    <div class="body-area">
      <!-- GROUP NAME INPUT -->
      <div class="form-group">
        <FormFieldInput
          label_title="Group name"
          label_id="groupName"
          is_required
          placeholder="Your beneficiary group name"
          :input_value="getFormFieldValueMx(form, 'group_name')"
          @getInputState="updateFormFieldMx($event, 'group_name')"
          :error_handler="{
            type: 'required',
            message: 'Enter beneficiary group name',
          }"
        />
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
  name: "GroupBeneficiary",

  computed: {
    isDisabled() {
      return this.form.group_name.value.length > 4 ? false : true;
    },
  },

  data() {
    return {
      form: {
        group_name: {
          validated: false,
          value: "",
        },
      },
    };
  },

  methods: {
    ...mapActions({
      createUpdateBankGroup: "settings/createUpdateBankGroup",
    }),

    async addGroupBeneficiary() {
      const response = await this.handleDataRequest({
        action: "createUpdateBankGroup",
        payload: {
          group_name: this.form.group_name.value,
          accounts: [],
        },
        btn_text: "Save beneficiary group",
        alert_handler: {
          success: "Beneficiary group created successfully",
          error: "Unable to save beneficiary group",
          request_error: "Unable to save beneficiary group",
        },
      });

      if (response.code === 201) {
        this.$router.push({
          name: "GroupBeneficiary",
          query: {
            name: this.form.group_name.value,
            group_id: response.data.id,
          },
        });
      }
    },
  },
};
</script>

