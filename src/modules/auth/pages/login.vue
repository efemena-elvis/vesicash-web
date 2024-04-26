<template>
  <AuthWrapper
    :title_text="getLoginMessage"
    meta_text="Enter your login details to access your Vesicash dashboard."
  >
    <!-- AUTH PAGE -->
    <form @submit.prevent="handleUserLogIn">
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
            type: 'required',
            message: 'Password is a required field',
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
          class="btn btn-primary btn-md pdy-10 w-100"
          ref="btnRef"
          :disabled="isFormValidated"
        >
          Login to Dashboard
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
    };
  },

  methods: {
    ...mapActions({
      loginUser: "auth/loginUser",
      fetchAPIkeys: "developer/fetchAPIkeys",
      updateMerchantState: "general/updateMerchantState",
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
        // FETCH API KEY
        this.getAPIKeys();

        // CHECK IF USER EMAIL IS VERIFIED
        if (this.getUser?.verifications?.email) {
          this.updateMerchantState(
            response.data.user?.extra_data?.merchant ?? false
          );
          this.verifyUserOnboarding(response?.data);
        }
        // REDIRECT USER TO OTP VERIFICATION
        else {
          this.user_details = response.data.user;
          this.handleOTPInitiation();
        }
      }
    },

    verifyUserOnboarding(payload) {
      // const onboarding_fields = ["business_name", "business_type", "country"];
      // expecting the fileds to check to confirm RC number and director verification
      const onboarding_fields = ["business_type"];
      const business_data = payload?.profile?.business;
      const verifications = payload?.profile?.verifications;
      const verification_fields = ["cac"];

      const is_onboarded =
        onboarding_fields.every((field) => !!business_data[field]) &&
        verification_fields.every(
          (field) =>
            verifications.find((item) => item.verification_type === field)
              ?.is_verified
        );

      // /onboarding/business-details

      setTimeout(() => {
        location.href = is_onboarded ? "/dashboard" : "/dashboard";
      }, 1500);
    },

    async getAPIKeys() {
      await this.handleDataRequest({
        action: "fetchAPIkeys",
        show_alert: false,
      });
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
