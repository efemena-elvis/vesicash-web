<template>
  <div
    class="page-switcher rounded-8 grey-50-bg"
    :class="[
      full_width ? 'wt-100' : 'wt-fit',
      remove_margin ? 'mgb-0' : 'mgb-16',
    ]"
  >
    <!-- PAGE ITEMS -->
    <template>
      <div
        class="page-item"
        :class="page.active && 'page-item-active'"
        v-for="(page, index) in pages"
        :key="index"
        @click="changeView(index)"
      >
        {{ page.title }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "PageSwitcher",

  props: {
    page_data: {
      type: Array,
      default: () => [],
    },

    full_width: {
      type: Boolean,
      default: true,
    },

    remove_margin: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      pages: this.page_data,
    };
  },

  methods: {
    changeView(index) {
      this.pages.map((page) => (page.active = false));
      this.pages[index].active = true;
      this.$emit("swapItem", this.pages[index].value);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-switcher {
  @include flex-row-nowrap("flex-start", "center");
  padding: toRem(8);

  .page-item {
    @include generate-font-type("secondary-3");
    padding: toRem(9) toRem(16);
    color: getColor("grey-600");
    @include transition(0.4s);
    border-radius: toRem(8);
    margin-right: toRem(8);
    display: inline-block;
    font-size: toRem(12.85);
    cursor: pointer;

    &:last-of-type {
      margin-right: 0;
    }

    &:hover {
      background: getColor("neutral-10");
    }

    &-active {
      box-shadow: toRem(1) toRem(-1) toRem(4) rgba(168, 177, 175, 0.3),
        toRem(-1) toRem(1) toRem(4) rgba(168, 177, 175, 0.3);
      background: getColor("neutral-10");
      color: getColor("teal-800");
    }
  }
}
</style>
