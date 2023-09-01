<template>
  <div class="auth-wrapper">
    <!-- TITLE TEXT -->
    <div class="title-text h3-text grey-800">
      {{ title_text }}
    </div>

    <!-- META TEXT -->
    <div
      class="meta-text grey-600 mgt-8"
      v-if="meta_text"
      v-html="meta_text"
    ></div>

    <!-- AUTH FORM AREA -->
    <div class="auth-form-area mgt-24">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthWrapper",

  props: {
    title_text: {
      type: String,
      default: "Title text",
    },
    meta_text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-wrapper {
  padding-bottom: toRem(50);

  @include breakpoint-up(sm) {
    // padding: toRem(24);
    // width: fit-content;
  }

  .title-text {
    font-size: toRem(27);

    // @include breakpoint-down(xxs) {
    //   font-size: toRem(18);
    // }

    // @include breakpoint-up(xxs) {
    //   font-size: toRem(18.25);
    // }

    // @include breakpoint-up(sm) {
    //   font-size: toRem(19);
    // }

    // @include breakpoint-up(lg) {
    //   font-size: toRem(20);
    // }
  }

  .meta-text {
    @include font-height(14.75, 24);

    // @include breakpoint-down(xxs) {
    //   font-size: toRem(12.75);
    // }

    // @include breakpoint-up(xxs) {
    //   font-size: toRem(13);
    // }

    // @include breakpoint-up(sm) {
    //   font-size: toRem(13.25);
    // }

    // @include breakpoint-up(lg) {
    //   font-size: toRem(13.5);
    // }
  }

  .auth-page {
    // @include breakpoint-down(xxs) {
    //   width: 100%;
    // }

    // @include breakpoint-up(xxs) {
    //   width: 100%;
    // }

    // @include breakpoint-up(sm) {
    //   width: toRem(400);
    // }

    .btn-area {
      .btn {
        padding: toRem(10.5);
      }
    }
  }
}
</style>