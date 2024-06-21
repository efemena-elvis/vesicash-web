<template>
  <div class="alert-wrapper">
    <span class="icon icon-info yellow-600 tertiary-1-text"></span>
    <div>
      <slot name="info"></slot>
      <div class="tertiary-2-text grey-900" v-if="info">{{ info }}</div>
      <slot name="actions"></slot>
      <div
        v-html="action"
        v-if="action"
        class="mgt-10 tertiary-2-text"
        @click="$emit('action')"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoAlertCard",

  props: {
    info: {
      tyep: String,
      default: "",
    },
    action: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.alert-wrapper {
  padding: toRem(16);
  background: getColor("yellow-50");
  border-radius: toRem(8);
  @include flex-row-nowrap("flex-start", "flex-start");
  gap: toRem(10);

  .icon-info {
    font-size: toRem(20);
  }

  .icon-wrapper {
    @include draw-shape(24);
    @include flex-column("center", "center");
    border-radius: 50%;
  }
}
</style>
