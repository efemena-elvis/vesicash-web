<template>
  <AuthWrapper title_text="Login to your account">
    <!-- AUTH PAGE -->
    <form @submit.prevent="handleUserLogIn" class="auth-page">
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

      <!-- PASSWORD INPUT -->
      <div class="form-group mgb-13">
        <FormFieldInput
          label_title="Password"
          label_id="password"
          input_type="password"
          is_required
          placeholder="Enter password"
          :custom_style="{ input_wrapper_style: 'form-suffix' }"
          :input_value="getFormFieldValueMx(form, 'password')"
          @getInputState="updateFormFieldMx($event, 'password')"
          :error_handler="{
            type: 'password',
            message: 'Password should contain at least 4 characters',
          }"
        />
      </div>

      <!-- FORGOT PASSWORD LINK -->
      <div class="d-flex justify-content-end">
        <router-link
          :to="{ name: 'VesicashForgotPassword' }"
          class="tertiary-2-text"
          >Forgot Password?</router-link
        >
      </div>

      <!-- BUTTON AREA -->
      <div class="btn-area mgt-25 mgb-10">
        <button
          class="btn btn-primary btn-md w-100"
          ref="btnRef"
          :disabled="isFormValidated"
        >
          Login to account
        </button>
      </div>

      <!-- HELP BLOCK TEXT -->
      <div class="help-block text-center">
        Don’t have an account?
        <router-link to="/register" class="fw-medium">Register</router-link>
      </div>
    </form>
  </AuthWrapper>
</template>

<script>
import { mapActions } from "vuex";
import authMixin from "@/modules/auth/mixins/auth-mixin";
import AuthWrapper from "@/modules/auth/components/auth-wrapper";

export default {
  name: "LoginPage",

  mixins: [authMixin],

  metaInfo: {
    title: "Login",
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
        password: { validated: false, value: "" },
      },

      user_details: {},
    };
  },

  methods: {
    ...mapActions({ loginUser: "auth/loginUser" }),

    // ============================
    // HANDLE USER CLIENT LOGIN
    // ============================
    async handleUserLogIn() {
      const response = await this.handleDataRequest({
        action: "loginUser",
        payload: this.getRequestPayload,
        btn_text: "Login to account",
        alert_handler: {
          success: "User login was successful",
          error: "Unable to login to your account",
          request_error: "Login credentials is not valid",
          not_found_error: "User account is not registered.",
        },
      });

      // REDIRECT USER ON SUCCESS RESPONSE
      if (response?.code === 200) {
        // CHECK IF USER EMAIL IS VERIFIED
        const is_email_verified = this.getUser?.verifications?.email;

        if (is_email_verified) {
          setTimeout(() => (location.href = "/dashboard"), 2000);
        }
        // REDIRECT USER TO OTP VERIFICATION
        else {
          this.user_details = response.data.user;
          this.handleOTPInitiation();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
