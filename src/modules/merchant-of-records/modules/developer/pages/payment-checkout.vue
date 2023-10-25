<template>
  <div class="module-preview">
    <div class="app-container">
      <div class="row mgt-20">
        <div class="col-12 col-lg-10 mx-auto">
          <div class="preview-area">
            <!-- BRAND LOGO -->
            <div class="brand-logo position-relative mgb-40 h-auto mx-auto">
              <img :src="getLogoUrl || loadImage('vesicash-svg.svg')" alt="" />
            </div>

            <!-- DISPLAY SECTION -->
            <div class="display-section" :style="getBackgroundColor">
              <div class="title-text h4-text grey-900 mgb-28">
                Merchant Checkout
              </div>

              <div class="row">
                <div class="col-12 col-md-6">
                  <ModuleCustomerPreview
                    :show_cta="false"
                    @shippingTypeSelected="updateShippingCost"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <ModuleOrderPreview
                    :shipping_cost="shipping_cost"
                    :disable_btn_processing="disable_btn_processing"
                    @processUserPayment="handleProcessingOfPaymentLink"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_checkout_status">
        <CheckoutStatusModal
          :transaction_info="payment_data"
          @closeTriggered="toggleCheckoutPayment"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import ModuleCustomerPreview from "@/modules/merchant-of-records/modules/developer/components/payment-module/module-customer-preview";
import ModuleOrderPreview from "@/modules/merchant-of-records/modules/developer/components/payment-module/module-order-preview";
import countries from "@/utilities/countries";

export default {
  name: "ModulePreview",

  metaInfo: {
    title: "Merchant Checkout",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    ModuleCustomerPreview,
    ModuleOrderPreview,
    CheckoutStatusModal: () =>
      import(
        /* webpackChunkName: "mor-module" */ "@/modules/merchant-of-records/modules/developer/modals/checkout-status-modal"
      ),
  },

  computed: {
    ...mapGetters({
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
      getUserPaymentInfo: "merchantDeveloper/getUserPaymentInfo",
      getSelectedPaymentMethod: "merchantDeveloper/getSelectedPaymentMethod",
    }),

    getPaymentReference() {
      return this.$route.params.reference;
    },

    getLogoUrl() {
      return this.getPaymentModuleConfig.logo_url;
    },

    getBackgroundColor() {
      return { backgroundColor: this.getPaymentModuleConfig.background_colour };
    },

    getPaymentPayload() {
      return {
        reference: this.getPaymentReference,
        first_name: this.getUserPaymentInfo.first_name,
        last_name: this.getUserPaymentInfo.last_name,
        email: this.getUserPaymentInfo.email_address,
        address: this.getUserPaymentInfo?.street_address ?? null,
        city: null,
        state: null,
        payment_method: this.getSelectedPaymentMethod,
        phone_number: this.getUserPaymentInfo?.phone_number ?? null,
        country_code: this.getPaymentModuleConfig.country_code,
      };
    },
  },

  data() {
    return {
      disable_btn_processing: false,
      show_checkout_status: false,
      shipping_cost: 0,

      payment_data: {},
    };
  },

  mounted() {
    if (this.getPaymentReference) this.getPaymentCheckoutinfo();
    else this.handleToastPushMx("No payment reference found", "error");
  },

  methods: {
    ...mapActions({
      getPaymentInfo: "merchantDeveloper/getPaymentInfo",
      generatePaymentLink: "merchantDeveloper/generatePaymentLink",
    }),

    ...mapMutations({
      UPDATE_PAYMENT_MODULE: "merchant/UPDATE_PAYMENT_MODULE",
      SET_PAYMENT_MODULE: "merchant/SET_PAYMENT_MODULE",
    }),

    updateShippingCost(shipping_data) {
      this.shipping_cost = shipping_data.selected ? shipping_data.amount : 0;
    },

    toggleCheckoutPayment() {
      this.show_checkout_status = !this.show_checkout_status;
    },

    async getPaymentCheckoutinfo() {
      this.showPageLoader("Fetching payment information");

      const response = await this.handleDataRequest({
        action: "getPaymentInfo",
        payload: { reference: this.getPaymentReference },
        show_alert: false,
      });

      if (response.code === 200) {
        this.hidePageLoader();

        if (["successful", "failed"].includes(response.data.status)) {
          this.payment_data = response.data;
          this.toggleCheckoutPayment();
        }

        this.populateCheckoutPaymentState(response.data);
      } else this.handleToastPushMx("Unable to fetch payment info", "error");
    },

    populateCheckoutPaymentState(payload) {
      let country_data = countries.find(
        (country) => country.currency.short === payload.currency_code
      );

      const payment_info = {
        logo_url: payload?.logo_url || "",
        background_colour: payload?.background_colour || "#f1f7f7",
        button_colour: payload?.button_colour || "#043b56",
        request_phone_number:
          payload?.other_requirements?.request_phone_number || true,
        request_country: payload?.other_requirements?.request_country || false,
        request_street_address:
          payload?.other_requirements?.request_street_address || false,
        country_id: payload?.country_id || 0,
        country_code: country_data.code.toUpperCase(),
        currency_code: payload?.currency_code || "",
        currency_sign: country_data.currency.sign,

        is_shipping_type: payload?.shipping_types[0]?.name.length
          ? true
          : false,
        shipping_types: [...(payload?.shipping_types || [])],

        product_type: payload?.product_type || "",
        amount: payload?.amount || 0,
        vat: payload?.vat || 0,
        payment_methods: [...payload?.payment_methods],
      };

      this.SET_PAYMENT_MODULE(payment_info);
    },

    async handleProcessingOfPaymentLink() {
      const response = await this.handleDataRequest({
        action: "generatePaymentLink",
        payload: this.getPaymentPayload,
        show_alert: false,
      });

      this.disable_btn_processing = true;

      if (response.code === 200) {
        this.$utils.createAndClickAnchor(response.data.link, "_blank");
      } else {
        this.handleToastPushMx(
          "Unable to process your payment at this time",
          "error"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.module-preview {
  padding-bottom: toRem(50);

  .preview-area {
    padding-top: toRem(32);

    .brand-logo {
      width: toRem(170);

      img {
        width: 100%;
        height: auto;
      }
    }

    .display-section {
      padding: toRem(24);
    }
  }
}
</style>
