<template>
  <label class="form-check-card mgb-16" :for="check_id">
    <div class="left-section">
      <input type="checkbox" :id="check_id" />
      <div class="check-value">{{ primary_text }}</div>
    </div>

    <div class="right-section" v-if="secondary_text">{{ secondary_text }}</div>
  </label>
</template>

<script>
export default {
  name: "FormCheckCard",

  props: {
    check_id: {
      type: String,
    },

    primary_text: {
      type: String,
    },

    secondary_text: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.form-check-card {
  @include flex-row-nowrap("space-between", "center");
  border: toRem(1) solid getColor("grey-100");
  @include generate-font-type("tertiary-2");
  color: getColor("grey-900");
  padding: toRem(8) toRem(16);
  border-radius: toRem(8);
  cursor: pointer;

  .left-section {
    @include flex-row-nowrap("flex-start", "center");
  }

  input {
    margin-right: toRem(8);
  }
}
</style>
