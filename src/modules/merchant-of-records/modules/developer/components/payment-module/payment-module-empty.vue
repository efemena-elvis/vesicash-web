<template>
  <div class="payment-module">
    <div class="icon-wrapper mgb-8">
      <img
        v-lazy="loadImage('payment-merchant-icon.png')"
        alt="payment-merchant-icon"
      />
    </div>

    <div class="title-text h5-text grey-900 mgb-8 text-center">
      Payment modules
    </div>

    <div
      class="description-text tertiary-2-text grey-600 mgb-24 text-center"
      v-if="isMoRSetupEnabled"
    >
      You don't have any payment modules created yet. Click create payment
      module to get started
    </div>

    <div
      class="description-text tertiary-2-text grey-600 mgb-24 text-center"
      v-else
    >
      You don't have a Merchant of Record deployed for any country yet
    </div>

    <router-link
      v-if="isMoRSetupEnabled"
      :to="{ name: 'MerchantModuleCustomer' }"
      class="btn btn-md btn-primary"
      >Create payment module</router-link
    >

    <router-link v-else to="/settings/mor-setup" class="btn btn-md btn-primary"
      >Deploy a Merchant of Record</router-link
    >
  </div>
</template>

<script>
export default {
  name: "PaymentModuleEmpty",

  components: {},
};
</script>

<style lang="scss" scoped>
.payment-module {
  @include flex-column("center", "center");
  height: 72vh;

  .icon-wrapper {
    img {
      @include draw-shape(64);
    }
  }

  .description-text {
    width: 30%;
  }
}
</style>
