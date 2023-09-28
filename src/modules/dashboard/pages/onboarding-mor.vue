<template>
  <div class="col-12 col-md-10 col-xl-8 mor-onboarding mgb-40 pdb-40">
    <!-- <div class="page-title mgb-4 grey-900 h5-text">
      Merchant of Record (MoR)
    </div> -->

    <div class="page-meta grey-600 tertiary-2-text">
      Exapand the reach of your business using our Merchant of Record technology
      to easily deploy your services into diverse markets.
    </div>

    <div class="config-setup mgt-30">
      <!-- MOR COUNTRIES -->
      <FieldSetup
        title="Select countries to deploy MoR"
        description="Select the countries you wish to setup a new market."
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

      <!-- MOR DOCUMENTS -->
      <FieldSetup
        v-if="mor_selected_countries.length"
        title="Review MoR contracts"
        :description="`Please review the MoR contract for selected ${
          form.documents.length > 1 ? 'countries' : 'country'
        } and sign to be able to use MoR in those countries.`"
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
            v-if="country_selected"
            class="btn btn-md btn-primary"
            ref="btnRef"
            :disabled="isDisabled"
            @click="processMoROnboardingInfo"
          >
            Complete MoR onboarding
          </button>

          <button
            class="btn btn-md btn-primary"
            v-else
            @click="completeOnboarding(true)"
          >
            Skip MoR and Complete onboarding
          </button>
        </template>
      </FieldSetup>
    </div>

    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_congrat_dialog">
        <congratModal @closeTriggered="toggleCongratDialog" />
      </transition>
    </portal>
  </div>
</template>

<script>
import MoRSetup from "@/modules/merchant-of-records/modules/config/mixins/mor-setup";
import onboardingMixin from "@/modules/dashboard/mixins/onboarding-mixin";
import CountryHelper from "@/shared/mixins/mixin-country-helper";
import FieldSetup from "@/modules/merchant-of-records/modules/config/components/field-setup";
import WalletMixin from "@/modules/dashboard/mixins/wallet-mixin";

export default {
  name: "onboardingMoR",

  metaInfo: {
    title: "MoR Deployment",
    titleTemplate: "%s - Vesicash",
  },

  mixins: [CountryHelper, WalletMixin, onboardingMixin, MoRSetup],

  components: {
    FieldSetup,
    MoRDcoumentTable: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/config/components/mor-document-table"
      ),
    congratModal: () =>
      import(
        /* webpackChunkName: "onboarding-module" */ "@/modules/dashboard/modals/congrat-modal"
      ),
  },

  computed: {
    country_selected() {
      return this.form.countries.length ? true : false;
    },
  },

  data() {
    return {
      selected_country: false,
      show_congrat_dialog: false,
    };
  },

  created() {
    this.$bus.$on("reload-mor-wallets", () => {
      if (!this.getMoRwallets.length) this.loadMoRWalletSize();
    });
  },

  mounted() {
    this.$bus.$emit("toggle-page-loader");
    this.loadMoRWalletSize();
  },

  methods: {
    async completeOnboarding(skip_mor = false) {
      await this.handleOnboardingUpdate(null, true, skip_mor);
    },

    toggleCongratDialog() {
      this.show_congrat_dialog = !this.show_congrat_dialog;
    },
  },
};
</script>

<style lang="scss">
.mor-onboarding {
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
    width: max-content;
  }
}
</style>
