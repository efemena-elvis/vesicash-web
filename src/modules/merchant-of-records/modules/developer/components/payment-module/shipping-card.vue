<template>
  <div class="shipping-card rounded-8 border-grey-100 mgb-24">
    <div class="form-group">
      <FormFieldInput
        :label_id="`shippingType${id}`"
        is_required
        placeholder="Enter shipping type"
        :input_value="getFormFieldValueMx(form, 'shipping_type')"
        @getInputState="updateFormFieldMx($event, 'shipping_type')"
        :error_handler="{
          type: 'required',
          message: 'Shipping type is required',
        }"
      />
    </div>

    <div class="row mgb-12 ship-row">
      <div class="col-12 col-sm-6">
        <FormFieldInput
          :label_id="`duration${id}`"
          is_required
          placeholder="12 hours"
          :input_value="getFormFieldValueMx(form, 'duration')"
          @getInputState="updateFormFieldMx($event, 'duration')"
          :error_handler="{
            type: 'required',
            message: 'Duration is required',
          }"
        />
      </div>

      <div class="col-12 col-sm-6">
        <FormFieldInput
          :label_id="`amoount${id}`"
          input_type="number"
          is_required
          placeholder="0.00"
          :prefix_value="currency"
          :custom_style="{
            input_wrapper_style: 'form-prefix form-prefix-right',
          }"
          :input_value="getFormFieldValueMx(form, 'shipping_amount')"
          @getInputState="updateFormFieldMx($event, 'shipping_amount')"
          :error_handler="{
            type: 'required',
            message: 'Amount field is required',
          }"
        />
      </div>
    </div>

    <div class="help-text grey-600 tertiary-3-text">
      Please note: Your time interval can be in hours, days or months, for free
      deliveries input 0 in the price
    </div>

    <button class="btn btn-sm btn-alert remove-btn" @click="$emit('remove')">
      Remove
    </button>
  </div>
</template>

<script>
export default {
  name: "ShippingCard",

  props: {
    currency: {
      type: String,
      default: "NGN (₦)",
    },

    id: {
      type: [String, Number],
      default: "Card",
    },

    default_form: {
      type: Object,
      default: () => ({
        shipping_type: {
          validated: false,
          value: "",
        },
        duration: {
          validated: false,
          value: "",
        },
        shipping_amount: {
          validated: false,
          value: "",
        },
      }),
    },
  },

  mounted() {
    this.form = { ...this.default_form };
  },

  watch: {
    // form: {
    //   handler(form) {
    //
    //     this.$emit("change", form);
    //   },
    // },

    default_form: {
      handler(form) {
        this.form = { ...form };
      },
    },
  },

  data() {
    return {
      form: {
        shipping_type: {
          validated: false,
          value: "",
        },
        duration: {
          validated: false,
          value: "",
        },
        shipping_amount: {
          validated: false,
          value: "",
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.shipping-card {
  padding: toRem(16);
  position: relative;

  .ship-row {
    gap: toRem(20) 0;
  }
}

.remove-btn {
  margin-left: auto;
  margin-top: toRem(10);
  display: block;
}
</style>
