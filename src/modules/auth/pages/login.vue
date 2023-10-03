<template>
  <div class="login-section">
    <AuthWrapper
      :title_text="getLoginMessage"
      meta_text="Please enter your login details below to gain access into your Vesicash dashboard"
    >
      <!-- AUTH PAGE -->
      <form @submit.prevent="handleUserLogIn" class="auth-page">
        <!-- EMAIL ADDRESS INPUT -->
        <div class="form-group">
          <FormFieldInput
            label_title="Email address"
            label_id="emailAddress"
            input_type="email"
            is_required
            placeholder="user@company.com"
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
        <div class="d-flex justify-content-start">
          <router-link
            :to="{ name: 'VesicashForgotPassword' }"
            class="tertiary-2-text"
            >Forgot Password?</router-link
          >
        </div>

        <!-- BUTTON AREA -->
        <div class="btn-area mgt-25 mgb-20">
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
  </div>
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

    getLoginMessage() {
      return this.getBusinessName
        ? `Welcome back, ${this.getBusinessName}`
        : "Access borderless payments";
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

      onboarding_paths: [
        "/onboarding/business-information",
        "/onboarding/business-verification",
        "/onboarding/identity-verification",
        "/onboarding/mor-deployment",
      ],

      default_onboarding_state: {
        is_completed: false,
        completed_routes: [],
      },
    };
  },

  methods: {
    ...mapActions({
      loginUser: "auth/loginUser",
      saveUserProfile: "settings/saveUserProfile",
      updateMerchantState: "general/updateMerchantState",
      updateOnboardingState: "general/updateOnboardingState",
    }),

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
          this.checkOnbordingCompletionStatus();
        }
        // REDIRECT USER TO OTP VERIFICATION
        else {
          this.user_details = response.data.user;
          this.handleOTPInitiation();
        }
      }
    },

    async checkOnbordingCompletionStatus() {
      const response = await this.handleDataRequest({
        action: "saveUserProfile",
        payload: {},
        alert_handler: {
          request_error: "User profile not found",
          not_found_error: "User profile not found",
        },
      });

      if (response.code === 200) {
        let user_extra_data = response.data.user?.extra_data;

        // EXTRACT COMPLETED STATE AND COMPLETED ROUTES
        let { is_completed, completed_routes } =
          user_extra_data?.onboarding ?? this.default_onboarding_state;

        // UPDATE AND PERSIST ONBOARDING AND MERCHANT DATA IN STORE
        this.updateOnboardingState({ is_completed, completed_routes });
        this.updateMerchantState(user_extra_data?.merchant ?? false);

        // NAVIGATE TO DASHBOARD IF ONBOARDING IS COMPLETE
        // IF NOT COMPLETE NAVIGATE TO ONBOARDING PROGRESS ROUTE
        location.href = is_completed
          ? "/dashboard"
          : this.onboarding_paths[completed_routes.length];
      } else {
        this.handleToastPushMx("Failed to proceed to login", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login-section {
  margin-top: toRem(100);

  @include breakpoint-down(sm) {
    margin-top: toRem(80);
  }

  @include breakpoint-down(xs) {
    margin-top: toRem(60);
  }
}
</style>
