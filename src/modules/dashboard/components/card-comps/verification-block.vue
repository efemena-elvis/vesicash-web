<template>
  <div class="verification-block border-grey-100 rounded-12 mgb-32">
    <!-- TOP ROW -->
    <div class="top-row mgb-16">
      <div class="progress-bar"></div>

      <div>
        <div class="title-text primary-1-text grey-900">Setup your account</div>
        <div class="description-text tertiary-2-text grey-600">
          Complete your account setup to explore more of vesicash’s features
        </div>
      </div>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row">
      <div class="action-card">
        <div class="action-text">Bank Verification Number</div>
        <div class="action-indicator"></div>
      </div>

      <div class="action-card">
        <div class="action-text">Business Registration Number</div>
        <div class="action-indicator"></div>
      </div>

      <div class="action-card">
        <div class="action-text">Tax Identification Number</div>
        <div class="action-indicator"></div>
      </div>

      <div class="action-card">
        <div class="action-text">National Identity Number</div>
        <div class="action-indicator"></div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "VerificationBlock",
};
</script>
  
  <style lang="scss" scoped>
.verification-block {
  padding: toRem(16) toRem(24);

  .top-row {
    @include flex-row-nowrap("flex-start", "center");
    // gap: toRem(16);
  }

  .bottom-row {
    @include flex-row-wrap("flex-start", "flex-start");
    gap: toRem(24);

    .action-card {
      @include flex-row-nowrap("space-between", "center");
      border: toRem(1) solid getColor("grey-200");
      background: rgba(#f5f6ff, 0.5);
      padding: toRem(8) toRem(12);
      @include transition(0.3s);
      border-radius: toRem(8);
      width: toRem(196);
      cursor: pointer;
      gap: toRem(8);
      height: auto;

      &:hover {
        transform: scale(0.98);
      }

      .action-text {
        @include font-height(14, 19, 500);
        color: getColor("grey-900");
      }

      .action-indicator {
        border: toRem(1) solid getColor("grey-300");
        @include draw-shape(18);
        border-radius: 50%;
      }
    }
  }
}
</style>
  