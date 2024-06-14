<template>
  <div class="progress-block">
    <div
      :class="[
        'step-block',
        item.done && 'step-block__done',
        item.active && 'step-block__active',
      ]"
      v-for="(item, index) in items"
      :key="index"
    >
      <div class="counter">
        <span class="count">{{ index + 1 }}</span>
      </div>
      <div class="step-text">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgresBar",

  props: {
    items: {
      type: Array,
      default: () => [
        {
          title: "Progress 1",
          done: false,
          active: false,
        },
      ],
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-block {
  @include flex-row-nowrap("space-between", "center");
  width: 100%;
  max-width: 100%;
  gap: 0 toRem(20);
  background: getColor("green-10");
  border-radius: toRem(10);
  border: toRem(0.5) solid getColor("green-100");
  padding: toRem(8) toRem(16);

  .step-block {
    @include flex-row-nowrap("flex-start", "center");
    gap: 0 toRem(10);
    .counter {
      background: getColor("neutral-10");
      @include draw-shape(30);
      position: relative;
      border-radius: 50%;
      box-shadow: toRem(1) toRem(-1) toRem(2) rgba(168, 177, 175, 0.3),
        toRem(-1) toRem(1) toRem(2) rgba(168, 177, 175, 0.3);

      @include breakpoint-down(sm) {
        @include draw-shape(28);
      }

      .count {
        @include center-placement();
        font-size: toRem(13.5);

        @include breakpoint-down(sm) {
          font-size: toRem(12);
        }
      }
    }

    .step-text {
      font-size: toRem(12.75);
      color: getColor("grey-600");
      @include breakpoint-down(md) {
        display: none;
      }
    }

    &__done {
      .counter {
        background: getColor("grey-900");
        color: getColor("neutral-10");
      }
      .step-text {
        color: getColor("grey-900");
      }
    }

    &__active {
      .counter {
        background: getColor("green-500");
        color: getColor("neutral-10");
      }
      .step-text {
        color: getColor("green-500");
      }
    }
  }
}
</style>
