<template>
  <!-- VESICASH APP CONTAINER -->
  <div class="layout-auth">
    <!-- VESICASH FEATHER BRAND LOGO -->
    <a href="https://vesicash.com" class="brand-logo">
      <VesicashBrandLogo type="light" />
    </a>

    <div class="auth-container">
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
    margin-top: toRem(40);
  }

  .support-icon-wrapper {
    position: fixed;
    bottom: toRem(40);
    right: toRem(40);
    transform: scale(0.85);
    cursor: pointer;

    &:hover {
      transform: scale(1.01);
      transition: all ease-in-out 0.2s;
    }
  }
}
</style>
