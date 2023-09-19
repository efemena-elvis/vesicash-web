<template>
  <div class="customer-setup">
    <!-- BRAND SETTINGS -->
    <template>
      <div class="setup-wrapper">
        <div class="title-text">BRAND SETTINGS</div>

        <!-- BRAND UPLOAD AREA -->
        <div class="brand-logo-area mgb-24">
          <label
            disabled
            :for="uploading_file ? '' : 'fileUpload'"
            class="upload-area grey-10-bg rounded-8 grey-800 mx-auto pdx-15"
          >
            <div
              class="icon-spinner f-size-19 animate mgr-8"
              v-if="uploading_file"
            ></div>
            <div class="icon-plus f-size-20 mgr-8" v-else></div>
            <div class="text tertiary-2-text">
              {{ uploading_file ? "Uploading logo..." : "Upload brand Logo" }}
            </div>

            <input
              type="file"
              id="fileUpload"
              class="d-none"
              accept="image/*"
              ref="fileUpload"
              @change="uploadPic"
            />
          </label>

          <button class="btn btn-md btn-secondary" v-if="false">
            Upload brand logo
          </button>
        </div>

        <div class="form-group">
          <FormFieldInput
            label_title="Checkout module name"
            label_id="moduleName"
            is_required
            placeholder="Enter checkout name"
            :input_value="getFormFieldValueMx(form, 'module_name')"
            @getInputState="updateName($event)"
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
          <FormColorInput
            color_id="backgroundColor"
            :default_color="bg_default"
            @colorChange="
              UPDATE_PAYMENT_MODULE({
                field: 'background_colour',
                data: $event,
              })
            "
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="buttonColor"
            >Checkout button color</label
          >
          <FormColorInput
            color_id="buttonColor"
            :default_color="btn_default"
            @colorChange="
              UPDATE_PAYMENT_MODULE({ field: 'button_colour', data: $event })
            "
          />
        </div>

        <div class="form-group mgb-0">
          <label for="otherRequirement" class="form-label">
            Add other requirements
          </label>

          <FormCheckCard
            check_id="requirePhoneNumber"
            primary_text="Collect phone number"
            :checked="request_phone"
            @change="
              UPDATE_PAYMENT_MODULE({
                field: 'request_phone_number',
                data: $event,
              })
            "
          />

          <FormCheckCard
            check_id="requireCountry"
            primary_text="Collect country"
            :checked="request_country"
            @change="
              UPDATE_PAYMENT_MODULE({ field: 'request_country', data: $event })
            "
          />

          <FormCheckCard
            check_id="requireStreetAddress"
            primary_text="Collect street address"
            :checked="request_address"
            @change="
              UPDATE_PAYMENT_MODULE({
                field: 'request_street_address',
                data: $event,
              })
            "
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
            :pre_select="country"
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
            :default_value="ship"
            @toggleSelected="
              UPDATE_PAYMENT_MODULE({ field: 'is_shipping_type', data: $event })
            "
          />
        </div>

        <div>
          <ShippingCard
            v-for="(type, index) in [...shipping_options]"
            :key="index"
            :id="
              index +
              type.duration.value +
              type.shipping_amount.value +
              type.shipping_type.value
            "
            :default_form="{ ...type }"
            :currency="shippingCurency"
            @remove="shipping_options.splice(index, 1)"
          />
        </div>

        <button
          class="btn btn-md btn-secondary"
          @click="addExtraShippingOption"
        >
          <span class="icon-plus mgr-8"></span> Add a new delivery
        </button>
      </div>
    </template>

    <template>
      <div class="mgt-40">
        <router-link
          :to="
            isDisabled
              ? ''
              : { name: 'MerchantModuleOrder', query: { id: $route.query.id } }
          "
          class="btn btn-md btn-primary pdy-10 w-100"
          :class="isDisabled ? 'disabled-btn' : ''"
        >
          Continue to order details
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
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
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
    }),

    isDisabled() {
      const config = this.getPaymentModuleConfig;
      const use_shipping = config.is_shipping_type;
      const invalidShippingMethods =
        config?.shipping_types?.some(
          (type) => !type?.name || !type?.currency_code || !type?.time
        ) ||
        (!config?.shipping_types?.length && use_shipping);

      return (
        invalidShippingMethods ||
        !config?.module_name ||
        !config?.country_id ||
        !config?.country_name ||
        !config?.currency_code
      );
    },

    morCountries() {
      return [...this.getMorCountries];
    },

    shippingCurency() {
      return this.selected_country?.currency_code || "NGN";
    },
  },

  data: () => ({
    uploading_file: false,
    form: {
      module_name: {
        validated: false,
        value: "",
      },
    },

    bg_default: "#F6FAF9",
    btn_default: "#043B56",

    request_phone: false,
    request_address: false,
    request_country: false,
    country: null,
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

    selected_country: null,

    location_options: [],
    currency_options: [],

    shipping_active: false,
  }),

  mounted() {
    const id = this.$route?.query?.id;
    id && !this.getPaymentModuleConfig?.saved
      ? this.fetchSavedModule(id)
      : this.updateSavedConfig(this.getPaymentModuleConfig);
    if (!this.getMorCountries.length && !id) this.fetchMoRCountries();
  },

  watch: {
    getMorCountries: {
      handler(countries) {
        const config = this.getPaymentModuleConfig;
        this.updateCountryWithConfig(config, countries);
      },
      immediate: true,
    },

    shipping_options: {
      handler(options) {
        this.updateShipping(options);
      },
      deep: true,
    },

    shippingCurency: {
      handler(currency) {
        this.updateShipping(this.shipping_options, currency);
      },
    },
  },

  methods: {
    ...mapActions({
      uploadToSpace: "general/uploadToSpace",
      fetchMoRCountries: "merchant/fetchMoRCountries",
      fetchPaymentModule: "merchant/fetchPaymentModule",
    }),

    updateCountryWithConfig(config, countries) {
      if (countries?.length && !this.selected_country) {
        const morCountry = [...countries]?.find(
          (cc) => cc.id === config.country_id
        );

        if (morCountry) {
          this.selected_country = morCountry;
          this.country = {
            name: config.country_name,
            id: config.country_id,
          };
        }
      }
    },

    async fetchSavedModule(id) {
      this.showPageLoader("Loading module");
      await this.fetchMoRCountries();
      const countries = this.getMorCountries?.length
        ? [...this.getMorCountries]
        : [];

      const response = await this.fetchPaymentModule(id);

      this.hidePageLoader();
      const type = response?.code === 200 ? "success" : "warning";
      const message = response?.message;
      this.pushToast(message, type);
      if (response?.code === 200) {
        const data = response?.data;
        const config = {
          logo_url: data?.logo_url || "",
          module_name: data?.name || "",
          background_colour: data?.background_colour || "#f1f7f7",
          button_colour: data?.button_colour || "#043b56",
          request_phone_number:
            data?.other_requirements?.request_phone_number || true,
          request_country: data?.other_requirements?.request_country || false,
          request_street_address:
            data?.other_requirements?.request_street_address || false,
          country_id: data?.country_id || 0,
          country_name:
            countries?.find((cc) => cc?.id === data?.country_id)?.name || "",
          currency_code: data?.currency_code || "",
          is_shipping_type: data?.is_shipping_type,
          shipping_types: [...(data?.shipping_types || [])],
          product_type: data?.product_type || "",
          vat: data?.vat || 0,
          payment_methods: [...data?.payment_methods],
          saved: true,
        };
        this.updateCountryWithConfig(config, countries);
        this.updateSavedConfig(config);
        this.SET_PAYMENT_MODULE(config);
      }
    },

    async uploadPic(event) {
      const [file] = event.target.files;
      if (!file) return;

      if (!this.processFileSize(file.size)) {
        this.pushToast("Upload a maximum file size of 1mb", "error");
        return false;
      }

      this.uploading_file = true;

      const loadedImage = await this.uploadToSpace({
        file,
        formatted_size: this.processFileSize(file.size),
      });

      this.uploading_file = false;

      const logo_url = [200, 201]?.includes(loadedImage.code)
        ? loadedImage.data.pop().file_url
        : "";

      if (logo_url)
        this.UPDATE_PAYMENT_MODULE({ field: "logo_url", data: logo_url });

      if (![200, 201]?.includes(loadedImage.code))
        this.pushToast("File upload failed", "error");
    },

    processFileSize(size) {
      if (size > 1000000) return false;

      return size.toString().length >= 6
        ? `${(size / 1000000).toFixed(1)}mb`
        : `${(size / 1000).toFixed(1)}kb`;
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

    ...mapMutations({
      UPDATE_PAYMENT_MODULE: "merchant/UPDATE_PAYMENT_MODULE",
      SET_PAYMENT_MODULE: "merchant/SET_PAYMENT_MODULE",
    }),

    updateShipping(options, currency) {
      const updated_shippings = [...options]?.map((option) => {
        return {
          name: option.shipping_type.value,
          time: option.duration.value,
          amount: Number(option.shipping_amount.value),
          currency_code: currency || this.shippingCurency,
        };
      });

      this.UPDATE_PAYMENT_MODULE({
        field: "shipping_types",
        data: updated_shippings,
      });
    },

    selectUserLocation(location) {
      this.selected_country = location;

      this.UPDATE_PAYMENT_MODULE({ field: "country_id", data: location.id });

      this.UPDATE_PAYMENT_MODULE({
        field: "country_name",
        data: location.name,
      });

      this.UPDATE_PAYMENT_MODULE({
        field: "currency_code",
        data: location.currency_code,
      });
    },

    updateName(data) {
      this.updateFormFieldMx(data, "module_name");

      this.UPDATE_PAYMENT_MODULE({
        field: "module_name",
        data: data?.value,
      });
    },

    selectUserCurrency() {},

    updateSavedConfig(config) {
      // long update phewwwww!!!!

      this.form = {
        module_name: {
          validated: !!config?.module_name,
          value: config?.module_name || "",
        },
      };

      this.bg_default = config.background_colour;
      this.btn_default = config.button_colour;
      this.request_address = config.request_street_address;
      this.request_country = config.request_country;
      this.request_phone = config.request_phone_number;

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

  .disabled-btn {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
