<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    show_close_btn
    place_center
    class="verify-input-modal"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">
          Verify {{ email ? "email address" : "phone number" }}
        </div>

        <div class="tertiary-2-text grey-600 mgt-10">
          An OTP code will be sent to the
          {{ email ? "email address" : "phone number" }} you have provided
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="position-relative">
          <template v-if="email">
            <FormFieldInput
              label_id="emailAddress"
              input_type="email"
              is_required
              placeholder="Enter your email address"
              :is_disabled="isEmailVerified"
              :input_value="getFormFieldValueMx(form, 'email_address')"
              @getInputState="updateFormFieldMx($event, 'email_address')"
              :error_handler="{
                type: 'email',
                message: 'Email address is not valid',
              }"
            />
          </template>

          <template v-else>
            <FormFieldInput
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
          </template>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          ref="continue"
          class="btn btn-primary btn-md wt-100"
          @click="requestOTP"
          :disabled="!isDisabled"
        >
          Continue
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import countries from "@/utilities/countries";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "VerifyInputModal",

  components: {
    ModalCover,
  },

  props: {
    email: {
      type: Boolean,
      default: false,
    },

    input: {
      type: String,
      default: "",
    },
  },

  computed: {
    isDisabled() {
      let { email_address, phone_number } = this.getFormPayloadMx(this.form);
      return this.email ? !!email_address : !!phone_number;
    },
  },

  watch: {
    input: {
      handler(data) {
        if (this.email) {
          this.form.email_address.value = data;
          this.form.email_address.validated = !data;
        } else {
          this.form.phone_number.value = data;
          this.form.phone_number.validated = !data;
        }
      },
      immediate: true,
    },
  },

  data() {
    return {
      country_code: "",

      form: {
        email_address: {
          validated: false,
          value: "",
        },
        phone_number: {
          validated: false,
          value: "",
        },
      },
    };
  },

  created() {
    // ==========================================
    // UPDATE USER SELECTED COUNTRY STATE
    // ==========================================
    this.$bus.$on("update-country-state", (country) =>
      this.extractCountryCode(country)
    );
  },

  methods: {
    ...mapActions({
      sendUserOTP: "settings/requestOTP",
      sendEmailOTP: "settings/requestEmailOTP",
    }),

    extractCountryCode(country_name) {
      this.country_code = countries.find(
        (country) => country.country === country_name
      ).dialing_code;
    },

    requestOTP() {
      this.handleClick("continue");

      let request_payload = {
        account_id: this.getAccountId,
        // phone_number: this.form.phone_number.value,
      };

      let request_email_otp_payload = {
        account_id: this.getAccountId,
        email_address: this.form.email_address.value,
      };

      const payload = this.email ? request_email_otp_payload : request_payload;
      const action = this.email ? "sendEmailOTP" : "sendUserOTP";

      const input_type = this.email
        ? this.form.email_address.value
        : this.form.phone_number.value;

      this[action](payload)
        .then((response) => {
          this.handleClick("continue", "Continue", false);

          if (response?.code === 200) {
            this.pushToast(
              `An OTP code has been sent to ${input_type}`,
              "success"
            );
            this.$emit(
              "continue",
              this.email
                ? this.form.email_address.value
                : this.form.phone_number.value
            );
          } else {
            this.pushToast(response.message, "error");
          }
        })
        .catch(() => {
          this.handleClick("continue", "Continue", false);
          this.pushToast("Unable to generate an OTP code", "error");
        });
    },
  },
};
</script>

<style lang="scss">
.verify-input-modal {
  .modal-cover-body {
    min-height: 12vh;
  }
}
</style>
