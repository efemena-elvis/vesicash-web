<template>
  <div
    class="form-toggler smooth-transition"
    :class="isToggleActive ? 'toggle-active' : 'toggle-inactive'"
  >
    <div class="thumb pointer smooth-transition" @click="toggleSelect"></div>
  </div>
</template>

<script>
export default {
  name: "FormToggler",

  props: {
    default_value: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isToggleActive() {
      return this.toggle_value;
    },
  },

  data() {
    return {
      toggle_value: this.default_value,
    };
  },

  methods: {
    toggleSelect() {
      this.toggle_value = !this.toggle_value;
      this.$emit("toggleSelected", this.toggle_value);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-toggler {
  @include draw-shape(34, 20);
  border-radius: toRem(25);
  padding: toRem(1.2);
  position: relative;

  .thumb {
    @include center-placement("y-axis");
    @include draw-shape(18);
    border-radius: 50%;
  }

  &.toggle-active {
    background: rgba(getColor("green-100"), 0.75);

    .thumb {
      background: getColor("green-500");
      right: toRem(1.2);
    }
  }

  &.toggle-inactive {
    background: getColor("grey-200");

    .thumb {
      background: getColor("grey-700");
      left: toRem(1.2);
    }
  }
}
</style>
