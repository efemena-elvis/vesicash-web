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

  @include breakpoint-down(sm) {
    padding-bottom: toRem(70);
  }

  .title-text {
    font-size: toRem(27);
    @include font-height(26, 36);

    @include breakpoint-down(sm) {
      font-size: toRem(26);
    }
  }

  .meta-text {
    @include font-height(14.75, 24);
  }

  .auth-page {
    .btn-area {
      .btn {
        padding: toRem(10.5);
      }
    }
  }
}
</style>
