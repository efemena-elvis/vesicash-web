<template>
  <label
    :for="label_id"
    class="radio-select-card rounded-8 border-grey-100 w-100"
    @click="$emit('clicked')"
  >
    <!-- SELECT AREA -->
    <div class="select-area">
      <template v-if="single_type">
        <div class="icon icon-plus f-size-20 grey-500 mgr-12"></div>
      </template>

      <template v-else>
        <input
          type="radio"
          :id="label_id"
          :name="card_name"
          :checked="isChecked"
          :class="single_type ? 'mgr-18' : 'mgr-8'"
          @change="$emit('checked')"
        />
      </template>

      <div
        class="text tertiary-2-text"
        :class="single_type ? 'green-700' : 'grey-900'"
        v-html="label_text"
      ></div>
    </div>

    <div class="helper-icon pointer" v-if="tooltip_text">
      <div class="icon icon-question-circle green-500"></div>
    </div>

    <div class="helper-icon pointer" v-if="single_type">
      <div class="icon icon-caret-right grey-500 f-size-26"></div>
    </div>

    <!-- BOTTOM TOOLTIP -->
    <div class="tooltip-wrapper wt-100 position-absolute">
      <div
        class="tooltip-data wt-100 grey-10-bg rounded-8 grey-700"
        v-html="tooltip_text"
      ></div>
    </div>
  </label>
</template>

<script>
export default {
  name: "RadioSelectCard",

  props: {
    label_id: {
      type: String,
      required: true,
    },

    label_text: {
      type: String,
      required: true,
    },

    card_name: {
      type: String,
      required: true,
    },

    tooltip_text: {
      type: String,
      default: "",
    },

    single_type: {
      type: Boolean,
      default: false,
    },

    is_checked: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    isChecked() {
      return this.is_checked;
    },
  },
};
</script>

<style lang="scss" scoped>
.radio-select-card {
  @include flex-row-nowrap("space-between", "center");
  padding: toRem(10) toRem(16);
  @include transition(0.4s);
  position: relative;
  cursor: pointer;

  &:hover {
    border: toRem(1) solid getColor("green-200");
    background: getColor("green-10");
  }

  @include breakpoint-down(sm) {
    padding: toRem(8) toRem(13);
  }

  .select-area {
    @include flex-row-nowrap("flex-start", "center");
  }

  .helper-icon {
    .icon {
      font-size: toRem(21.5);
      pointer-events: none;
    }

    &:hover ~ .tooltip-wrapper {
      top: 117%;
      visibility: visible;
    }
  }
}
</style>
