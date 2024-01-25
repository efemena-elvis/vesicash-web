<template>
  <AuthWrapper title_text="Enter new password">
    <!-- AUTH PAGE -->
    <form @submit.prevent="handleUserResetPassword" class="auth-page">
      <!-- PASSWORD INPUT -->
      <div class="form-group mgb-13">
        <FormFieldInput
          label_title="New password"
          label_id="password"
          input_type="password"
          is_required
          placeholder="Enter new password"
          toggle_password
          :custom_style="{ input_wrapper_style: 'form-suffix' }"
          :input_value="getFormFieldValueMx(form, 'password')"
          @getInputState="updateFormFieldMx($event, 'password')"
          :error_handler="{
            type: 'password',
            message: 'Password should contain at least 4 characters',
          }"
        />
      </div>

      <!-- CONFIRM PASSWORD INPUT -->
      <div class="form-group mgb-13">
        <FormFieldInput
          label_title="Confirm password"
          label_id="newPassword"
          input_type="password"
          is_required
          placeholder="Enter new password"
          toggle_password
          :custom_style="{ input_wrapper_style: 'form-suffix' }"
          :input_value="getFormFieldValueMx(form, 'confirm_password')"
          @getInputState="updateFormFieldMx($event, 'confirm_password')"
          :error_handler="{
            type: 'password',
            message: 'Password should contain at least 4 characters',
          }"
        />
      </div>

      <!-- PASSWORD RESET TOKEN -->
      <div class="form-group mgb-13">
        <FormFieldInput
          label_title="Reset Token"
          label_id="resetToken"
          is_required
          placeholder="Enter reset token"
          :input_value="getFormFieldValueMx(form, 'token')"
          @getInputState="updateFormFieldMx($event, 'token')"
          :error_handler="{
            type: 'required',
            message: 'Reset token field is required',
          }"
        />
      </div>

      <!-- BUTTON AREA -->
      <div class="btn-area mgt-30 mgb-10">
        <button
          class="btn btn-primary btn-md w-100"
          ref="btnRef"
          :disabled="isFormValidated"
        >
          Reset Password
        </button>
      </div>
    </form>
  </AuthWrapper>
</template>

<script>
import { mapActions } from "vuex";
import AuthWrapper from "@/modules/auth/components/auth-wrapper";

export default {
  name: "ResetPassword",

  metaInfo: {
    title: "ResetPassword",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    AuthWrapper,
  },

  computed: {
    isFormValidated() {
      return this.validateFormFieldMx(this.form);
    },

    getRequestPayload() {
      let formPayload = this.getFormPayloadMx(this.form);
      formPayload.account_id = +this.$route.params.account_id;
      formPayload.token = +formPayload.token;

      delete formPayload.confirm_password;
      return formPayload;
    },
  },

  data() {
    return {
      form: {
        password: {
          validated: false,
          value: "",
        },
        confirm_password: {
          validated: false,
          value: "",
        },
        token: {
          validated: false,
          value: "",
        },
      },
    };
  },

  methods: {
    ...mapActions({ resetUserPassword: "auth/resetUserPassword" }),

    // =========================================
    // HANDLE USER CLIENT FORGOT PASSWORD BTN
    // =========================================
    async handleUserResetPassword() {
      if (this.form.password.value !== this.form.confirm_password.value) {
        this.handleToastPushMx("Password provided does not match", "error");
        return false;
      }

      const response = await this.handleDataRequest({
        action: "resetUserPassword",
        payload: this.getRequestPayload,
        btn_text: "Reset Password",
        alert_handler: {
          success: "",
          error: "Unable to reset password at this time",
          request_error: "Reset token has expired.",
        },
      });

      if (response?.code === 200) {
        this.$router.push({ name: "VesicashSuccessfulPasswordReset" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-section {
  margin-top: toRem(100);

  @include breakpoint-down(sm) {
    margin-top: toRem(80);
  }

  @include breakpoint-down(xs) {
    margin-top: toRem(60);
  }
}
</style>
