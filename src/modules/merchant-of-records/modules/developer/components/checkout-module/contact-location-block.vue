<template>
  <div
    class="customer-location-block rounded-8 mgb-24 pd-24 neutral-10-bg border-grey-100"
  >
    <div class="title-text grey-900 mgb-24 primary-1-text">
      CUSTOMER LOCATION
    </div>

    <div class="form-group mgb-4">
      <div class="form-label">Select location</div>
      <DropSelectInput
        placeholder="Select location"
        @optionSelected="selectUserLocation($event)"
        :options="morCountries"
        :pre_select="country"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import countries from "@/utilities/countries";

export default {
  name: "CustomerLocationBlock",

  computed: {
    ...mapGetters({
      getMorCountries: "merchant/getMorCountries",
      getWalletSize: "general/getWalletSize",
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
    }),

    morCountries() {
      let mor_countries = [];
      let mor_wallets = this.getWalletSize.filter((wallet) => wallet.mor);

      this.getMorCountries.map((country) => {
        if (
          mor_wallets.some((wallet) => wallet.short === country.currency_code)
        ) {
          if (country.currency_code === "USD") {
            mor_countries.push({ ...country, name: "United States" });
          } else mor_countries.push(country);
        }
      });

      return [...mor_countries];
    },
  },

  data: () => ({
    country: null,
    selected_country: null,
    location_options: [],
  }),

  watch: {
    getMorCountries: {
      handler(countries) {
        const config = this.getPaymentModuleConfig;
        this.updateCountryWithConfig(config, countries);
      },
      immediate: true,
    },
  },

  mounted() {
    const id = this.$route?.query?.id;

    id && !this.getPaymentModuleConfig?.saved
      ? this.fetchSavedModule(id)
      : null;

    if (!this.getMorCountries.length && !id) this.fetchMoRCountries();
  },

  methods: {
    ...mapActions({
      fetchMoRCountries: "merchant/fetchMoRCountries",
      fetchPaymentModule: "merchant/fetchPaymentModule",
    }),

    ...mapMutations({
      UPDATE_PAYMENT_MODULE: "merchant/UPDATE_PAYMENT_MODULE",
      SET_PAYMENT_MODULE: "merchant/SET_PAYMENT_MODULE",
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
          country_id: data?.country_id || 0,
          country_name:
            countries?.find((cc) => cc?.id === data?.country_id)?.name || "",
          currency_code: data?.currency_code || "",
          saved: true,
        };
        this.updateCountryWithConfig(config, countries);
        // this.updateSavedConfig(config);
        this.SET_PAYMENT_MODULE(config);
      }
    },

    selectUserLocation(location) {
      this.selected_country = location;

      let country_data = countries.find(
        (country) => country.currency.short === location.currency_code
      );

      this.UPDATE_PAYMENT_MODULE({ field: "country_id", data: location.id });

      this.UPDATE_PAYMENT_MODULE({
        field: "country_name",
        data: location.name,
      });

      this.UPDATE_PAYMENT_MODULE({
        field: "country_code",
        data: country_data.code.toUpperCase(),
      });

      this.UPDATE_PAYMENT_MODULE({
        field: "currency_code",
        data: location.currency_code,
      });

      this.UPDATE_PAYMENT_MODULE({
        field: "currency_sign",
        data: country_data.currency.sign,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
