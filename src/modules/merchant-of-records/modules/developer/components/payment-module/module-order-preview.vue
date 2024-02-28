<template>
  <div class="order-preview neutral-10-bg rounded-8">
    <template>
      <div class="wrapper mgb-24">
        <div class="title-text">ORDER SUMMARY</div>

        <!-- PRODUCT DETAILS -->
        <div class="product-details mgb-24">
          <div class="product-list">
            <div class="item-row">
              <div class="title">Subtotal</div>
              <div class="value">{{ getCurrencySign }}{{ getSubTotal }}</div>
            </div>

            <div class="item-row">
              <div class="title">Shipping</div>
              <div class="value">
                {{ getCurrencySign }}{{ getShippingCost }}
              </div>
            </div>

            <div class="item-row">
              <div class="title">VAT</div>
              <div class="value">{{ getCurrencySign }}{{ getVat }}</div>
            </div>
          </div>

          <div class="product-total">
            <div class="item-row mgb-0">
              <div class="title">Total amount</div>
              <div class="value fw-bold">
                {{ getCurrencySign }}{{ totalCost }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="false">
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

      <FormCheckCard
        v-for="(payment, index) in paymentMethods"
        :key="payment.id"
        :checked="payment.selected"
        :check_id="payment.id"
        :primary_text="`Pay by ${payment.name}`"
        @change="updatePaymentMethod($event, index)"
      />
    </template>

    <div class="mgt-24">
      <button
        class="btn btn-md w-100 pdy-10"
        ref="btnRef"
        :disabled="isDisabled"
        :style="getButtonColor"
        @click="handleClickOfPaymentBtn"
      >
        Make payment
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { serviceUtils } from "@/shared/services";
import FormCheckCard from "@/shared/components/form-comps/form-check-card";
import OrderDisplayCard from "@/modules/merchant-of-records/modules/developer/components/payment-module/order-display-card";

export default {
  name: "OrderPreview",

  components: {
    FormCheckCard,
    OrderDisplayCard,
  },

  props: {
    shipping_cost: {
      type: Number,
      default: 0,
    },

    disable_btn_processing: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
      isPaymentInfoCompleted: "merchantDeveloper/isPaymentInfoCompleted",
    }),

    isDisabled() {
      return this.isPaymentInfoCompleted && !!this.selected_payment_slug
        ? false
        : true;
    },

    getButtonColor() {
      return { backgroundColor: this.getPaymentModuleConfig.button_colour };
    },

    getSubTotal() {
      return this.$utils.formatCurrencyWithComma(
        this.getPaymentModuleConfig.amount || 0
      );
    },

    getShippingCost() {
      return this.$utils.formatCurrencyWithComma(this.shipping_cost || 0);
    },

    getVat() {
      return this.$utils.formatCurrencyWithComma(
        this.getPaymentModuleConfig.vat || 0
      );
    },

    getCurrencySign() {
      return this.$utils.formatCurrency({
        input: this.getPaymentModuleConfig.currency_code,
        output: "sign",
      });
    },

    totalCost() {
      let sub_total = this.getPaymentModuleConfig.amount;
      let vat = this.getPaymentModuleConfig.vat;
      let total_cost = sub_total + vat + this.shipping_cost;
      return this.$utils.formatCurrencyWithComma(total_cost);
    },

    paymentMethods() {
      return this.getPaymentModuleConfig?.payment_methods?.map((option) => ({
        name: this.getPaymentMethod(option),
        id: `Preview${option}`,
        slug: option,
        selected: this.selected_payment_slug === option,
      }));
    },
  },

  watch: {
    disable_btn_processing: {
      handler(value) {
        if (value) {
          this.handleClick("btnRef", "Make payment", false);
        }
      },
    },
  },

  data: () => ({
    payment_method_selected: false,

    selected_payment_slug: "",

    form: {
      promo_code: {
        validated: false,
        value: "",
      },
    },
  }),

  methods: {
    ...mapMutations({
      UPDATE_SELECTED_PAYMENT: "merchantDeveloper/UPDATE_SELECTED_PAYMENT",
    }),

    handleClickOfPaymentBtn() {
      this.handleClick("btnRef", "Processing payment...");
      this.$emit("processUserPayment");
    },

    getPaymentMethod(method) {
      let payment_methods = {
        card: "card",
        banktransfer: "bank transfer",
        mobilemoney: "mobile money",
      };

      if (method.includes("mobilemoney")) return "mobile money";
      else return payment_methods[method];
    },

    updatePaymentMethod(state, index) {
      let selected_option = this.paymentMethods[index];
      this.selected_payment_slug = state ? selected_option.slug : "";
      this.UPDATE_SELECTED_PAYMENT(this.selected_payment_slug);
    },
  },
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

  .btn {
    background: getColor("teal-800");
    color: getColor("neutral-10");

    &:hover {
      background: darken(getColor("teal-800"), 6%);
    }
  }
}
</style>
