<template>
  <div class="payment-module">
    <div class="title-row mgb-32 mgt-12">
      <div class="title-text h5-text grey-900">Your payment modules</div>

      <router-link
        class="btn btn-md btn-primary"
        :to="{ name: 'MerchantModuleCustomer' }"
        >Create payment module</router-link
      >
    </div>

    <!-- PAYMENT MODULES -->
    <div class="payment-modules">
      <div class="row">
        <div class="col-6 col-md-4" v-for="module in modules" :key="module.id">
          <ModuleCard :module="module" @refresh="$emit('refresh')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleCard from "@/modules/merchant-of-records/modules/developer/components/payment-module/module-card";

export default {
  name: "PaymentModuleContent",

  components: {
    ModuleCard,
  },

  props: {
    modules: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-module {
  .title-row {
    @include flex-row-nowrap("space-between", "center");
  }

  .payment-modules {
  }
}
</style>
