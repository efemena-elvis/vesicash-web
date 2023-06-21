<template>
  <div class="dropdown-card neutral-10-bg soft-shadow-effect rounded-8 index-1">
    <div
      class="item"
      v-for="(item, index) in menu_items"
      :key="index"
      @click="$emit(item.action)"
    >
      <div class="icon-wrapper">
        <div class="icon" :class="item.icon"></div>
      </div>

      <div class="text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropdownMenu",

  props: {
    menu_items: {
      type: Array,
      default: () => [
        {
          icon: "icon-trash",
          text: "Delete Item",
          action: "",
        },
      ],
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-card {
  position: relative;
  min-width: toRem(180);
  width: auto;

  .item {
    @include flex-row-nowrap("flex-start", "center");
    color: getColor("grey-600");
    @include transition(0.3s);
    padding: toRem(9);
    cursor: pointer;

    .icon-wrapper {
      @include draw-shape(24);
      margin-right: toRem(8);

      .icon {
        @include flex-row-nowrap("center", "center");
      }
    }

    .text {
      @include generate-font-type("tertiary-2");
    }

    &:hover {
      background: getColor("grey-10");
    }
  }
}
</style>
