<template>
  <div class="order-display-card pdb-16 mgb-16">
    <div class="img-card rounded-8 teal-100-bg"></div>

    <div class="details w-100">
      <div>
        <div class="title-text">Banana flakes</div>
        <div class="meta-text tertiary-2-text grey-600">4 pcs</div>
      </div>

      <div>N7,000</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderDisplayCard",
};
</script>

<style lang="scss" scoped>
.order-display-card {
  @include flex-row-nowrap("flex-start", "flex-start");
  border-bottom: toRem(0.5) solid getColor("grey-200");
  @include generate-font-type("secondary-1");
  color: getColor("grey-900");

  .img-card {
    @include draw-shape(70);
    margin-right: toRem(16);
  }

  .details {
    @include flex-row-nowrap("space-between", "flex-start");
  }
}
</style>
