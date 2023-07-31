<template>
  <div class="add-beneficiary-block rounded-16 grey-50-bg border-grey-100">
    <div class="input-rows">
      <!-- INPUT BLOCKS -->
      <div class="input-block">
        <!-- USER EMAIL ADDRESS -->
        <BasicInput
          input_type="email"
          is_required
          placeholder="Enter email address"
          :custom_style="{
            group_wrapper_style: 'input-field',
          }"
          :input_value="getFormFieldValueMx(form, 'email_address')"
          @getInputState="updateFormFieldMx($event, 'email_address')"
          :error_handler="{
            type: 'email',
            message: 'Email address is not valid',
          }"
        />

        <!-- USER PHONE NUMBER -->
        <BasicInput
          input_type="number"
          is_phone_type
          is_required
          placeholder="Enter phone number"
          :custom_style="{
            group_wrapper_style:
              'input-field input-field-phone position-relative',
            input_wrapper_style: 'form-prefix',
          }"
          :input_value="getFormFieldValueMx(form, 'phone_number')"
          @getInputState="updateFormFieldMx($event, 'phone_number')"
          :error_handler="{
            type: 'phone',
            message: 'Phone number is not valid',
          }"
        />
      </div>

      <!-- SELECT BLOCKS -->
      <div class="select-block">
        <!-- USER ROLE SELECTION -->
        <div class="select-field">
          <DropSelectInput
            placeholder="Select user role"
            @selectedOption="selectUserOption('role', $event)"
            :options="user_multiple_role_options"
            :pre_select="pre_select_role"
          />
        </div>

        <!-- USER ACCESS SELECTION -->
        <div class="select-field">
          <DropSelectInput
            placeholder="Select access"
            @selectedOption="selectUserOption('access', $event)"
            :options="user_access_options"
            :pre_select="pre_select_access"
          />
        </div>
      </div>

      <button
        class="btn btn-primary btn-md"
        ref="btnRef"
        :disabled="isFormValidated"
        @click="handleAddUser"
      >
        Add User
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import {
  MULTIPLE_ROLE_OPTIONS,
  USER_ACCESS_OPTIONS,
  USER_PAYOUT_OPTIONS,
} from "@/modules/transactions/constants";
export default {
  name: "AddBeneficiaryMultiBlock",

  components: {},

  computed: {
    ...mapGetters({
      getTransactionBeneficiaries: "transactions/getTransactionBeneficiaries",
    }),

    isFormValidated() {
      return this.validateFormFieldMx(this.form);
    },
  },

  data: () => ({
    form: {
      email_address: {
        validated: false,
        value: "",
      },
      phone_number: {
        validated: false,
        value: "",
      },
      country: {
        validated: true,
        value: "",
      },
      user_role: {
        validated: false,
        value: "",
      },
      user_access: {
        validated: false,
        value: "",
      },
    },

    pre_select_role: null,
    pre_select_access: null,

    user_multiple_role_options: MULTIPLE_ROLE_OPTIONS,
    user_access_options: USER_ACCESS_OPTIONS,
  }),

  created() {
    this.$bus.$on(
      "update-country-state",
      (value) => (this.form.country.value = value)
    );
  },

  methods: {
    ...mapMutations({
      UPDATE_TRANSACTION_BENEFICIARIES:
        "transactions/UPDATE_TRANSACTION_BENEFICIARIES",
    }),

    // ====================================
    // UPDATE USER SELECTION OPTION
    // ====================================
    selectUserOption(type, selected_id) {
      if (type === "role") {
        this.form.user_role.value = this.user_multiple_role_options.find(
          (user) => user.id === selected_id
        );
        this.form.user_role.validated = true;
      } else if (type === "access") {
        this.form.user_access.value = this.user_access_options.find(
          (user) => user.id === selected_id
        );
        this.form.user_access.validated = true;
      }
    },

    // ====================================================
    // CHECK IF USER ROLE MATCHED THEIR ACCESS LEVELS
    // ====================================================
    checkPartyState() {
      // BUYER CHECKS
      if (this.form.user_role?.value?.name === "Buyer") {
        if (this.form.user_access?.value?.name === "Mark as done") {
          this.pushToast(
            "A buyer cannot be assigned a 'Mark as done' access",
            "error"
          );
          return false;
        } else return true;
      }

      // SELLER CHECKS
      else if (this.form.user_role?.value?.name === "Seller") {
        if (this.form.user_access?.value?.name === "Approve") {
          this.pushToast(
            "A seller cannot be assigned an 'Approval' access",
            "error"
          );
          return false;
        } else return true;
      } else return true;
    },

    // ========================================
    // ADD A NEW USER TO BENEFICIARY LIST
    // ========================================
    handleAddUser() {
      if (!this.checkPartyState()) return true;

      let user_data = {};

      user_data.id = this.$utils.getRandomString(12);
      user_data.account_id = "";
      user_data.email_address = this.form.email_address.value;
      user_data.phone_number = this.form.phone_number.value;
      user_data.country = this.form.country.value;
      user_data.role = this.form.user_role.value;
      user_data.access = this.form.user_access.value;
      user_data.recipient = USER_PAYOUT_OPTIONS[1];
      user_data.amount = "";
      user_data.status = "Created";

      this.UPDATE_TRANSACTION_BENEFICIARIES([
        ...this.getTransactionBeneficiaries,
        user_data,
      ]);

      // CLEAR USER INPUT FIELD
      this.clearOutInput();
    },

    // ===============================
    // CLEAR OUT ALL NEW USER INPUT
    // ===============================
    clearOutInput() {
      this.form.phone_number.value = "";
      this.form.email_address.value = "";
      this.form.user_role.value = "";
      this.form.user_access.value = "";

      this.form.phone_number.validated = false;
      this.form.email_address.validated = false;
      this.form.user_role.validated = false;
      this.form.user_access.validated = false;

      this.pre_select_role = {};
      this.pre_select_access = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.add-beneficiary-block {
  width: 100%;
  padding: toRem(16);

  @include breakpoint-down(xl) {
  }

  .input-rows {
    @include flex-row-wrap("space-between", "flex-start");

    .input-block {
      @include flex-row-wrap("space-between", "flex-start");
      width: 48%;

      @include breakpoint-down(xl) {
        margin-bottom: toRem(20);
        width: 100%;
      }

      @include breakpoint-down(sm) {
        margin-bottom: 0;
      }

      .input-field {
        width: 48%;

        @include breakpoint-down(xl) {
          width: 49%;
        }

        @include breakpoint-down(sm) {
          margin-bottom: toRem(24);
          width: 100%;
        }
      }
    }

    .select-block {
      @include flex-row-wrap("space-between", "flex-start");
      width: 38%;

      @include breakpoint-down(xl) {
        width: 85%;
      }

      @include breakpoint-custom-down(820) {
        margin-bottom: toRem(20);
        width: 100%;
      }

      @include breakpoint-down(sm) {
        margin-bottom: 0;
      }

      .select-field {
        width: 48%;

        @include breakpoint-down(xl) {
          width: 49%;
        }

        @include breakpoint-down(sm) {
          margin-bottom: toRem(24);
          width: 100%;
        }
      }
    }

    .btn {
      padding: toRem(8.5) toRem(24);
    }
  }
}
</style>
