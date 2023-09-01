<template>
<div class="fp-section">
  <AuthWrapper
    title_text="Forgot password"
    meta_text="Please enter your registered email address  <br> that is associated with your account. "
  >
    <!-- AUTH PAGE -->
    <form @submit.prevent="handleUserForgotPassword" class="auth-page">
      <!-- EMAIL ADDRESS INPUT -->
      <div class="form-group">
        <FormFieldInput
          label_title="Email address"
          label_id="emailAddress"
          input_type="email"
          is_required
          placeholder="Enter email address"
          :input_value="getFormFieldValueMx(form, 'email_address')"
          @getInputState="updateFormFieldMx($event, 'email_address')"
          :error_handler="{
            type: 'email',
            message: 'Email address is not valid',
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
          Continue
        </button>
      </div>
    </form>
  </AuthWrapper>
</div>
</template>

<script>
import { mapActions } from "vuex";
import AuthWrapper from "@/modules/auth/components/auth-wrapper";

export default {
  name: "ForgotPassword",

  metaInfo: {
    title: "Forgot Password",
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
      return this.getFormPayloadMx(this.form);
    },
  },

  data() {
    return {
      form: {
        email_address: {
          validated: false,
          value: "",
        },
      },
    };
  },

  methods: {
    ...mapActions({ requestUserPassword: "auth/requestUserPassword" }),

    // =========================================
    // HANDLE USER CLIENT FORGOT PASSWORD BTN
    // =========================================
    async handleUserForgotPassword() {
      const response = await this.handleDataRequest({
        action: "requestUserPassword",
        payload: this.getRequestPayload,
        btn_text: "Continue",
        alert_handler: {
          success: "Password reset link has been sent to your email",
          error: "Email address provided, is not valid",
          request_error: "Provided email address is not registered.",
        },
      });

      if (response?.code === 200) {
        setTimeout(() => this.$router.push("/login"), 2000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fp-section {
    margin-top: toRem(100);
}
</style>
