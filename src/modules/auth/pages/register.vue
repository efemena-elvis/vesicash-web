<template>
  <div class="register-container">
    <div class="about-vesicash">
      <div class="h1-text neutral-10">Business payments made easy.</div>

      <div class="h7-text grey-400 mgt-20">
        Access multiple markets across Africa in minutes.
      </div>
    </div>

    <form @submit.prevent="handleUserRegister" class="register-form">
      <div class="h3-text grey-900 mgb-30 text-center">
        Welcome to vesicash!
      </div>
      <!-- EMAIL ADDRESS INPUT -->
      <div class="form-group">
        <FormFieldInput
          autocomplete="off"
          label_title="Email address"
          label_subtitle="Please enter your company’s email address"
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

      <!-- PHONE INPUT -->
      <div class="form-group">
        <FormFieldInput
          label_title="Phone number"
          label_subtitle="Please enter your company’s phone number"
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

      <!-- PASSWORD INPUT -->
      <div class="form-group">
        <FormFieldInput
          label_title="Password"
          label_subtitle="Make sure to use a very strong password"
          label_id="password"
          input_type="password"
          is_required
          placeholder="Enter password"
          :custom_style="{ input_wrapper_style: 'form-suffix' }"
          :input_value="getFormFieldValueMx(form, 'password')"
          @getInputState="updateFormFieldMx($event, 'password')"
          :error_handler="{
            type: 'password',
            message: '',
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
            I agree to Vesicash
            <a href="https://vesicash.com/terms">Terms and Conditions</a>
          </div>
        </div>
      </div>

      <!-- BUTTON AREA -->
      <div class="btn-area mgt-35 mgb-20">
        <button
          class="btn btn-primary btn-md w-100"
          ref="btnRef"
          :disabled="isFormValidated"
        >
          Create an Account
        </button>
      </div>

      <!-- HELP BLOCK TEXT -->
      <div class="help-block text-center">
        Already have an account?
        <router-link to="/login" class="fw-medium">Login</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CountryHelper from "@/shared/mixins/mixin-country-helper";
import authMixin from "@/modules/auth/mixins/auth-mixin";
import AuthWrapper from "@/modules/auth/components/auth-wrapper";
import countries from "@/utilities/countries";

export default {
  name: "RegisterPage",

  mixins: [authMixin, CountryHelper],

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
      // let [firstname, lastname] = form_payload.fullname.split(" ");

      // firstname,
      // lastname,
      let request_payload = {
        ...form_payload,
        phone_number: this.sanitizeUserPhoneNumber(form_payload.phone_number),
      };

      // delete request_payload.fullname;
      return request_payload;
    },

    isBusinessEmail() {
      const { email_address } = this.getFormPayloadMx(this.form);
      return this.validateUserEmailAddress(email_address);
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
        // business_name: {
        //   validated: false,
        //   value: "",
        // },
        account_type: {
          validated: true,
          value: "business",
        },
        // fullname: {
        //   validated: false,
        //   value: "",
        // },
        // business_type: {
        //   validated: true,
        //   value: "",
        // },
        email_address: {
          validated: false,
          value: "",
        },
        phone_number: {
          validated: false,
          value: "",
        },
        // country: {
        //   validated: false,
        //   value: "",
        // },
        password: {
          validated: false,
          value: "",
        },
        accept_terms: {
          validated: false,
          value: false,
        },
      },

      show_country: false,
      business_type_options: [],
      user_details: {},

      country_selected_code: "234",
    };
  },

  created() {
    // ==========================================
    // UPDATE USER SELECTED COUNTRY STATE
    // ==========================================
    this.$bus.$on("update-country-state", (country) => {
      this.country_selected_code = countries.find(
        (data) => data.country === country
      ).dialing_code;

      // this.form.country.value = country.toLowerCase();
    });
  },

  methods: {
    ...mapActions({
      registerUser: "auth/registerUser",
    }),

    sanitizeUserPhoneNumber(phone_number) {
      return this.sanitizePhone(this.country_selected_code, phone_number);
    },

    // ===========================================
    // HANDLE BUSINESS TYPE USER SELECTION
    // ===========================================
    selectBusinessType(selected_id) {
      this.form.business_type.value = this.business_type_options.find(
        (business) => business.id === selected_id
      ).name;
      this.form.business_type.validated = true;
    },

    toggleShowCountry() {
      this.show_country = !this.show_country;
    },

    // ===========================================
    // HANDLE USER CLIENT REGISTRATION
    // ===========================================
    async handleUserRegister() {
      if (!this.isBusinessEmail) {
        this.handleToastPushMx(
          "Email address is not a business email",
          "error"
        );
        return;
      }

      try {
        // VALIDATE USER PASSWORD STRENGTH
        this.$validate.validatePasswordStrength(
          this.getRequestPayload.password
        );

        // const response = await this.handleDataRequest({
        //   action: "registerUser",
        //   payload: this.getRequestPayload,
        //   btn_text: "Register",
        //   alert_handler: {
        //     success: "Your vesicash account has been created",
        //     error: "Unable to create your account at this time",
        //   },
        // });

        // if (response.code === 201) {
        //   this.user_details = response.data;
        //   this.handleOTPInitiation(); // SEND USER OTP
        //   localStorage.clear();
        // }

        // if (response?.code === 400) {
        //   this.handleToastPushMx(
        //     this.$utils.capitalizeFirstLetter(response?.message) ??
        //       "An error occured while creating account",
        //     "error"
        //   );
        // }
      } catch (error) {
        this.handleToastPushMx(error.message, "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.register-container {
  @include flex-row-wrap("space-between", "start");

  .about-vesicash {
    width: 51%;
    margin-top: toRem(80);

    @include breakpoint-custom-down(1140) {
      display: none;
    }
  }

  .register-form {
    width: 40%;
    max-width: toRem(450);
    background: getColor("neutral-10");
    padding: toRem(24);
    border-radius: toRem(16);
    box-shadow: 1px 1px 10px 0px rgba(217, 222, 224, 0.5),
      -1px -1px 10px 0px rgba(217, 221, 224, 0.5);

    @include breakpoint-custom-down(1140) {
      width: toRem(500);
      max-width: 100%;
      margin: auto;
    }
  }
}
</style>
