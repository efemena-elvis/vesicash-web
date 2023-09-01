<template>
  <div
    class="preview-wrapper grey-50-bg rounded-8"
    :style="{
      backgroundColor: getPaymentModuleConfig.background_colour,
    }"
  >
    <!-- BRAND LOGO -->
    <div class="brand-logo position-relative mgb-24 h-auto">
      <img
        :src="getPaymentModuleConfig.logo_url"
        alt="Brand logo"
        v-if="getPaymentModuleConfig.logo_url"
      />
      <img
        :src="loadImage('vesicash-svg.svg')"
        alt="Vesicash brand"
        style="height: 60px"
        v-else
      />
    </div>

    <div class="module-name h4-text grey-900 mgb-24">Checkout page</div>

    <slot name="preview-area"></slot>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "PreviewWrapper",

  computed: {
    ...mapGetters({
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
    }),
  },
};
</script>

<style lang="scss" scoped>
.preview-wrapper {
  padding: toRem(24);

  .brand-logo {
    width: 100%;
    max-height: toRem(100);
    margin: auto;

    img {
      min-width: 80%;
      max-width: 100%;
      height: auto;
      max-height: inherit;
      object-fit: contain;
      display: block;
      margin: auto;
    }
  }
}
</style>
