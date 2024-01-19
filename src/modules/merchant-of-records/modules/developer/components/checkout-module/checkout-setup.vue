<template>
  <div class="checkout-setup">
    <!-- MOR WALLET SECTION -->
    <MoRWalletBlock />

    <div class="setup-block mgt-30">
      <div class="title-text grey-900 mgb-20 h4-text">
        Setup payment checkout
      </div>

      <div class="row pdb-40">
        <div class="col-12 col-md-6">
          <CustomerInfoBlock :show_module_name="false" flex_color_setup />
          <ShippingBlock />
        </div>

        <div class="col-12 col-md-6">
          <CustomerLocationBlock />
          <PaymentAmountBlock />
          <PaymentMethodBlock />

          <div class="mgt-24">
            <button
              :disabled="isDisabled"
              ref="btnRef"
              class="btn btn-md btn-primary pdy-12 w-100"
              @click="initializePayment"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { constants } from "@/utilities";

export default {
  name: "CheckoutSetup",

  metaInfo: {
    title: "Checkout Setup",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    CustomerInfoBlock: () =>
      import(
        /* webpackChunkName: "mor-module" */ "@/modules/merchant-of-records/modules/developer/components/checkout-module/customer-info-block"
      ),
    CustomerLocationBlock: () =>
      import(
        /* webpackChunkName: "mor-module" */ "@/modules/merchant-of-records/modules/developer/components/checkout-module/contact-location-block"
      ),
    ShippingBlock: () =>
      import(
        /* webpackChunkName: "mor-module" */ "@/modules/merchant-of-records/modules/developer/components/checkout-module/shipping-block"
      ),
    PaymentMethodBlock: () =>
      import(
        /* webpackChunkName: "mor-module" */ "@/modules/merchant-of-records/modules/developer/components/checkout-module/payment-method-block"
      ),
    PaymentAmountBlock: () =>
      import(
        /* webpackChunkName: "mor-module" */ "@/modules/merchant-of-records/modules/developer/components/checkout-module/payment-amount-block"
      ),
    MoRWalletBlock: () =>
      import(
        /* webpackChunkName: "mor-module" */ "@/modules/merchant-of-records/modules/dashboard/components/mor-wallet-block"
      ),
  },

  computed: {
    ...mapGetters({
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
    }),

    isDisabled() {
      let { currency_code, payment_methods, amount } =
        this.getPaymentModuleConfig;

      return currency_code && payment_methods.length && amount ? false : true;
    },

    getPayloadData() {
      let payload = { ...this.getPaymentModuleConfig };

      payload.shipping_types = payload.is_shipping_type
        ? payload.shipping_types
        : [];

      return payload;
    },
  },

  methods: {
    ...mapActions({
      initializeCheckoutPayment: "merchantDeveloper/initializeCheckoutPayment",
    }),

    async initializePayment() {
      console.log("DATA", this.getPayloadData);
      const response = await this.handleDataRequest({
        action: "initializeCheckoutPayment",
        payload: this.getPayloadData,
        btn_text: "Proceed to checkout",
        alert_handler: {
          success: "Payment initiated successfully",
          error: "Unable to initiate payment",
          request_error: "Shipping data provided is not valid",
        },
      });

      if (response.code === 200) {
        let checkout_url = `${constants.VESICASH_APP_URL}/mor-checkout/${response.data.Reference}`;

        this.$utils.createAndClickAnchor(checkout_url);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.checkout-setup {
  .setup-block {
    .title-text {
      font-size: toRem(20);
    }

    .setup-wrapper {
      .checkout-card {
        border: toRem(1) solid getColor("grey-100");
        background: getColor("neutral-10");
        margin-bottom: toRem(24);
        border-radius: toRem(8);
        padding: toRem(24);

        .title-text {
          @include generate-font-type("primary-1");
          font-size: toRem(15.5);
          color: getColor("grey-700");
          margin-bottom: toRem(24);
          text-transform: uppercase;
        }
      }
    }
  }
}
</style>
