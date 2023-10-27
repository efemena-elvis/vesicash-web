<template>
  <div class="customer-preview neutral-10-bg rounded-8">
    <!-- TITLE TEXT -->
    <div class="title-text primary-1-text grey-900 mgb-24">
      CUSTOMER INFORMATION
    </div>

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

    <div class="col-12" v-show="getPaymentModuleConfig.request_phone_number">
      <div class="form-group">
        <FormFieldInput
          label_title="Phone number"
          label_id="phoneNumber"
          is_required
          input_type="number"
          placeholder="Your phone number"
          :input_value="getFormFieldValueMx(form, 'phone_number')"
          @getInputState="updateFormFieldMx($event, 'phone_number')"
          :error_handler="{
            type: 'required',
            message: 'Phone number is required',
          }"
        />
      </div>
    </div>

    <div
      class="row mgb-24"
      :class="
        getPaymentModuleConfig.is_shipping_type
          ? 'border-bottom-grey-200'
          : null
      "
    >
      <div class="col-12 col-sm-6">
        <div class="form-group">
          <FormFieldInput
            label_title="First name"
            label_id="firstName"
            is_required
            placeholder="Your first name"
            :input_value="getFormFieldValueMx(form, 'first_name')"
            @getInputState="updateFormFieldMx($event, 'first_name')"
            :error_handler="{
              type: 'required',
              message: 'First name is required',
            }"
          />
        </div>
      </div>

      <div class="col-12 col-sm-6">
        <div class="form-group">
          <FormFieldInput
            label_title="Last name"
            label_id="lastName"
            is_required
            placeholder="Your last name"
            :input_value="getFormFieldValueMx(form, 'last_name')"
            @getInputState="updateFormFieldMx($event, 'last_name')"
            :error_handler="{
              type: 'required',
              message: 'Last name is required',
            }"
          />
        </div>
      </div>

      <div
        class="col-12 col-sm-6"
        v-show="getPaymentModuleConfig.request_country"
      >
        <div class="form-group">
          <div class="form-label">Country</div>
          <DropSelectInput
            placeholder="Select country"
            :options="checkoutCountries"
          />
        </div>
      </div>

      <div
        class="col-12 col-sm-6"
        v-show="getPaymentModuleConfig.request_street_address"
      >
        <div class="form-group">
          <FormFieldInput
            label_title="Street address"
            label_id="streetAddress"
            is_required
            placeholder="Your street address"
            :input_value="getFormFieldValueMx(form, 'street_address')"
            @getInputState="updateFormFieldMx($event, 'street_address')"
            :error_handler="{
              type: 'required',
              message: 'Street address is required',
            }"
          />
        </div>
      </div>

      <div class="col-12 col-sm-6" v-if="false">
        <div class="form-group">
          <FormFieldInput
            label_title="Town/City"
            label_id="townCity"
            is_required
            placeholder="Your town/city"
            :input_value="getFormFieldValueMx(form, 'town_city')"
            @getInputState="updateFormFieldMx($event, 'town_city')"
            :error_handler="{
              type: 'required',
              message: 'Town/city is required',
            }"
          />
        </div>
      </div>
    </div>

    <div v-show="getPaymentModuleConfig.is_shipping_type">
      <!-- TITLE TEXT -->
      <div class="title-text primary-1-text grey-900 mgb-24">
        SHIPPING TYPES
      </div>

      <FormCheckCard
        v-for="(option, index) in getShippingOptions"
        :key="index"
        :checked="option.selected"
        :check_id="option.name + index"
        :primary_text="`${option?.name.length ? option?.name : '-'} ${
          option?.time.length ? '(' + option.time + ')' : ''
        }`"
        :secondary_text="
          option?.amount
            ? `${$utils.formatCurrency({
                input: option.currency_code.split(' ')[0],
                output: 'sign',
              })}${$utils.formatCurrencyWithComma(option.amount)}`
            : 'FREE'
        "
        @change="updateSelectedShippingType(index)"
      />
    </div>

    <div class="mgt-24" v-if="show_cta">
      <button
        class="btn btn-md w-100 teal-800-bg neutral-10 pdy-10"
        :style="{ backgroundColor: getPaymentModuleConfig.button_colour }"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import FormCheckCard from "@/shared/components/form-comps/form-check-card";
import countries from "@/utilities/countries";
import { serviceUtils } from "@/shared/services";

export default {
  name: "CustomerPreview",

  components: {
    FormCheckCard,
  },

  props: {
    show_cta: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    ...mapGetters({
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
    }),

    checkoutCountries() {
      return this.countries?.map((cc) => ({
        ...cc,
        name: cc.country,
        id: cc.code,
      }));
    },

    getShippingOptions() {
      return this.shipping_options;
    },
  },

  watch: {
    "getPaymentModuleConfig.shipping_types": {
      handler() {
        this.loadShippingTypes();
      },
    },

    form: {
      handler() {
        this.updateUserPaymentInfo();
      },
      deep: true,
    },
  },

  data() {
    return {
      serviceUtils,
      countries,

      form: {
        email_address: {
          validated: false,
          value: "",
        },
        first_name: {
          validated: false,
          value: "",
        },
        last_name: {
          validated: false,
          value: "",
        },
        street_address: {
          validated: false,
          value: "",
        },
        // town_city: {
        //   validated: false,
        //   value: "",
        // },
        // state: {
        //   validated: false,
        //   value: "",
        // },
        phone_number: {
          validated: false,
          value: "",
        },
      },

      business_type_options: [],
      user_details: {},

      shipping_options: [],
    };
  },

  mounted() {
    this.loadShippingTypes();
  },

  methods: {
    ...mapMutations({
      UPDATE_PAYMENT_COMPLETED_STATE:
        "merchantDeveloper/UPDATE_PAYMENT_COMPLETED_STATE",
      UPDATE_PAYMENT_INFO: "merchantDeveloper/UPDATE_PAYMENT_INFO",
      UPDATE_SELECTED_SHIPPING: "merchantDeveloper/UPDATE_SELECTED_SHIPPING",
    }),

    loadShippingTypes() {
      this.shipping_options = [];

      this.getPaymentModuleConfig.shipping_types.map((items) => {
        this.shipping_options.push({ ...items, selected: false });
      });
    },

    updateSelectedShippingType(index) {
      let selected_option = this.shipping_options[index];

      if (selected_option.selected) selected_option.selected = false;
      else selected_option.selected = true;

      this.shipping_options
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item) => (item.selected = false));

      this.$emit("shippingTypeSelected", selected_option);

      this.UPDATE_SELECTED_SHIPPING(
        selected_option.selected ? selected_option.name : ""
      );
    },

    updateUserPaymentInfo() {
      let { request_phone_number, request_street_address } =
        this.getPaymentModuleConfig;

      let {
        email_address,
        first_name,
        last_name,
        street_address,
        phone_number,
      } = this.getFormPayloadMx(this.form);

      this.UPDATE_PAYMENT_INFO({
        email_address,
        first_name,
        last_name,
        street_address,
        phone_number,
      });

      let mandatory_field = !!email_address && !!first_name && !!last_name;

      let paymentCompletedState;
      if (request_phone_number && request_street_address) {
        paymentCompletedState =
          mandatory_field && !!phone_number && !!street_address;
      } else if (request_phone_number) {
        paymentCompletedState = mandatory_field && !!phone_number;
      } else if (request_street_address) {
        paymentCompletedState = mandatory_field && !!street_address;
      } else {
        paymentCompletedState = mandatory_field;
      }

      this.UPDATE_PAYMENT_COMPLETED_STATE(paymentCompletedState);
    },
  },
};
</script>

<style lang="scss" scoped>
.customer-preview {
  padding: toRem(24);

  .btn {
    background: getColor("teal-800");
    color: getColor("neutral-10");

    &:hover {
      background: darken(getColor("teal-800"), 6%);
    }
  }
}
</style>
