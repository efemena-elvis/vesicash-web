<template>
  <AuthWrapper title_text="Register a business account">
    <!-- AUTH PAGE -->
    <form @submit.prevent="handleUserRegister" class="auth-page">
      <!-- BUSINESS NAME INPUT -->
      <div class="form-group">
        <FormFieldInput
          label_title="Business name"
          label_id="businessName"
          placeholder="What is your business called?"
          :input_value="getFormFieldValueMx(form, 'business_name')"
          @getInputState="updateFormFieldMx($event, 'business_name')"
          :error_handler="{
            type: 'required',
            message: 'Business name is a required field',
          }"
        />
      </div>

      <!-- BUSINESS TYPE -->
      <div class="form-group">
        <div class="form-label">Business type</div>
        <DropSelectInput
          placeholder="Select business type"
          @selectedOption="selectBusinessType($event)"
          :options="business_type_options"
        />
      </div>

      <!-- FULLNAME INPUT -->
      <div class="form-group">
        <FormFieldInput
          label_title="Full name"
          label_id="fullName"
          is_required
          placeholder="Your full name"
          :input_value="getFormFieldValueMx(form, 'fullname')"
          @getInputState="updateFormFieldMx($event, 'fullname')"
          :error_handler="{
            type: 'minimum',
            minimum: 2,
            message: 'Full name should contain 2 words',
          }"
        />
      </div>

      <!-- PHONE INPUT -->
      <div class="form-group">
        <FormFieldInput
          label_title="Phone number"
          label_id="phoneNumber"
          input_type="number"
          is_phone_type
          is_required
          placeholder="Enter your phone number"
          :custom_style="{ input_wrapper_style: 'form-prefix' }"
          :input_value="getFormFieldValueMx(form, 'phone_number')"
          @getInputState="updateFormFieldMx($event, 'phone_number')"
          :error_handler="{
            type: 'phone',
            message: 'Phone number is not valid',
          }"
        />
      </div>

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
      <div class="form-group">
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

      <!-- TERMS AND CONDITION -->
      <div class="form-group">
        <div class="d-flex justify-content-start align-items-center">
          <input
            type="checkbox"
            v-model="form['accept_terms'].value"
            class="mgr-10"
          />

          <div class="tertiary-2-text grey-900">
            I agree to
            <a href="https://vesicash.com/terms">Terms and Conditions</a>
          </div>
        </div>
      </div>

      <!-- BUTTON AREA -->
      <div class="btn-area mgt-35 mgb-10">
        <button
          class="btn btn-primary btn-md w-100"
          ref="btnRef"
          :disabled="isFormValidated"
        >
          Register
        </button>
      </div>

      <!-- HELP BLOCK TEXT -->
      <div class="help-block text-center">
        Already have an account?
        <router-link to="/login" class="fw-medium">Login</router-link>
      </div>
    </form>
  </AuthWrapper>
</template>

<script>
import { mapActions } from "vuex";
import authMixin from "@/modules/auth/mixins/auth-mixin";
import AuthWrapper from "@/modules/auth/components/auth-wrapper";

export default {
  name: "RegisterPage",

  mixins: [authMixin],

  metaInfo: {
    title: "Register",
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
      let form_payload = this.getFormPayloadMx(this.form);
      let [firstname, lastname] = form_payload.fullname.split(" ");

      let request_payload = {
        ...form_payload,
        firstname,
        lastname,
      };

      delete request_payload.fullname;
      return request_payload;
    },
  },

  watch: {
    "form.accept_terms.value": {
      handler(value) {
        this.form.accept_terms.validated = value ? true : false;
      },
    },
  },

  data() {
    return {
      form: {
        business_name: {
          validated: false,
          value: "",
        },
        account_type: {
          validated: true,
          value: "business",
        },
        fullname: {
          validated: false,
          value: "",
        },
        business_type: {
          validated: true,
          value: "",
        },
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
        password: {
          validated: false,
          value: "",
        },
        accept_terms: {
          validated: false,
          value: false,
        },
      },

      business_type_options: [],
      user_details: {},
    };
  },

  created() {
    // ==========================================
    // UPDATE USER SELECTED COUNTRY STATE
    // ==========================================
    this.$bus.$on(
      "update-country-state",
      (country) => (this.form.country.value = country.toLowerCase())
    );
  },

  mounted() {
    this.fetchBusinessTypes();
  },

  methods: {
    ...mapActions({
      registerUser: "auth/registerUser",
      getBusinessTypes: "auth/getBusinessTypes",
    }),

    // ===========================================
    // HANDLE FETCHING OF AVAILABLE BUSINESS TYPES
    // ===========================================
    async fetchBusinessTypes() {
      const response = await this.handleDataRequest({
        action: "getBusinessTypes",
      });

      this.business_type_options = response?.code === 200 ? response.data : [];
    },

    // ===========================================
    // HANDLE BUSINESS TYPE USER SELECTION
    // ===========================================
    selectBusinessType(selected_id) {
      this.form.business_type.value = this.business_type_options.find(
        (business) => business.id === selected_id
      ).name;
      this.form.business_type.validated = true;
      console.log(this.form.business_type);
    },

    // ===========================================
    // HANDLE USER CLIENT REGISTRATION
    // ===========================================
    async handleUserRegister() {
      const response = await this.handleDataRequest({
        action: "registerUser",
        payload: this.getRequestPayload,
        btn_text: "Register",
        alert_handler: {
          success: "Your vesicash account has been created",
          error: "Unable to create your account at this time",
        },
      });
      if (response.code === 201) {
        this.user_details = response.data;
        this.handleOTPInitiation(); // SEND USER OTP
      }
      if (response?.code === 400) {
        const error_type = response.message.split(":")[0];
        if (error_type === "EmailAddress") {
          this.handleToastPushMx("Email address already exist!", "error");
        } else if (error_type === "PhoneNumber") {
          this.handleToastPushMx("Phone number already exist!", "error");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
