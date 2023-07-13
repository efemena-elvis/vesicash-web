<template>
  <div class="merchant-config">
    <!-- TOP AREA -->
    <div class="top-area mgb-32">
      <div class="page-title mgb-4 grey-900 h5-text">
        Merchant of Record (MoR)
      </div>

      <div class="page-meta grey-600 tertiary-2-text">
        For merchants who wish to open in other countries.
      </div>
    </div>

    <!-- BOTTOM AREA -->
    <div class="bottom-area mgb-40">
      <!-- MOR COUNTRIES -->
      <FieldSetup
        title="Select countries to deploy MoR for"
        description="Select the countries you wish to deploy Merchant of Records for."
      >
        <template slot="form-area">
          <div class="form-area">
            <DropSelectInput
              placeholder="Select country to deploy"
              @multiSelected="selectUserCountry($event)"
              :pre_select_multiple="pre_select_countries"
              :multi_options="mor_countries"
              :multi="true"
            />
          </div>
        </template>
      </FieldSetup>

      <!-- MOR COUNTRIES WALLET -->
      <FieldSetup
        title="Enable wallet to use"
        description="Your base wallets are already selected by default."
      >
        <template slot="form-area">
          <div class="form-area">
            <div class="wallet-area">
              <label
                :for="`wallet${index}`"
                class="pointer"
                v-for="(item, index) in getMoRwallets"
                :key="index"
              >
                <input
                  type="checkbox"
                  :id="`wallet${index}`"
                  class="mgr-8"
                  checked
                  :disabled="item.disable"
                />
                <div class="tertiary-2-text">
                  {{ item.base ? item.name : item.wallet }}
                </div>
              </label>
            </div>
          </div>
        </template>
      </FieldSetup>

      <!-- MOR BUSINESS CATEGORY -->
      <FieldSetup
        v-if="show_business_types"
        title="Select business category"
        description="Select a business category that your business belongs to."
      >
        <template slot="form-area">
          <div class="form-area">
            <DropSelectInput
              placeholder="Select business category"
              @selectedOption="selectUserBusiness($event)"
              :pre_select="pre_select_business_type"
              :options="getMorBusinessTypes"
            />
          </div>
        </template>
      </FieldSetup>

      <!-- MOR USE CASES -->
      <FieldSetup
        v-if="false"
        title="How will you like to use MoR"
        description="Select offline merchant if you already use MOR offline so we can process your offline transaction to your dashboard."
      >
        <template slot="form-area">
          <div class="form-area">
            <DropSelectInput
              placeholder="Select MoR usage"
              @selectedOption="selectUserMorCase($event - 1)"
              :pre_select="pre_select_use_case"
              :options="mor_use_case"
            />
          </div>
        </template>
      </FieldSetup>

      <!-- MOR DOCUMENTS -->
      <FieldSetup
        v-if="mor_selected_countries.length"
        title="Review MoR contracts"
        description="Please review the MoR contract for selected country and sign to be able to use MoR in those countries."
        expand
      >
        <template slot="form-area">
          <div class="w-100">
            <MoRDcoumentTable :dataset="form.documents" />
          </div>
        </template>
      </FieldSetup>

      <FieldSetup>
        <template slot="form-area">
          <button
            class="btn btn-md btn-primary"
            ref="btnRef"
            :disabled="isDisabled"
            @click="processMoROnboardingInfo"
          >
            Configure MoR
          </button>
        </template>
      </FieldSetup>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import countries from "@/utilities/countries";
import FieldSetup from "@/modules/merchant-of-records/modules/config/components/field-setup";

export default {
  name: "MerchantConfig",

  metaInfo: {
    title: "MoR Setup",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    FieldSetup,
    MoRDcoumentTable: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/config/components/mor-document-table"
      ),
  },

  computed: {
    ...mapGetters({
      getWalletSize: "general/getWalletSize",
    }),

    watchCountriesAndBusiness() {
      return {
        property1: this.mor_countries,
        property2: this.mor_business_types,
      };
    },

    isDisabled() {
      const { countries, usage_type, business_type_id, documents } = this.form;

      const isNotSigned = documents.some((doc) =>
        ["unsigned", "not_verified"].includes(doc.status)
      );

      return countries.length && usage_type && business_type_id && !isNotSigned
        ? false
        : true;
    },

    getMoRwallets() {
      return [...this.mor_wallet_list, ...this.mor_selected_countries];
    },

    getMorBusinessTypes() {
      return this.mor_business_types;
    },
  },

  watch: {
    watchCountriesAndBusiness: {
      handler({ property1, property2 }) {
        if (property1.length && property2.length) {
          this.getMoROnboardingInfo();
        }
      },
      deep: true,
    },
  },

  data() {
    return {
      base_countries: countries,
      show_business_types: false,

      mor_countries: [],
      mor_business_types: [],
      mor_use_case: [
        {
          id: 1,
          name: "Offline Merchant",
          slug: "offline",
        },
        // {
        //   id: 2,
        //   name: "Online Merchant",
        //   slug: "online",
        // },
      ],

      mor_wallet_list: [],
      mor_selected_countries: [],

      pre_select_countries: [],
      pre_select_business_type: null,
      pre_select_use_case: null,

      form: {
        countries: [],
        wallet_currency_codes: [],
        business_type_id: null,
        usage_type: "offline", // offline | online
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
    this.loadMoRBusinessTypes();
    this.loadMoRCountries();

    this.$bus.$on("signedMoR", (data) => this.signMoRContract(data));
  },

  mounted() {
    this.$bus.$emit("toggle-page-loader");
    this.loadMoRWalletSize();

    console.log(this.getUser.business_type);
  },

  methods: {
    ...mapActions({
      fetchMoRCountries: "merchant/fetchMoRCountries",
      fetchMoRBusinessTypes: "merchant/fetchMoRBusinessTypes",
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

      const foreign_country_data = {
        country: "United States",
        code: "us",
      };

      const exclude_countries = [
        base_country_data.code.toUpperCase(),
        foreign_country_data.code.toUpperCase(),
      ];

      if (type === "filter") {
        return country_list.filter(
          (country) =>
            !exclude_countries.includes(country.country_short.toUpperCase())
        );
      } else {
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

      if (business_type_id) this.show_business_types = false;

      this.form.business_type_id = business_type_id;
      this.form.usage_type = usage_type;

      this.pre_select_business_type = this.getMorBusinessTypes.find(
        (business) => business.id === business_type_id
      );

      this.pre_select_use_case = this.mor_use_case.find(
        (item) => item.slug === usage_type
      );

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
      this.checkAndUpdateMerchantStatus(verifications);
    },

    checkAndUpdateMerchantStatus(verifications) {
      if (!this.isMoRSetupEnabled) {
        const is_verified = verifications.some(
          (verification) => verification.status === "verified"
        );

        if (is_verified) {
          const user_payload = {
            ...this.getUser,
            is_merchant: true,
          };

          this.UPDATE_AUTH_USER(user_payload);
        }
      }
    },

    async processMoROnboardingInfo() {
      await this.handleDataRequest({
        action: "saveMoROnboarding",
        payload: this.form,
        btn_text: "Configure MoR",
        alert_handler: {
          success: "MoR onboarding info has been submitted successfully",
          error: "Unable to configure MoR at the moment",
          request_error: "MoR onboarding info are not valid",
        },
      });
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

    // FETCH ALL MoR BUSINESS TYPES
    async loadMoRBusinessTypes() {
      const response = await this.handleDataRequest({
        action: "fetchMoRBusinessTypes",
        alert_handler: {
          error: "Unable to fetch MoR business types",
          request_error: "Unable to fetch MoR business types",
        },
      });

      if (response.code === 200) {
        this.mor_business_types = response.data;

        if (this.getUser.business_type) {
          this.show_business_types = false;

          this.form.business_type_id = this.mor_business_types.find(
            (business) => business.name === this.getUser.business_type
          ).id;
        } else {
          this.show_business_types = true;
        }
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
</script>

<style lang="scss" scoped>
.merchant-config {
  .form-area {
    .wallet-area {
      @include flex-row-wrap("flex-start", "center");
      gap: toRem(32);

      label {
        @include flex-row-wrap("flex-start", "center");
      }
    }
  }

  .btn {
    padding: toRem(10) toRem(22);
    width: toRem(170);
  }
}
</style>
