<template>
  <div>
    <!-- PAGE TITLE -->
    <div class="page-title primary-1-text grey-900 mgb-4">Password</div>

    <!-- PAGE META -->
    <div class="page-meta tertiary-2-text grey-600 mgb-24">
      Change your password here
    </div>

    <!-- FORM AREA -->
    <div class="settings-form-area">
      <!-- CURRENT PASSWORD -->
      <div class="page-input-block row">
        <div class="col-12 col-sm-4">
          <label class="form-label">Current Password</label>
        </div>

        <div class="col-12 col-sm-8">
          <FormFieldInput
            label_id="current-password"
            input_type="password"
            is_required
            placeholder="Current password"
            :custom_style="{ input_wrapper_style: 'form-suffix' }"
            :input_value="getFormFieldValueMx(form, 'current_password')"
            @getInputState="updateFormFieldMx($event, 'current_password')"
            :error_handler="{
              type: 'password',
              message: 'Password should contain at least 4 characters',
            }"
          />
        </div>
      </div>

      <!-- NEW PASSWORD -->
      <div class="page-input-block row">
        <div class="col-12 col-sm-4">
          <label class="form-label">New Password</label>
        </div>

        <div class="col-12 col-sm-8">
          <FormFieldInput
            label_id="new-password"
            input_type="password"
            is_required
            placeholder="New password"
            :custom_style="{ input_wrapper_style: 'form-suffix' }"
            :input_value="getFormFieldValueMx(form, 'new_password')"
            @getInputState="updateFormFieldMx($event, 'new_password')"
            :error_handler="{
              type: 'password',
              message: 'Password should contain at least 4 characters',
            }"
          />
        </div>
      </div>

      <!-- RETYPE PASSWORD -->
      <div class="page-input-block row">
        <div class="col-12 col-sm-4">
          <label class="form-label">Retype Password</label>
        </div>

        <div class="col-12 col-sm-8">
          <FormFieldInput
            label_id="confirm-password"
            input_type="password"
            is_required
            placeholder="Retype new password"
            :custom_style="{ input_wrapper_style: 'form-suffix' }"
            :input_value="getFormFieldValueMx(form, 'confirm_password')"
            @getInputState="updateFormFieldMx($event, 'confirm_password')"
            :error_handler="{
              type: 'password',
              message: 'Password should contain at least 4 characters',
            }"
          />

          <div
            class="error-message-text"
            v-if="
              getFormFieldValueMx(form, 'confirm_password').length &&
              !doesPasswordMatch
            "
          >
            Passwords don't match
          </div>
        </div>
      </div>

      <!-- BUTTON ROW -->
      <div class="btn-row mgt-10 row mgb-40">
        <div class="col-12 col-sm-4"></div>

        <div class="col-12 col-sm-8">
          <button
            class="btn btn-primary btn-md"
            ref="btnRef"
            :disabled="isDisabled"
            @click="updatePassword"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "PasswordSettings",

  metaInfo: {
    title: "Update Password",
    titleTemplate: "%s - Vesicash",
  },

  components: {},

  computed: {
    isFormValidated() {
      return this.validateFormFieldMx(this.form);
    },

    getRequestPayload() {
      return {
        account_id: this.getAccountId,
        new_password: this.getFormPayloadMx(this.form).new_password,
        old_password: this.getFormPayloadMx(this.form).current_password,
      };
    },

    doesPasswordMatch() {
      return (
        this.getFormPayloadMx(this.form).new_password ===
        this.getFormPayloadMx(this.form).confirm_password
      );
    },

    isDisabled() {
      return this.isFormValidated || !this.doesPasswordMatch;
    },
  },

  data() {
    return {
      form: {
        current_password: {
          validated: false,
          value: "",
        },
        new_password: { validated: false, value: "" },
        confirm_password: { validated: false, value: "" },
      },
    };
  },

  methods: {
    ...mapActions({ updateUserPassword: "settings/updateUserPassword" }),

    async updatePassword() {
      const response = await this.handleDataRequest({
        action: "updateUserPassword",
        payload: this.getRequestPayload,
        btn_text: "Update",
        alert_handler: {
          success: "Password has been updated successfully",
          error: "Unable to update your password",
        },
      });

      if (response.code === 200) {
        this.clearInputField();
      }
    },

    clearInputField() {
      Object.keys(form).forEach((key) => {
        form[key].value = "";
      });
    },
  },
};
</script>

<style></style>
