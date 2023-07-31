<template>
  <div
    class="mor-accordion rounded-12 pointer smooth-transition"
    :class="is_close ? 'close' : 'open'"
    @click="toggleOpen"
  >
    <!-- TOP ROW -->
    <div class="top-row">
      <div class="fw-semibold">{{ title }}</div>
      <div class="icon" :class="is_close ? 'icon-plus' : 'icon-minus'"></div>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row grey-700" v-if="!is_close">
      <slot name="card-content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "MoRAccordion",

  props: {
    title: {
      type: String,
      default: "Card title...",
    },
  },

  data() {
    return {
      is_close: true,
    };
  },

  methods: {
    toggleOpen() {
      this.is_close = !this.is_close;
    },
  },
};
</script>

<style lang="scss" scoped>
.mor-accordion {
  border: toRem(1) solid getColor("grey-100");
  margin-bottom: toRem(20);
  padding: toRem(18);

  @include breakpoint-down(lg) {
    margin-bottom: toRem(16);
  }

  @include breakpoint-down(sm) {
    margin-bottom: toRem(14);
  }

  .top-row {
    @include font-height(16, 24);
    @include flex-row-nowrap("space-between", "center");

    @include breakpoint-down(lg) {
      @include font-height(14.5, 22);
    }

    @include breakpoint-down(sm) {
      @include font-height(13.75, 22);
    }

    .icon {
      font-size: toRem(20);

      @include breakpoint-down(lg) {
        font-size: toRem(18);
      }

      @include breakpoint-down(sm) {
        font-size: toRem(16);
      }
    }
  }

  .bottom-row {
    @include font-height(15.35, 27);
    margin-top: toRem(10);

    @include breakpoint-down(lg) {
      @include font-height(14.5, 24);
    }

    @include breakpoint-down(sm) {
      @include font-height(13.75, 22);
    }
  }

  &.close {
    padding: toRem(16) toRem(20);
    color: getColor("grey-900");
  }

  &.open {
    padding: toRem(18) toRem(20);
  }

  .anchor {
    @include font-height(16, 24);
    color: getColor("neutral-10");
    text-decoration: underline;

    @include breakpoint-down(md) {
    }
  }
}
</style>
