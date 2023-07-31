<template>
  <div class="feature-card soft-shadow-effect rounded-4">
    <div class="icon-wrapper rounded-circle teal-10-bg soft-shadow-effect">
      <img v-lazy="loadImage(feature.icon)" alt="" />
    </div>

    <div class="content-area">
      <div class="title-text roobert-700 mgb-4 teal-900">
        {{ feature.title }}
      </div>

      <div class="description-text roobert-400 teal-800">
        {{ feature.description }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeatureCard",

  props: {
    feature: {
      type: Object,
      default: () => ({
        icon: "",
        title: "Header text",
        description: "Description text",
      }),
    },
  },
};
</script>

<style lang="scss" scoped>
.feature-card {
  @include flex-row-nowrap("flext-start", "flex-start");
  padding: toRem(15);
  margin: toRem(16);
  width: 40%;

  @include breakpoint-down(md) {
    margin: toRem(12);
    width: 46%;
  }

  @include breakpoint-custom-down(680) {
    @include flex-column("flext-start", "flex-start");
    font-size: toRem(16.5);
    margin: toRem(12) 0;
    width: 48%;
  }

  @include breakpoint-down(sm) {
    width: 100%;
  }

  .icon-wrapper {
    position: relative;
    @include draw-shape(44);
    margin-right: toRem(15);

    @include breakpoint-custom-down(680) {
      @include draw-shape(40);
      margin-right: 0;
      margin-bottom: toRem(15);
    }

    img {
      @include center-placement;
      @include draw-shape(28);

      @include breakpoint-custom-down(680) {
        @include draw-shape(28);
      }

      @include breakpoint-down(xs) {
        @include draw-shape(26);
      }
    }
  }

  .content-area {
    .title-text {
      font-size: toRem(18);
      font-weight: 600;

      @include breakpoint-down(md) {
        font-size: toRem(16.5);
      }

      @include breakpoint-down(xs) {
        font-size: toRem(16.25);
      }
    }

    .description-text {
      @include font-height(16.75, 26);

      @include breakpoint-down(md) {
        @include font-height(15.25, 25);
      }

      @include breakpoint-custom-down(680) {
        @include font-height(15.45, 25);
      }

      @include breakpoint-down(xs) {
        @include font-height(14.85, 25);
      }
    }
  }
}
</style>
