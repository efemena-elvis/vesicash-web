<template>
  <div
    class="payment-block rounded-8 mgb-24 pd-24 neutral-10-bg border-grey-100"
  >
    <div class="title-text grey-900 mgb-24 primary-1-text">
      PAYMENT INFORMATION
    </div>

    <div class="tertiary-3-text grey-600 mgb-24">
      This is the payment information available for the country you selected,
      Select the ones you want to deploy to your customers
    </div>

    <div class="mgb--12">
      <FormCheckCard
        v-for="(option, index) in payment_methods"
        :key="option.name"
        :check_id="option.name + index"
        :primary_text="`Pay by ${option.name}`"
        :checked="option.checked"
        @change="updatePaymentMethods($event, index)"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import FormCheckCard from "@/shared/components/form-comps/form-check-card";
export default {
  name: "PaymentBlock",

  components: {
    FormCheckCard,
  },

  computed: {
    ...mapGetters({
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
    }),
  },

  watch: {
    getPaymentModuleConfig: {
      handler(config) {
        if (config.currency_code)
          this.formatPaymentMethods(config.currency_code);
      },
    },
  },

  data() {
    return {
      available_payment_methods: [
        {
          name: "bank transfer",
          slug: "banktransfer",
          checked: false,
          identifier: "banktransfer",
        },

        {
          name: "mobile money",
          slug: "mobilemoney",
          checked: false,
        },

        {
          name: "mobile money",
          slug: "mobilemoneyghana",
          checked: false,
        },

        {
          name: "mobile money",
          slug: "mobilemoneyzambia",
          checked: false,
        },

        {
          name: "mpesa",
          slug: "mpesa",
          checked: false,
        },
      ],

      payment_methods: [
        {
          name: "card",
          slug: "card",
          checked: false,
        },
        // {
        //   name: "bank transfer",
        //   slug: "banktransfer",
        //   checked: false,
        // },
        // {
        //   name: "mobile money",
        //   slug: "mobilemoney",
        //   checked: false,
        // },
      ],
    };
  },

  //   credit card is not a payment method try any of these card, banktransfer, mobilemoneyghana, mobilemoneyfranco, mobilemoneyuganda, mobilemoneyrwanda, mobilemoneyzambia, mobilemoney

  mounted() {
    this.updateSavedConfig(this.getPaymentModuleConfig);
  },

  methods: {
    ...mapMutations({
      UPDATE_PAYMENT_MODULE: "merchant/UPDATE_PAYMENT_MODULE",
    }),

    formatPaymentMethods(currency) {
      this.payment_methods = [this.payment_methods[0]];

      if (currency === "GHS") {
        this.payment_methods = [
          ...this.payment_methods,
          this.available_payment_methods.find(
            (item) => item.slug === "mobilemoneyghana"
          ),
        ];
      } else if (currency === "ZMW") {
        this.payment_methods = [
          ...this.payment_methods,
          this.available_payment_methods.find(
            (item) => item.slug === "mobilemoneyzambia"
          ),
        ];
      } else this.payment_methods = [...this.payment_methods];
    },

    updatePaymentMethods(checked, index) {
      const method = this.payment_methods[index];
      this.payment_methods?.splice(index, 1, { ...method, checked });

      const updated_methods = [...this.payment_methods]
        ?.filter((method) => method.checked)
        ?.map((method) => method.slug);

      this.UPDATE_PAYMENT_MODULE({
        field: "payment_methods",
        data: updated_methods,
      });
    },

    updateSavedConfig(config) {
      this.payment_methods = this.payment_methods?.map((method) => {
        return {
          ...method,
          checked: config?.payment_methods?.includes(method?.slug),
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
