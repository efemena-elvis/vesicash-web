<template>
  <div class="order-preview neutral-10-bg rounded-8">
    <template>
      <div class="wrapper mgb-24">
        <div class="title-text">ORDER SUMMARY</div>

        <OrderDisplayCard />
        <OrderDisplayCard />

        <!-- PRODUCT DETAILS -->
        <div class="product-details mgb-24">
          <div class="product-list">
            <div class="item-row">
              <div class="title">Subtotal</div>
              <div class="value">N15,000</div>
            </div>

            <div class="item-row">
              <div class="title">Shipping</div>
              <div class="value">N2,000</div>
            </div>

            <div class="item-row">
              <div class="title">Tax (6.50%)</div>
              <div class="value">+N345</div>
            </div>
          </div>

          <div class="product-total">
            <div class="item-row mgb-0">
              <div class="title">Total</div>
              <div class="value fw-bold">N5,345</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template>
      <div class="wrapper pdb-24 mgb-24 border-bottom-grey-100">
        <div class="title-text">PROMO CODE</div>

        <div class="form-group">
          <FormFieldInput
            label_title="Have a promo code?"
            label_id="promoCode"
            is_required
            placeholder="Enter your promo code and validate"
            :input_value="getFormFieldValueMx(form, 'promo_code')"
            @getInputState="updateFormFieldMx($event, 'promo_code')"
          />
        </div>

        <button class="btn btn-md btn-primary">Validate code</button>
      </div>
    </template>

    <template>
      <div class="title-text">PAYMENT INFORMATON</div>

      <FormCheckCard check_id="creditCard" primary_text="Pay by credit card" />

      <FormCheckCard
        check_id="mobileMoney"
        primary_text="Pay by mobile money "
      />

      <FormCheckCard
        check_id="bankTransfer"
        primary_text="Pay by bank transfer"
      />
    </template>

    <div class="mgt-24">
      <button class="btn btn-md w-100 teal-800-bg neutral-10 pdy-10">
        Make payment
      </button>
    </div>
  </div>
</template>

<script>
import FormCheckCard from "@/shared/components/form-comps/form-check-card";
import OrderDisplayCard from "@/modules/merchant-of-records/modules/developer/components/payment-module/order-display-card";

export default {
  name: "OrderPreview",

  components: {
    FormCheckCard,
    OrderDisplayCard,
  },

  data: () => ({
    form: {
      promo_code: {
        validated: false,
        value: "",
      },
    },
  }),
};
</script>

<style lang="scss" scoped>
.order-preview {
  padding: toRem(24);

  .title-text {
    @include generate-font-type("primary-1");
    color: getColor("grey-900");
    margin-bottom: toRem(24);
  }

  .product-details {
    .item-row {
      @include flex-row-nowrap("space-between", "center");
      @include generate-font-type("secondary-1");
      margin-bottom: toRem(16.5);

      .title {
        color: getColor("grey-600");
      }

      .value {
        color: getColor("grey-900");
      }
    }

    .product-total {
      padding: toRem(16.5) 0;
      border-top: toRem(0.5) solid getColor("grey-200");
      border-bottom: toRem(0.5) solid getColor("grey-200");
    }
  }
}
</style>
