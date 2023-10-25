<template>
  <div
    class="shipping-block rounded-8 mgb-24 pd-24 neutral-10-bg border-grey-100"
  >
    <div class="title-text grey-900 mgb-24 primary-1-text">SHIPPING TYPES</div>

    <!-- INTRO ROW -->
    <div class="intro-row mgb-24">
      <div class="intro-text grey-900 tertiary-2-text">
        Add shipping types to order
      </div>

      <FormToggler
        :default_value="ship"
        @toggleSelected="toggleShippingState"
      />
    </div>

    <div>
      <ShippingCard
        v-for="(type, index) in [...shipping_options]"
        :key="index"
        :identifier="index"
        :id="
          index +
          type.duration.value +
          type.shipping_amount.value +
          type.shipping_type.value
        "
        :default_form="{ ...type }"
        :currency="shippingCurrency"
        :is_active="!ship"
        @remove="shipping_options.splice(index, 1)"
      />
    </div>

    <button
      v-if="ship"
      class="btn btn-md btn-secondary"
      :disabled="ship ? false : true"
      @click="addExtraShippingOption"
    >
      <span class="icon-plus mgr-8"></span> Add a new delivery
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import FormToggler from "@/shared/components/form-comps/form-toggler";

export default {
  name: "ShippingBlock",

  components: {
    FormToggler,
    ShippingCard: () =>
      import(
        /* webpackChunkName: 'MoR-module' */ "@/modules/merchant-of-records/modules/developer/components/payment-module/shipping-card"
      ),
  },

  computed: {
    ...mapGetters({
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
    }),

    shippingCurrency() {
      return this.getPaymentModuleConfig?.currency_code
        ? `${this.getPaymentModuleConfig?.currency_code} (${this.getPaymentModuleConfig?.currency_sign})`
        : "---";
    },
  },

  data: () => ({
    ship: false,

    empty_shipping_option: {
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

    shipping_options: [
      {
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
    ],

    shipping_active: false,
  }),

  mounted() {
    const id = this.$route?.query?.id;

    id && !this.getPaymentModuleConfig?.saved
      ? this.fetchSavedModule(id)
      : this.updateSavedConfig(this.getPaymentModuleConfig);
  },

  watch: {
    shipping_options: {
      handler(options) {
        this.updateShipping(options);
      },
      deep: true,
    },

    shippingCurrency: {
      handler(currency) {
        this.updateShipping(this.shipping_options, currency);
      },
    },
  },

  methods: {
    ...mapActions({
      fetchPaymentModule: "merchant/fetchPaymentModule",
    }),

    ...mapMutations({
      UPDATE_PAYMENT_MODULE: "merchant/UPDATE_PAYMENT_MODULE",
      SET_PAYMENT_MODULE: "merchant/SET_PAYMENT_MODULE",
    }),

    async fetchSavedModule(id) {
      this.showPageLoader("Loading module");

      const response = await this.fetchPaymentModule(id);

      this.hidePageLoader();
      const type = response?.code === 200 ? "success" : "warning";
      const message = response?.message;
      this.pushToast(message, type);
      if (response?.code === 200) {
        const data = response?.data;
        const config = {
          is_shipping_type: data?.is_shipping_type,
          shipping_types: [...(data?.shipping_types || [])],
          saved: true,
        };
        this.updateSavedConfig(config);
        this.SET_PAYMENT_MODULE(config);
      }
    },

    toggleShippingState($event) {
      this.ship = $event;
      this.UPDATE_PAYMENT_MODULE({ field: "is_shipping_type", data: $event });
    },

    addExtraShippingOption() {
      const empty_option = {
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
      };
      this.shipping_options = [...this.shipping_options, empty_option];
    },

    updateShipping(options, currency) {
      const updated_shippings = [...options]?.map((option) => {
        return {
          name: option.shipping_type.value,
          time: option.duration.value,
          amount: Number(option.shipping_amount.value),
          currency_code: currency || this.shippingCurrency,
        };
      });

      this.UPDATE_PAYMENT_MODULE({
        field: "shipping_types",
        data: updated_shippings,
      });
    },

    updateSavedConfig(config) {
      this.ship = config.is_shipping_type;

      this.shipping_options = [...(config?.shipping_types || [])]?.map(
        (type) => {
          return {
            shipping_type: {
              validated: !!type?.name,
              value: type?.name || "",
            },
            duration: {
              validated: !!type?.time,
              value: type?.time || "",
            },
            shipping_amount: {
              validated: !!type?.amount,
              value: type?.amount || "",
            },
          };
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.shipping-block {
  .intro-row {
    @include flex-row-nowrap("space-between", "center");
  }
}
</style>
