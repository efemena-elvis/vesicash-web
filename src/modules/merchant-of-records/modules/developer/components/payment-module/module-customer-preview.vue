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

    <div class="row border-bottom-grey-200 mgb-24">
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

      <div class="col-12 col-sm-6">
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

      <div class="col-12 col-sm-6">
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

      <div class="col-12 col-sm-6">
        <div class="form-group">
          <FormFieldInput
            label_title="State"
            label_id="state"
            is_required
            placeholder="Your state"
            :input_value="getFormFieldValueMx(form, 'state')"
            @getInputState="updateFormFieldMx($event, 'state')"
            :error_handler="{
              type: 'required',
              message: 'State is required',
            }"
          />
        </div>
      </div>

      <div class="col-12 col-sm-6">
        <div class="form-group">
          <FormFieldInput
            label_title="Phone number"
            label_id="phoneNumber"
            is_required
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
    </div>

    <!-- TITLE TEXT -->
    <div class="title-text primary-1-text grey-900 mgb-24">SHIPPING TYPES</div>

    <FormCheckCard
      check_id="express"
      primary_text="Express delivery (Mainland) - 12hr"
      secondary_text="FREE"
    />

    <FormCheckCard
      check_id="mainland"
      primary_text="Main delivery (Mainland) - 6hr"
      secondary_text="N3,000"
    />

    <div class="mgt-24" v-if="show_cta">
      <button class="btn btn-md w-100 teal-800-bg neutral-10 pdy-10">
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import FormCheckCard from "@/shared/components/form-comps/form-check-card";

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

  data() {
    return {
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
        town_city: {
          validated: false,
          value: "",
        },
        state: {
          validated: false,
          value: "",
        },
        phone_number: {
          validated: false,
          value: "",
        },
      },

      business_type_options: [],
      user_details: {},
    };
  },
};
</script>

<style lang="scss" scoped>
.customer-preview {
  padding: toRem(24);
}
</style>