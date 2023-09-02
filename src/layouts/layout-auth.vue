<template>
  <!-- VESICASH APP CONTAINER -->
  <div class="layout-auth">

    <!-- FORM SECTION -->
    <div class="form-section h-100">
      <div class="section-wrapper h-100">
       <!-- VESICASH FEATHER BRAND LOGO -->
        <a
          href="https://vesicash.com"
          class="brand-logo"
        >
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
      <div class="image-wrapper position-relative w-100 h-100 m-auto overflow-hidden">
        <img :src="loadImage('banner-img.png')" alt="vesicash-banner-image">
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
  @include flex-row-nowrap('flex-start', 'center');
  position: relative;
  height: 100vh;

  .form-section {
    width: 48%;

    .section-wrapper {
      @include flex-column('flex-start', 'flex-start');
      padding: toRem(60) toRem(160);

      .brand-logo {
        position: relative;
        left: toRem(-1);
        
        svg {
          width: toRem(165);
          height: auto;
        }
      }
    }
  }

  .banner-image-section {
    position: fixed;
    right: 0;
    @include flex-column('center', 'center');
    // padding: toRem(12);
    width: 52%;

    .image-wrapper {
      img {
        @include set-full-bg;
      }
    }

  }
}
</style>
