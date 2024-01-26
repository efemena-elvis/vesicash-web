<template>
  <!-- VESICASH APP CONTAINER -->
  <div class="layout-auth">
    <!-- VESICASH FEATHER BRAND LOGO -->
    <a href="https://vesicash.com" class="brand-logo">
      <VesicashBrandLogo type="light" />
    </a>

    <div class="auth-container">
      <div class="about-vesicash">
        <div class="title-text neutral-10 mgb-20">
          Business payments made easy.
        </div>

        <div class="description-text h7-text grey-400">
          Access multiple markets across Africa in minutes.
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>

    <a
      class="support-icon-wrapper"
      href="https://vesicash.com/contact"
      target="_blank"
    >
      <SupportIcon />
    </a>
  </div>
</template>

<script>
import VesicashBrandLogo from "@/shared/components/icon-comps/vesicash-brand-logo";
import SupportIcon from "@/shared/components/icon-comps/support-icon.vue";

export default {
  name: "layoutRegister",

  components: {
    VesicashBrandLogo,
    SupportIcon,
  },

  data: () => ({}),

  mounted() {
    this.$utils.setPageBackgroundColor("#011A27");
  },
};
</script>

<style lang="scss" scoped>
.layout-auth {
  position: relative;
  height: 100vh;
  padding: toRem(50) toRem(100);

  @include breakpoint-down(md) {
    padding: toRem(50) toRem(50);
  }

  @include breakpoint-down(sm) {
    padding: toRem(50) toRem(30);
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

  .auth-container {
    display: grid;
    grid-template-columns: 60% 40%;
    margin-top: toRem(40);

    .about-vesicash {
      margin-top: toRem(80);

      .title-text {
        @include font-height(60, 74, 700);
      }
    }

    @include breakpoint-custom-down(1140) {
      grid-template-columns: 100%;

      .about-vesicash {
        display: none;
      }
    }
  }

  .support-icon-wrapper {
    position: fixed;
    bottom: toRem(30);
    right: toRem(30);
    transform: scale(0.85);
    cursor: pointer;

    &:hover {
      transform: scale(0.9);
      transition: all ease-in-out 0.2s;
    }
  }
}
</style>
