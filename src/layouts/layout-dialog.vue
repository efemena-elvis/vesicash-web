<template>
  <!-- VESICASH APP CONTAINER -->
  <div class="app-container">
    <!-- CENTERED PLACED SECTION -->
    <div class="auth-area position-relative mgt-40">
      <!-- VESICASH FEATHER BRAND LOGO -->
      <a
        href="https://vesicash.com"
        class="brand-logo mgb-32 text-center d-flex justify-content-center"
        style="width: max-width"
      >
        <VesicashBrandLogo type="light" />
      </a>

      <!-- AUTH ENTRY VIEW -->
      <div class="auth-entry-view mx-auto">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import VesicashBrandLogo from "@/shared/components/icon-comps/vesicash-brand-logo";

export default {
  name: "layoutDialog",

  components: {
    VesicashBrandLogo,
  },

  data: () => ({}),

  mounted() {
    this.$utils.setPageBackgroundColor("#011a27");
  },
};
</script>

<style lang="scss" scoped>
.auth-area {
  .auth-entry-view {
    width: 30%;

    @include breakpoint-down(lg) {
      width: 50%;
    }

    @include breakpoint-down(md) {
      width: 60%;
    }

    @include breakpoint-down(sm) {
      width: 80%;
    }

    @include breakpoint-down(xs) {
      width: 100%;
    }
  }

  .brand-logo {
    svg {
      width: toRem(160);
      height: auto;
    }
  }
}
</style>
