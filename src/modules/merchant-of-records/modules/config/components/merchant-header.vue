<template>
  <div class="merchant-header w-100 teal-800-bg rounded-8 mgb-35">
    <div class="top-intro position-relative mgb-10">
      <div class="top-line w-100"></div>
      <div class="top-text text-center teal-200 secondary-3-text roobert-400">
        INTRODUCING
      </div>
    </div>

    <!-- HEADER TEXT -->
    <div class="header-text roobert-700 green-200">
      Merchant of Records (MoR)
    </div>

    <!-- HEADER META -->
    <div class="header-meta neutral-10 roobert-400">
      Powering Seamless Transactions!
    </div>
  </div>
</template>

<script>
export default {
  name: "MerchantHeader",
};
</script>

<style lang="scss" scoped>
.merchant-header {
  @include flex-column("center", "center");
  padding: toRem(38) toRem(30);

  @include breakpoint-down(md) {
    padding: toRem(30);
  }

  @include breakpoint-down(sm) {
    padding: toRem(26) toRem(20);
    margin-bottom: toRem(26) !important;
  }

  .top-intro {
    @include flex-row-nowrap("center", "center");
    width: 50%;

    @include breakpoint-down(md) {
      width: 70%;
    }

    @include breakpoint-down(xs) {
      width: 80%;
    }

    @include breakpoint-down(sm) {
      margin-bottom: toRem(8) !important;
    }

    .top-line {
      background: rgba(getColor("teal-50"), 0.6);
      @include center-placement("y-axis");
      height: toRem(0.75);
    }

    .top-text {
      background: getColor("teal-800");
      padding: 0 toRem(10);
      position: relative;
      width: max-content;

      @include breakpoint-down(sm) {
        font-size: toRem(11);
      }

      @include breakpoint-down(xs) {
        font-size: toRem(10.5);
      }
    }
  }

  .header-text {
    font-size: toRem(44);

    @include breakpoint-down(md) {
      font-size: toRem(36);
    }

    @include breakpoint-custom-down(680) {
      font-size: toRem(34);
    }

    @include breakpoint-down(sm) {
      font-size: toRem(30);
    }

    @include breakpoint-down(xs) {
      font-size: toRem(24);
    }
  }

  .header-meta {
    @include breakpoint-down(md) {
      font-size: toRem(15);
    }

    @include breakpoint-down(sm) {
      font-size: toRem(14);
    }

    @include breakpoint-down(xs) {
      font-size: toRem(13.5);
    }
  }
}
</style>
