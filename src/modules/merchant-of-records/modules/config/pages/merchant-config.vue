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
        title="Select countries to deploy MOR for"
        description="Select the countries you wish to deploy Merchant of Records for."
      >
        <template slot="form-area">
          <div class="form-area">
            <DropSelectInput
              placeholder="Select country to deploy"
              @selectedOption="selectUserCountry($event)"
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
              <label for="wallet1" class="pointer">
                <input
                  type="checkbox"
                  id="wallet1"
                  class="mgr-8"
                  checked
                  disabled
                />
                <div class="tertiary-2-text">NGN wallet</div>
              </label>

              <label for="wallet2" class="pointer">
                <input type="checkbox" id="wallet2" class="mgr-8" />
                <div class="tertiary-2-text">USD wallet</div>
              </label>
            </div>
          </div>
        </template>
      </FieldSetup>

      <!-- MOR BUSINESS CATEGORY -->
      <FieldSetup
        title="Select business category"
        description="Select a business category that your business belongs to."
      >
        <template slot="form-area">
          <div class="form-area">
            <DropSelectInput
              placeholder="Select business category"
              @selectedOption="selectUserBusiness($event)"
              :options="mor_business_types"
            />
          </div>
        </template>
      </FieldSetup>

      <!-- MOR USE CASES -->
      <FieldSetup
        title="How will you like to use MoR"
        description="Select offline merchant if you already use MOR offline so we can process your offline transaction to your dashboard."
      >
        <template slot="form-area">
          <div class="form-area">
            <DropSelectInput
              placeholder="Select MoR usage"
              @selectedOption="selectUserMorCase($event)"
              :options="mor_use_case"
            />
          </div>
        </template>
      </FieldSetup>

      <!-- MOR DOCUMENTS -->
      <FieldSetup
        title="Download MoR documents"
        description="Please download, fill and submit the MOR forms to be able to use MOR in those countries."
      >
        <template slot="form-area">
          <div class="document-area">
            <PageSwitcher
              :page_data="pages"
              :full_width="false"
              @swapItem="updateMoRPageView($event)"
            />
          </div>

          <transition-group>
            <template v-if="mor_document_view === 'download'">
              <div key="1">
                <MoRDcoumentRow card_type="download" />
                <MoRDcoumentRow card_type="download" />
              </div>
            </template>

            <template v-else>
              <div key="2">
                <MoRDcoumentRow card_type="upload" />
              </div>
            </template>
          </transition-group>
        </template>
      </FieldSetup>

      <FieldSetup>
        <template slot="form-area">
          <button class="btn btn-md btn-primary">Submit</button>
        </template>
      </FieldSetup>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import countries from "@/utilities/countries";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";
import FieldSetup from "@/modules/merchant-of-records/modules/config/components/field-setup";

export default {
  name: "MerchantConfig",

  metaInfo: {
    title: "MoR Setup",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    FieldSetup,
    PageSwitcher,
    MoRDcoumentRow: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/config/components/mor-document-row"
      ),
  },

  computed: {
    ...mapGetters({
      getMorCountries: "merchant/getMorCountries",
      getMorBusinessTypes: "merchant/getMorBusinessTypes",
      getWalletSize: "general/getWalletSize",
    }),
  },

  data: () => ({
    base_countries: countries,

    mor_countries: [],
    mor_business_types: [],
    mor_use_case: [
      {
        id: 1,
        name: "Offline Merchant",
        slug: "offline",
      },
      {
        id: 2,
        name: "Online Merchant",
        slug: "online",
      },
    ],

    mor_wallet_list: [],

    mor_document_view: "download",
    pages: [
      {
        title: "MoR Downloads",
        value: "download",
        active: true,
      },
      {
        title: "MoR Uploads",
        value: "upload",
        active: false,
      },
    ],
  }),

  mounted() {
    this.loadMoRCountries();
    this.loadMoRBusinessTypes();
    this.loadMoRWalletSize();
  },

  methods: {
    ...mapActions({
      fetchMoRCountries: "merchant/fetchMoRCountries",
      fetchMoRBusinessTypes: "merchant/fetchMoRBusinessTypes",
    }),

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
            ...country_data,
            id: this.$utils.getRandomString(7),
            name: country_data.country,
          };

          this.mor_countries.push(country_data);
        });
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
      }
    },

    // MANUALLY UPDATE TRANSACTION CHANGES
    updateMoRPageView(selected_value) {
      this.mor_document_view = selected_value;
      this.pages.find((page) => page.value === selected_value).active = true;
    },

    loadMoRWalletSize() {},

    selectUserCountry() {},

    selectUserBusiness() {},

    selectUserMorCase() {},
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
