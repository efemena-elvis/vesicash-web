<template>
  <div class="payment-module">
    <div class="skeleton-container" v-if="loading">
      <div class="skeleton-loader"></div>
      <div class="skeleton-loader"></div>
      <div class="skeleton-loader"></div>
      <div class="skeleton-loader"></div>
    </div>
    <component
      :is="payment_view"
      :modules="modules"
      @refresh="fetchModules"
      v-else
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import PaymentModuleEmpty from "@/modules/merchant-of-records/modules/developer/components/payment-module/payment-module-empty";

export default {
  name: "PaymentModule",

  metaInfo: {
    title: "Payment Modules",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    PaymentModuleEmpty,
    PaymentModuleContent: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/developer/components/payment-module/payment-module-content"
      ),
  },

  data: () => ({
    payment_view: "PaymentModuleEmpty",
    loading: false,
    modules: [],
  }),

  computed: {
    ...mapGetters({ getMorCountries: "merchant/getMorCountries" }),
  },

  methods: {
    ...mapActions({
      fetchPaymentModules: "merchant/fetchPaymentModules",
      fetchMoRCountries: "merchant/fetchMoRCountries",
    }),

    ...mapMutations({
      RESET_PAYMENT_MODULE: "merchant/RESET_PAYMENT_MODULE",
    }),

    async fetchModules() {
      this.loading = true;
      const response = await this.fetchPaymentModules();
      this.loading = false;
      if (response?.data?.length) {
        this.modules = response?.data;
        this.payment_view = "PaymentModuleContent";
      }
    },
  },

  async mounted() {
    this.RESET_PAYMENT_MODULE();
    if (!this.getMorCountries.length) this.fetchMoRCountries();
    if (this.isMoRSetupEnabled) this.fetchModules();
  },
};
</script>

<style lang="scss" scoped>
.payment-module {
  .skeleton-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: toRem(50);
    margin-top: toRem(50);

    .skeleton-loader {
      height: toRem(150);
    }
  }
}
</style>
