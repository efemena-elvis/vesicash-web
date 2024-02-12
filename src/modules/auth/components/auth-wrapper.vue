<template>
  <div class="auth-wrapper">
    <!-- TITLE TEXT -->
    <div
      :class="['title-text h3-text grey-800', !meta_text && 'mgb-22']"
      v-if="title_text"
    >
      {{ $utils.getCapitalizeText(title_text.toLocaleLowerCase()) }}
    </div>

    <!-- META TEXT -->
    <div
      class="meta-text grey-600 mgt-6 mgb-24"
      v-if="meta_text"
      v-html="meta_text"
    ></div>

    <!-- AUTH FORM AREA -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "AuthWrapper",

  props: {
    title_text: {
      type: String,
      default: "",
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
  width: toRem(470);
  max-width: 100%;
  margin: auto;
  background: getColor("neutral-10");
  padding: toRem(28);
  border-radius: toRem(16);
  box-shadow: 1px 1px 10px 0px rgba(217, 222, 224, 0.5),
    -1px -1px 10px 0px rgba(217, 221, 224, 0.5);

  @include breakpoint-down(sm) {
    padding: toRem(22);
  }

  .title-text {
    @include font-height(26, 36);

    @include breakpoint-down(sm) {
      font-size: toRem(22);
    }
  }

  .meta-text {
    @include font-height(14.75, 23);

    @include breakpoint-down(sm) {
      @include font-height(14.25, 21);
    }
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
