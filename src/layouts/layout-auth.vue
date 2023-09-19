<template>
  <!-- VESICASH APP CONTAINER -->
  <div class="layout-auth">
    <!-- FORM SECTION -->
    <div class="form-section h-100">
      <div class="section-wrapper h-100">
        <!-- VESICASH FEATHER BRAND LOGO -->
        <a href="https://vesicash.com" class="brand-logo">
          <VesicashBrandLogo />
        </a>

        <!-- AUTH ENTRY VIEW -->
        <div class="form-wrapper h-100 w-100">
          <div class="auth-entry-view mx-auto w-100">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- BANNER IMAGE SECTION -->
    <div class="banner-image-section h-100">
      <div
        class="image-wrapper position-relative w-100 h-100 m-auto overflow-hidden"
      >
        <img :src="loadImage('banner-img.png')" alt="vesicash-banner-image" />
      </div>
    </div>
  </div>
</template>

<script>
import VesicashBrandLogo from "@/shared/components/icon-comps/vesicash-brand-logo";

export default {
  name: "layoutAuth",

  components: {
    VesicashBrandLogo,
  },

  data: () => ({}),

  mounted() {
    this.$utils.setPageBackgroundColor("#ffffff");
  },
};
</script>

<style lang="scss" scoped>
.layout-auth {
  @include flex-row-nowrap("flex-start", "center");
  position: relative;
  height: 100vh;

  .form-section {
    width: 48%;

    @include breakpoint-custom-down(1200) {
      width: 50%;
    }

    @include breakpoint-down(lg) {
      width: 52%;
    }

    @include breakpoint-down(md) {
      width: 100%;
    }

    .section-wrapper {
      @include flex-column("flex-start", "flex-start");
      padding: toRem(60) toRem(155);

      @include breakpoint-custom-down(1200) {
        padding: toRem(60) toRem(120);
      }

      @include breakpoint-down(lg) {
        padding: toRem(60) toRem(60);
      }

      @include breakpoint-down(md) {
        padding: toRem(60) toRem(120);
      }

      @include breakpoint-down(sm) {
        padding: toRem(60) toRem(60);
      }

      @include breakpoint-down(xs) {
        padding: toRem(60) toRem(30);
      }

      @include breakpoint-custom-down(400) {
        padding: toRem(60) toRem(20);
      }

      .brand-logo {
        position: relative;
        left: toRem(-1);

        svg {
          width: toRem(165);
          height: auto;

          @include breakpoint-down(sm) {
            width: toRem(170);
          }
        }
      }
    }
  }

  .banner-image-section {
    @include flex-column("center", "center");
    position: fixed;
    width: 52%;
    right: 0;

    @include breakpoint-custom-down(1200) {
      width: 50%;
    }

    @include breakpoint-down(lg) {
      width: 48%;
    }

    @include breakpoint-down(md) {
      display: none;
    }

    .image-wrapper {
      img {
        @include set-full-bg;
      }
    }
  }
}
</style>
