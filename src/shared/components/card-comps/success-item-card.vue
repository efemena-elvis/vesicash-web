<template>
  <div class="success-item-card">
    <div class="icon-wrapper position-relative">
      <component :is="info.icon" backgroundColor="#043B56" />
    </div>

    <div>
      <!-- TITLE TEXT -->
      <div class="title primary-1-text grey-900 mgb-4">{{ info.title }}</div>

      <!-- DESCRIPTION TEXT -->
      <div
        class="description tertiary-2-text grey-600"
        v-html="info.description"
      ></div>
    </div>
  </div>
</template>

<script>
import SuccessIcon from "@/shared/components/icon-comps/success-icon";

export default {
  name: "SuccessItemCard",

  components: {
    SuccessIcon,
  },

  props: {
    info: {
      type: Object,
      default: () => ({
        icon: "SuccessIcon",
        title: "Payment made sucessfully",
        description: "Your payment of $50,000 has been made sucessfully",
      }),
    },
  },
};
</script>

<style lang="scss" scoped>
.success-item-card {
  @include flex-row-nowrap("flex-start", "flex-start");
  margin-bottom: toRem(40);

  .icon-wrapper {
    margin-right: toRem(16);
    top: toRem(3);

    @include breakpoint-down(xs) {
      margin-right: toRem(13);
    }

    svg {
      @include draw-shape(48);

      @include breakpoint-down(xs) {
        @include draw-shape(42);
      }
    }
  }

  .title {
    @include breakpoint-down(xs) {
      font-size: toRem(15.5);
    }
  }

  .description {
    @include breakpoint-down(xs) {
      font-size: toRem(13.5);
    }
  }
}
</style>
