import { mapActions } from "vuex";
import countries from "@/utilities/countries";

const countryHelper = {
  data: () => ({
    show_dropdown: false,
    countries_data: countries,
    current_country: {
      country: "Nigeria",
      dialing_code: "234",
      code: "ng",
      flag: "https://flagsapi.com/NG/flat/64.png",
      currency: {
        sign: "₦",
        short: "NGN",
        long: "Naira",
        description: "Nigerian Naira",
      },
    },
  }),

  created() {
    const saved_country_data = this.$storage.getStorage({
      storage_name: "base_country_data",
      storage_type: "object",
    });

    saved_country_data === null && this.loadCurrentUserLocation();
  },

  methods: {
    ...mapActions({
      getMyLocation: "general/getMyLocation",
    }),

    toggleDropdown() {
      this.show_dropdown = !this.show_dropdown;
    },

    forceClose() {
      this.show_dropdown = false;
    },

    determineTargetArea($event) {
      if (!$event.target.classList.contains("ignore")) this.forceClose();
    },

    // ==============================
    // LOAD CURRENT USER LOCATION
    // ==============================
    async loadCurrentUserLocation() {
      const response = await this.handleDataRequest({
        action: "getMyLocation",
        payload: "",
      });

      let country_code = response?.split(";")[1]?.toLowerCase() ?? "ng";
      this.current_country = this.countries_data.find(
        (country) => country.code === country_code
      );

      this.$storage.setStorage({
        storage_name: "base_country_data",
        storage_value: this.current_country,
        storage_type: "object",
      });
    },
  },
};

export default countryHelper;
