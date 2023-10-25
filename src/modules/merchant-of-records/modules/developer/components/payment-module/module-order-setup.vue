<template>
  <div class="order-setup">
    <!-- ORDER SUMMARY -->
    <template>
      <div class="setup-wrapper" v-if="false">
        <div class="title-text">ORDER SUMMARY</div>

        <div class="form-group">
          <div class="form-label">Select product type</div>
          <DropSelectInput
            placeholder="Select product"
            @optionSelected="selectProductType($event)"
            :options="product_options"
            :pre_select="product"
          />
        </div>

        <div class="tax-wrapper secondary-text-2" v-if="productTax">
          <span>TAX</span> <span>{{ productTax }}%</span>
        </div>

        <div
          class="intro-row d-flex flex-row justify-content-between align-items-center"
          v-if="false"
        >
          <div class="intro-text grey-900 tertiary-2-text">
            Add tax collection
          </div>

          <FormToggler
            :default_value="collect_tax"
            @toggleSelected="collect_tax = $event"
          />
        </div>
      </div>
    </template>

    <!-- PROMO CODE -->
    <template v-if="false">
      <div class="setup-wrapper">
        <div class="title-text">PROMO CODE</div>

        <div class="row">
          <div class="col-12 col-sm-6">
            <FormFieldInput
              label_title="Enter promo code"
              label_id="promoCode"
              is_required
              placeholder="Enter code"
              :input_value="getFormFieldValueMx(form, 'promo_code')"
              @getInputState="updateFormFieldMx($event, 'promo_code')"
            />
          </div>

          <div class="col-12 col-sm-6">
            <FormFieldInput
              label_title="Code percentage"
              label_id="codePercentage"
              is_required
              placeholder="Enter code percentage"
              :input_value="getFormFieldValueMx(form, 'code_percent')"
              @getInputState="updateFormFieldMx($event, 'code_percent')"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- PAYMENT INFORMATION -->
    <template>
      <div class="setup-wrapper">
        <div class="title-text">PAYMENT INFORMATION</div>

        <div class="tertiary-3-text grey-600 mgb-24">
          This is the payment information available for the country you
          selected, Select the ones you want to deploy to your customers
        </div>

        <FormCheckCard
          v-for="(option, index) in payment_methods"
          :key="option.name"
          :check_id="option.name + index"
          :primary_text="`Pay by ${option.name}`"
          :checked="option.checked"
          @change="updatePaymentMethods($event, index)"
        />
      </div>
    </template>

    <!-- ACTION ROW -->
    <div class="row mgt-12 action-row">
      <div class="col-12 col-sm-6">
        <button
          ref="save"
          @click="saveModule"
          :disabled="isDisabled"
          class="btn btn-md btn-primary w-100 pdy-8"
        >
          {{ btnAction }}
        </button>
      </div>

      <div class="col-12 col-sm-6">
        <router-link
          :to="{ name: 'MerchantModulePreview' }"
          class="btn btn-md btn-secondary w-100 pdy-8"
        >
          Preview module
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import FormToggler from "@/shared/components/form-comps/form-toggler";
import FormCheckCard from "@/shared/components/form-comps/form-check-card";

export default {
  name: "OrderSetup",

  components: {
    FormToggler,
    FormCheckCard,
  },

  computed: {
    ...mapGetters({
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
    }),

    btnAction() {
      const payment_module_id = this.$route?.query?.id;
      return payment_module_id ? "Update module" : "Save module";
    },

    productTax() {
      return this.selected_product?.tax || 0;
    },

    isDisabled() {
      const config = this.getPaymentModuleConfig;
      const use_shipping = config.is_shipping_type;
      const invalidShippingMethods =
        config?.shipping_types?.some(
          (type) => !type?.name || !type?.currency_code || !type?.time
        ) ||
        (!config?.shipping_types?.length && use_shipping);

      // console.log(!config?.payment_methods?.length);

      return (
        invalidShippingMethods ||
        !config?.module_name ||
        !config?.country_id ||
        !config?.country_name ||
        !config?.currency_code ||
        !config?.payment_methods?.length
      );
    },
  },

  data() {
    return {
      product: null,
      selected_product: null,
      payment_methods: [
        {
          name: "credit card",
          slug: "credit_card",
          checked: false,
        },
        {
          name: "mobile money",
          slug: "mobile_money",
          checked: false,
        },
        {
          name: "bank transfer",
          slug: "bank_transfer",
          checked: false,
        },
      ],

      product_options: [
        {
          name: "Product A",
          id: 1,
          tax: 6,
        },
        {
          name: "Product B",
          id: 2,
          tax: 4,
        },
        {
          name: "Product C",
          id: 1,
          tax: 10,
        },
      ],
      collect_tax: true,

      form: {
        promo_code: {
          validated: false,
          value: "",
        },
        code_percent: {
          validated: false,
          value: "",
        },
      },
    };
  },

  mounted() {
    this.updateSavedConfig(this.getPaymentModuleConfig);
  },

  methods: {
    ...mapMutations({
      UPDATE_PAYMENT_MODULE: "merchant/UPDATE_PAYMENT_MODULE",
      RESET_PAYMENT_MODULE: "merchant/RESET_PAYMENT_MODULE",
    }),

    ...mapActions({ savePaymentModule: "merchant/savePaymentModule" }),

    async saveModule() {
      try {
        const payment_module_id = Number(this.$route?.query?.id);
        const payload = payment_module_id
          ? { payment_module_id, ...this.getPaymentModuleConfig }
          : { ...this.getPaymentModuleConfig };

        this.handleClick("save");
        const response = await this.savePaymentModule(payload);
        this.handleClick("save", this.btnAction, false);
        const type = response?.code === 200 ? "success" : "warning";
        const message = response?.message;
        this.pushToast(message, type);
        if (response?.code === 200) {
          this.RESET_PAYMENT_MODULE();
          this.$router.push("/merchant/developer");
        }
      } catch (err) {
        this.handleClick("save", this.btnAction, false);
        console.log("ERROR SAVING/UPDATING MODULE", err);
        this.pushToast("Action failed", "error");
      }
    },

    updatePaymentMethods(checked, index) {
      const method = this.payment_methods[index];
      this.payment_methods?.splice(index, 1, { ...method, checked });
      const updated_methods = [...this.payment_methods]
        ?.filter((method) => method.checked)
        ?.map((method) => method.name);
      this.UPDATE_PAYMENT_MODULE({
        field: "payment_methods",
        data: updated_methods,
      });
    },

    updateSavedConfig(config) {
      const savedProduct = this.product_options?.find(
        (product) => product.name === config?.product_type
      );
      if (savedProduct) {
        this.product = savedProduct;
        this.selected_product = savedProduct;
      }

      this.payment_methods = this.payment_methods?.map((method) => {
        return {
          ...method,
          checked: config?.payment_methods?.includes(method?.slug),
        };
      });
    },

    selectProductType(product) {
      this.selected_product = product;
      this.UPDATE_PAYMENT_MODULE({ field: "product_type", data: product.name });
      this.UPDATE_PAYMENT_MODULE({ field: "vat", data: product.tax });
    },
  },
};
</script>

<style lang="scss" scoped>
.tax-wrapper {
  padding: 9px 16px;
  border-radius: toRem(10);
  border: 1px dashed getColor("grey-500");
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.action-row {
  gap: toRem(20) 0;
}

.order-setup {
  margin-bottom: toRem(60);

  .setup-wrapper {
    border: toRem(1) solid getColor("grey-100");
    background: getColor("neutral-10");
    margin-bottom: toRem(24);
    border-radius: toRem(8);
    padding: toRem(24);

    .title-text {
      @include generate-font-type("primary-1");
      color: getColor("grey-900");
      margin-bottom: toRem(24);
    }
  }
}
</style>
