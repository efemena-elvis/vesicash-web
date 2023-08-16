<template>
  <div class="order-setup">
    <!-- ORDER SUMMARY -->
    <template>
      <div class="setup-wrapper">
        <div class="title-text">ORDER SUMMARY</div>

        <div class="form-group">
          <div class="form-label">Select product type</div>
          <DropSelectInput
            placeholder="Select product"
            @selectedOption="selectProductType($event)"
            :options="product_options"
          />
        </div>

        <div
          class="intro-row d-flex flex-row justify-content-between align-items-center"
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
          check_id="creditCard"
          primary_text="Pay by credit card"
        />

        <FormCheckCard
          check_id="mobileMoney"
          primary_text="Pay by mobile money "
        />

        <FormCheckCard
          check_id="bankTransfer"
          primary_text="Pay by bank transfer"
        />
      </div>
    </template>

    <!-- ACTION ROW -->
    <div class="row mgt-12">
      <div class="col-12 col-sm-6">
        <router-link
          :to="{ name: 'MerchantDeveloper' }"
          class="btn btn-md btn-primary w-100 pdy-8"
          >Save module</router-link
        >
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
import FormToggler from "@/shared/components/form-comps/form-toggler";
import FormCheckCard from "@/shared/components/form-comps/form-check-card";

export default {
  name: "OrderSetup",

  components: {
    FormToggler,
    FormCheckCard,
  },

  data() {
    return {
      product_options: [],
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

  methods: {
    selectProductType() {},
  },
};
</script>

<style lang="scss" scoped>
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
