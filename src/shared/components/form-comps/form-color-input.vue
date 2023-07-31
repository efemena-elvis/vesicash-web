<template>
  <label class="form-color-input form-control pointer" :for="color_id">
    <div class="color-wrapper mgr-8">
      <input
        type="color"
        :id="color_id"
        v-model="color"
        @change="handleColorChange"
      />
    </div>

    <div class="color-hex grey-400">{{ color }}</div>
  </label>
</template>

<script>
export default {
  name: "FormColorInput",

  props: {
    color_id: {
      type: String,
    },
    default_color: {
      type: String,
    },
  },

  data() {
    return {
      color: this.default_color,
    };
  },

  methods: {
    handleColorChange() {
      this.$emit("colorChange", this.color);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-color-input {
  @include flex-row-nowrap("flex-start", "center");

  .color-wrapper {
    border: toRem(1) solid getColor("grey-300");
    @include draw-shape(22);
    border-radius: 50%;
    position: relative;
    overflow: hidden;

    input {
      @include draw-shape(28);
      position: absolute;
      outline: none;
      border: none;
      top: toRem(-3);
      left: toRem(-3);
    }
  }

  .color-hex {
    @include generate-font-type("tertiary-2");
  }
}
</style>
