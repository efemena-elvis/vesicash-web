<template>
  <div class="field-setup">
    <!-- FIELD TITLE AND DESCRIPTION AREA -->
    <div class="field-description">
      <div class="title-text primary-2-text grey-900 mgb-4">
        {{ title }}
      </div>

      <div class="description-text tertiary-3-text grey-600">
        {{ description }}
      </div>
    </div>

    <!-- FIELD INPUT AREA -->
    <div class="field-input">
      <slot name="form-area"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "FieldSetup",

  props: {
    title: String,
    description: String,
  },
};
</script>

<style lang="scss" scoped>
.field-setup {
  @include flex-row-wrap("space-between", "flex-start");
  margin-bottom: toRem(40);

  &:last-of-type {
    margin-bottom: toRem(15);
  }

  .field-description {
    width: 30%;

    @include breakpoint-down(sm) {
      width: 100%;
      margin-bottom: toRem(24);
    }
  }

  .field-input {
    width: 65%;

    @include breakpoint-down(sm) {
      width: 100%;
    }
  }
}
</style>
