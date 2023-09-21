import { mapActions, mapMutations, mapGetters } from "vuex";
import countries from "@/utilities/countries";

const morSetup = {
  computed: {
    ...mapGetters({
      getWalletSize: "general/getWalletSize",
    }),

    watchMoRCountries() {
      return {
        property1: this.mor_countries,
      };
    },

    isDisabled() {
      const { countries, documents } = this.form;

      const isNotSigned = documents.some((doc) =>
        ["unsigned", "not_verified"].includes(doc.status)
      );

      return countries.length && !isNotSigned ? false : true;
    },

    getMoRwallets() {
      return [...this.mor_wallet_list, ...this.mor_selected_countries];
    },

    getMorBusinessTypes() {
      return this.mor_business_types;
    },
  },

  watch: {
    watchMoRCountries: {
      handler({ property1 }) {
        if (property1.length) {
          this.getMoROnboardingInfo();
        }
      },
      deep: true,
    },
  },

  data() {
    return {
      base_countries: countries,
      mor_countries: [],
      mor_wallet_list: [],
      mor_selected_countries: [],

      pre_select_countries: [],

      form: {
        countries: [],
        wallet_currency_codes: [],
        business_type_id: 1,
        usage_type: "online", // offline | online
        documents: [
          // {
          //   status: "unsigned", // unsigned | pending | verified | not_verified
          //   country_id: null,
          //   country_data: {
          //     name: "",
          //     currency: "",
          //   },
          // },
        ],
      },
    };
  },

  created() {
    this.loadMoRCountries();
    this.$bus.$on("signedMoR", (data) => this.signMoRContract(data));
  },

  methods: {
    ...mapActions({
      fetchMoRCountries: "merchant/fetchMoRCountries",
      fetchMoROnboarding: "merchant/fetchMoROnboarding",
      saveMoROnboarding: "merchant/saveMoROnboarding",
    }),

    ...mapMutations({ UPDATE_AUTH_USER: "auth/UPDATE_AUTH_USER" }),

    signMoRContract(country) {
      const country_index = this.form.documents.findIndex(
        (doc) => doc.country_id === country.country_id
      );

      this.form.documents[country_index].status = "pending";
    },

    invalidateBaseAndForeignWallet(country_list, type = "filter") {
      // type => filter/disable

      const base_country_data = this.$storage.getStorage({
        storage_name: "base_country_data",
        storage_type: "object",
      });

      const us_country_data = {
        country: "United States",
        code: "us",
      };

      const uk_country_data = {
        country: "United Kingdom",
        code: "gb",
      };

      const exclude_countries = [
        base_country_data.code.toUpperCase(),
        us_country_data.code.toUpperCase(),
        uk_country_data.code.toUpperCase(),
      ];

      if (type === "filter") {
        return country_list.filter(
          (country) =>
            !exclude_countries.includes(country.country_short.toUpperCase())
        );
      } else {
        country_list = country_list.slice(1);
        country_list.map((country) => {
          if (exclude_countries.includes(country.code.toUpperCase())) {
            country.disable = true;
          } else {
            country.disable = false;
          }
        });

        return country_list;
      }
    },

    // FETCH MOR ONBOARDING DETAILS
    async getMoROnboardingInfo() {
      const response = await this.handleDataRequest({
        action: "fetchMoROnboarding",
        alert_handler: {
          error: "Unable to fetch MoR onboarding info",
          request_error: "Unable to fetch MoR onboarding info",
        },
      });

      if (response.code === 200 && response.data !== null) {
        this.populateMoRDataset(response.data);
      } else this.$bus.$emit("toggle-page-loader");
    },

    populateMoRDataset(dataset) {
      const { business_type_id, usage_type, countries, verifications } =
        dataset;

      this.form.business_type_id = business_type_id;
      this.form.usage_type = usage_type;

      this.pre_select_countries = this.mor_countries.filter((country) =>
        countries.some((item) => item.id === country.id)
      );

      this.$bus.$emit("preSelectMultiple", this.pre_select_countries);

      this.mor_countries.map((country) => {
        if (countries.some((item) => item.id === country.id)) {
          this.mor_selected_countries.push({
            base: false,
            code: country.code,
            id: country.id,
            name: country.name,
            selected: true,
            wallet: country.wallet,
          });
        }
      });

      this.selectUserCountry(this.mor_selected_countries, true);

      verifications.map((verification) => {
        this.form.documents.find(
          (doc) => doc.country_id === verification.country_id
        ).status = verification.status;
      });

      this.$bus.$emit("toggle-page-loader");
    },

    async processMoROnboardingInfo() {
      const response = await this.handleDataRequest({
        action: "saveMoROnboarding",
        payload: this.form,
        btn_text: "Configure MoR",
        alert_handler: {
          success: "MoR onboarding info has been submitted successfully",
          error: "Unable to configure MoR at the moment",
          request_error: "MoR onboarding info are not valid",
        },
      });

      if (response.code === 200) {
        // CHECK IF MOR ONBOARDING
        if (this.$route.name === "VesicashMoROnboarding") {
          await this.completeOnboarding();
        }
      }
    },

    // FETCH ALL MoR COUNTRIES
    async loadMoRCountries() {
      const response = await this.handleDataRequest({
        action: "fetchMoRCountries",
        alert_handler: {
          error: "Unable to fetch MoR countries",
          request_error: "Unable to fetch MoR countries",
        },
      });

      if (response.code === 200) {
        const mor_country_list = response.data;

        mor_country_list.map((country) => {
          let country_data = this.base_countries.find(
            (data) => data.country === country.name
          );

          country_data = {
            id: country.id,
            name: country_data.country,
            code: country.currency_code.toUpperCase(), // NGN
            wallet: `${country.currency_code} wallet`,
            country_short: country_data.code, // ng
            base: false,
          };

          this.mor_countries.push(country_data);
        });

        this.mor_countries = this.invalidateBaseAndForeignWallet(
          this.mor_countries
        );
      }
    },

    loadMoRWalletSize() {
      this.getWalletSize
        .filter(
          (wallet) =>
            wallet.enabled && !wallet.short.includes("ESCROW") && !wallet?.mor
        )
        .map((wallet_type) => {
          this.mor_wallet_list.push({
            id: wallet_type.id,
            name: `${wallet_type.short} wallet`,
            slug: wallet_type.long.toLowerCase(),
            short: wallet_type.short,
            code: wallet_type.code.toUpperCase(),
            base: true,
          });
        });

      this.mor_wallet_list = this.invalidateBaseAndForeignWallet(
        this.mor_wallet_list,
        "disable"
      );
    },

    selectUserCountry(selections, is_signed = false) {
      this.mor_selected_countries = selections;

      this.form.countries = [];
      this.form.wallet_currency_codes = [];

      this.mor_selected_countries.map((country) => {
        this.form.countries.push(country.id);
        this.form.wallet_currency_codes.push(country?.code);

        let countryInDocument = this.form.documents.some(
          (item) => item.country_id === country.id
        );

        if (!countryInDocument) {
          this.form.documents.push({
            status: is_signed ? "pending" : "unsigned",
            country_id: country.id,
            country_data: {
              name: country?.name,
              currency: country?.code,
            },
          });
        }
      });

      this.form.documents.map((doc) => {
        let docInCountry = this.mor_selected_countries.some(
          (country) => country.id === doc.country_id
        );

        if (!docInCountry) {
          this.form.documents = this.form.documents.filter(
            (item) => item.country_id !== doc.country_id
          );
        }
      });
    },

    selectUserBusiness(selection) {
      this.form.business_type_id = selection;
    },

    selectUserMorCase(selection) {
      this.form.usage_type = this.mor_use_case[selection].slug;
    },
  },
};

export default morSetup;
