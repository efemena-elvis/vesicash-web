<template>
  <div class="preview-wrapper grey-50-bg rounded-8">
    <!-- BRAND LOGO -->
    <div class="brand-logo position-relative mgb-24 h-auto">
      <img :src="loadImage('vesicash-svg.svg')" alt="" />
    </div>

    <div class="module-name h4-text grey-900 mgb-24">Checkout page</div>

    <slot name="preview-area"></slot>
  </div>
</template>

<script>
export default {
  name: "PreviewWrapper",
};
</script>

<style lang="scss" scoped>
.preview-wrapper {
  padding: toRem(24);

  .brand-logo {
    width: toRem(150);

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
