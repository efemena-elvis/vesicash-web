<template>
  <div class="payment-module">
    <component :is="payment_view" />
  </div>
</template>

<script>
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
    payment_view: "PaymentModuleContent",
  }),
};
</script>

<style lang="scss" scoped>
.payment-module {
}
</style>
