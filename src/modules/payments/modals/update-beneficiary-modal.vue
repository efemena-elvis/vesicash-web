<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Update account</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <ModalListItem
          title="Account name"
          :value="account_data.account_name"
        />
        <ModalListItem
          title="Account number"
          :value="account_data.account_no"
        />
        <ModalListItem title="Bank name" :value="account_data.bank_name" />

        <div class="mgt-10">
          <FormFieldInput
            label_title="Beneficiary amount"
            label_id="amount"
            input_type="number"
            is_required
            placeholder="Beneficiary amount"
            :input_value="getFormFieldValueMx(form, 'amount')"
            @getInputState="updateFormFieldMx($event, 'amount')"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <div class="btn-wrapper mgt-17">
          <button
            ref="btnRef"
            :disabled="isDisabled"
            class="btn btn-primary btn-md wt-100"
            @click="updateAccountAmount"
          >
            Update account
          </button>
        </div>
      </div>
    </template>
  </ModalCover>
</template>
    
    <script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";
import ModalListItem from "@/modules/dashboard/components/modal-comps/modal-list-item";

export default {
  name: "DeleteAccountModal",

  props: {
    account_data: {
      type: Object,
      default: () => ({}),
    },
  },

  components: {
    ModalCover,
    ModalListItem,
  },

  computed: {
    isDisabled() {
      return this.form.amount.value ? false : true;
    },

    updatePayload() {
      return {
        id: this.account_data.id,
        payload: { ...this.account_data, amount: +this.form.amount.value },
      };
    },
  },

  data() {
    return {
      form: {
        amount: {
          validated: true,
          value: this.account_data?.amount,
        },
      },
    };
  },

  methods: {
    ...mapActions({
      updateBeneficiaryAccount: "settings/updateBeneficiaryAccount",
    }),

    async updateAccountAmount() {
      const response = await this.handleDataRequest({
        action: "updateBeneficiaryAccount",
        payload: this.updatePayload,
        btn_text: "Update account",
        alert_handler: {
          success: `Beneficiary account updated successfully`,
          error: "Unable to update beneficiary account",
          request_error: "Unable to update beneficiary account",
        },
      });

      if (response.code === 200) {
        setTimeout(() => this.$emit("closeAndRelaodPage"), 1000);
      }
    },
  },
};
</script>
    
    <style lang="scss" scoped>
.btn-wrapper {
  @include flex-row-nowrap("flex-start", "center");
  gap: toRem(24);

  .btn {
    transition: background ease-in-out 0.3s !important;
  }

  @include breakpoint-custom-down(780) {
    @include flex-row-wrap("flex-start", "center");

    .btn-primary {
      order: 1;
    }

    .btn-secondary {
      order: 2;
    }
  }
}
</style>
    