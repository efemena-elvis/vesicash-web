<template>
  <div class="register-wrapper">
    <AuthWrapper
      title_text="Access multiple markets across Africa in a minute."
    >
      <!-- meta_text="Register a business account today to gain access to customers across African markets" -->
      <!-- AUTH PAGE -->
      <form @submit.prevent="handleUserRegister" class="auth-page">
        <!-- BUSINESS NAME INPUT -->
        <!-- <div class="form-group">
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
        </div> -->

        <!-- EMAIL ADDRESS INPUT -->
        <div class="form-group">
          <FormFieldInput
            autocomplete="off"
            label_title="Business email address"
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
    </AuthWrapper>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import authMixin from "@/modules/auth/mixins/auth-mixin";
import AuthWrapper from "@/modules/auth/components/auth-wrapper";
import countries from "@/utilities/countries";

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

      this.form.country.value = country.toLowerCase();
    });
  },

  mounted() {
    // this.fetchBusinessTypes();
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

      const response = await this.handleDataRequest({
        action: "registerUser",
        payload: this.getRequestPayload,
        btn_text: "Register",
        alert_handler: {
          success: "Your vesicash account has been created",
          error: "Unable to create your account at this time",
        },
      });

      // const status = [200, 201].includes(response?.code);
      // const data = status ? response?.data : this.getRequestPayload;

      // window?.fbq("track", "CompleteRegistration", {
      //   customer_name: `${data?.lastname} ${data?.firstname}`,
      //   customer_email: data.email_address,
      //   status,
      // });

      if (response.code === 201) {
        this.user_details = response.data;
        this.handleOTPInitiation(); // SEND USER OTP
        localStorage.clear();
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

<style lang="scss" scoped>
.register-wrapper {
  margin-top: toRem(40);

  @include breakpoint-down(sm) {
    margin-top: toRem(30);
  }
}
</style>
