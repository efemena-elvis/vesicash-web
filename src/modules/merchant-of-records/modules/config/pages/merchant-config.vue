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
        description="Select the countries you wish to deploy Merchant of Record for."
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
import MoRSetup from "@/modules/merchant-of-records/modules/config/mixins/mor-setup";
import CountryHelper from "@/shared/mixins/mixin-country-helper";
import FieldSetup from "@/modules/merchant-of-records/modules/config/components/field-setup";

export default {
  name: "MerchantConfig",

  mixins: [CountryHelper, MoRSetup],

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

  mounted() {
    this.$bus.$emit("toggle-page-loader");
    this.loadMoRWalletSize();
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
