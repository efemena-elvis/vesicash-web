<template>
  <div
    class="select-dialog-card rounded-12 border-grey-100 pointer wt-100"
    :class="option.selected && 'select-dialog-card-active'"
    @click="$emit('dialogSelected', option.id)"
  >
    <div>
      <!-- TITLE TEXT -->
      <div class="title-text primary-1-text grey-900 mgb-7">
        {{ option.title }}
      </div>

      <!-- DESCRIPTION TEXT -->
      <div class="description-text tertiary-2-text grey-600">
        {{ option.description }}
      </div>
    </div>

    <!-- SELECTION INDICATOR -->
    <div
      class="selection-indicator"
      :class="[`${select_type}-type`, option.selected && 'border-0']"
    >
      <div class="position-relative w-100 h-100">
        <SuccessIcon v-if="option.selected" />
      </div>
    </div>
  </div>
</template>

<script>
import SuccessIcon from "@/shared/components/icon-comps/success-icon";

export default {
  name: "SelectDialogCard",

  components: {
    SuccessIcon,
  },

  props: {
    select_type: {
      type: String,
      default: "radio",
    },

    option: {
      type: Object,
      default: () => ({
        id: 1,
        title: "Title here...",
        description: "Description here...",
        selected: false,
      }),
    },
  },
};
</script>

<style lang="scss" scoped>
%active-card {
  background-color: getColor("green-50");
  border-color: getColor("green-500");
}

.select-dialog-card {
  @include flex-row-nowrap("space-between", "flex-start");
  @include transition(0.4s);
  margin-bottom: toRem(24);
  padding: toRem(16);
  position: relative;

  &:hover {
    transform: scale(1.02);
    @extend %active-card;
  }

  .selection-indicator {
    border: toRem(1) solid lighten(getColor("grey-300"), 2%);
    @include draw-shape(20);
    position: absolute;
    overflow: hidden;
    right: toRem(16);
    top: toRem(14);

    &.radio-type {
      border-radius: 50%;
    }

    &.checkbox-type {
      border-radius: toRem(5);
    }

    svg {
      @include center-placement;
      @include draw-shape(23);
    }
  }

  .title-text {
    font-size: toRem(15.5);

    @include breakpoint-down(xs) {
      font-size: toRem(15);
    }
  }

  .description-text {
    font-size: toRem(13.75);

    @include breakpoint-down(xs) {
      @include font-height(13.25, 19);
    }
  }

  &-active {
    @extend %active-card;
  }
}
</style>
