<template>
  <div class="customer-setup">
    <!-- BRAND SETTINGS -->
    <template>
      <div class="setup-wrapper">
        <div class="title-text">BRAND SETTINGS</div>

        <!-- BRAND UPLOAD AREA -->
        <div class="brand-logo-area mgb-24">
          <div class="upload-area grey-10-bg rounded-8 grey-800 mgr-18">
            <div class="icon-plus f-size-20 mgr-8"></div>
            <div class="text tertiary-2-text">Brand Logo</div>
          </div>

          <button class="btn btn-md btn-secondary">Upload brand logo</button>
        </div>

        <div class="form-group">
          <FormFieldInput
            label_title="Checkout module name"
            label_id="moduleName"
            is_required
            placeholder="Enter checkout name"
            :input_value="getFormFieldValueMx(form, 'module_name')"
            @getInputState="updateFormFieldMx($event, 'module_name')"
            :error_handler="{
              type: 'required',
              message: 'Module name is required',
            }"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="backgroundColor"
            >Checkout background color</label
          >
          <FormColorInput color_id="backgroundColor" default_color="#F6FAF9" />
        </div>

        <div class="form-group">
          <label class="form-label" for="buttonColor"
            >Checkout button color</label
          >
          <FormColorInput color_id="buttonColor" default_color="#043B56" />
        </div>

        <div class="form-group mgb-0">
          <label for="otherRequirement" class="form-label">
            Add other requirements
          </label>

          <FormCheckCard
            check_id="requirePhoneNumber"
            primary_text="Collect phone number"
          />

          <FormCheckCard
            check_id="requireCountry"
            primary_text="Collect country"
          />

          <FormCheckCard
            check_id="requireStreetAddress"
            primary_text="Collect street address"
          />
        </div>
      </div>
    </template>

    <!-- CUSTOMER LOCATION AND SETTINGS -->
    <template>
      <div class="setup-wrapper">
        <div class="title-text">CUSTOMER LOCATION</div>

        <div class="form-group">
          <div class="form-label">Select location</div>
          <DropSelectInput
            placeholder="Select location"
            @optionSelected="selectUserLocation($event)"
            :options="morCountries"
          />
        </div>

        <div class="form-group mgb-0" v-if="false">
          <div class="form-label">Select currency</div>
          <DropSelectInput
            placeholder="Select currency"
            @selectedOption="selectUserCurrency($event)"
            :options="currency_options"
          />
        </div>
      </div>
    </template>

    <!-- SHIPPING TYPES -->
    <template>
      <div class="setup-wrapper">
        <div class="title-text">SHIPPING TYPES</div>

        <!-- INTRO ROW -->
        <div class="intro-row mgb-24">
          <div class="intro-text grey-900 tertiary-2-text">
            Add shipping types to order
          </div>

          <FormToggler
            :default_value="false"
            @toggleSelected="shipping_active = $event"
          />
        </div>

        <ShippingCard :currency="shippingCurency" />

        <button class="btn btn-md btn-secondary">
          <span class="icon-plus mgr-8"></span> Add a new delivery
        </button>
      </div>
    </template>

    <template>
      <div class="mgt-40">
        <router-link
          :to="{ name: 'MerchantModuleOrder' }"
          class="btn btn-md btn-primary pdy-10 w-100"
        >
          Continue to order details
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import FormColorInput from "@/shared/components/form-comps/form-color-input";
import FormToggler from "@/shared/components/form-comps/form-toggler";
import FormCheckCard from "../../../../../../shared/components/form-comps/form-check-card.vue";

export default {
  name: "CustomerSetup",

  components: {
    FormColorInput,
    FormToggler,
    FormCheckCard,
    ShippingCard: () =>
      import(
        /* webpackChunkName: 'MoR-module' */ "@/modules/merchant-of-records/modules/developer/components/payment-module/shipping-card"
      ),
  },

  computed: {
    ...mapGetters({
      getMorCountries: "merchant/getMorCountries",
    }),

    morCountries() {
      return [...this.getMorCountries];
    },

    shippingCurency() {
      return this.selected_country?.currency_code || "NGN";
    },
  },

  data: () => ({
    form: {
      module_name: {
        validated: false,
        value: "",
      },
    },

    selected_country: null,

    location_options: [],
    currency_options: [],

    shipping_active: false,
  }),

  mounted() {
    if (!this.getMorCountries.length) this.fetchMoRCountries();
  },

  methods: {
    ...mapActions({
      fetchMoRCountries: "merchant/fetchMoRCountries",
    }),

    selectUserLocation(location) {
      this.selected_country = location;
    },

    selectUserCurrency() {},
  },
};
</script>

<style lang="scss" scoped>
.customer-setup {
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

  .brand-logo-area {
    @include flex-row-nowrap("flex-start", "center");

    .upload-area {
      border: toRem(1) dashed getColor("grey-300");
      @include flex-row-nowrap("center", "center");
      min-width: toRem(170);
      width: auto;
      min-height: toRem(56);
      height: auto;
    }
  }

  .intro-row {
    @include flex-row-nowrap("space-between", "center");
  }
}
</style>
