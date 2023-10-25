<template>
  <div
    class="payment-amount-block rounded-8 mgb-24 pd-24 neutral-10-bg border-grey-100"
  >
    <div class="title-text grey-900 mgb-24 primary-1-text">PAYMENT AMOUNT</div>

    <div class="form-group">
      <FormFieldInput
        label_title="Product amount"
        label_id="productAmount"
        input_type="number"
        placeholder="0.00"
        is_required
        :input_value="getFormFieldValueMx(form, 'amount')"
        :prefix_value="getCurrenncy"
        :custom_style="{
          input_wrapper_style: 'form-prefix form-prefix-right',
        }"
        @getInputState="updateProduct($event, 'amount')"
        :error_handler="{
          type: 'required',
          message: 'Amount is required',
        }"
      />
    </div>

    <div class="form-group mgb-4">
      <FormFieldInput
        label_title="Value added tax"
        label_id="vat"
        input_type="number"
        placeholder="0.00"
        :input_value="getFormFieldValueMx(form, 'vat')"
        :prefix_value="getCurrenncy"
        :custom_style="{
          input_wrapper_style: 'form-prefix form-prefix-right',
        }"
        @getInputState="updateProduct($event, 'vat')"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "PaymentAmountBlock",

  computed: {
    ...mapGetters({
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
    }),

    getCurrenncy() {
      return this.getPaymentModuleConfig?.currency_code
        ? `${this.getPaymentModuleConfig?.currency_code} (${this.getPaymentModuleConfig?.currency_sign})`
        : "---";
    },
  },

  data: () => ({
    form: {
      amount: {
        validated: false,
        value: 0,
      },

      vat: {
        validated: false,
        value: 0,
      },
    },
  }),

  methods: {
    ...mapMutations({
      UPDATE_PAYMENT_MODULE: "merchant/UPDATE_PAYMENT_MODULE",
    }),

    updateProduct(data, field) {
      this.updateFormFieldMx(data, field);

      this.UPDATE_PAYMENT_MODULE({
        field,
        data: +data?.value,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-amount-block {
}
</style>
