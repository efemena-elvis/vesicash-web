<template>
  <div class="tour-cover"></div>
</template>

<script>
export default {
  name: "tourCover",
};
</script>

<style lang="scss" scoped>
.tour-cover {
  @include transition(0.5s);
  @include stretch-area;
  position: fixed;
  overflow: auto !important;
  z-index: 999;
  background: linear-gradient(
    180deg,
    rgba(1, 26, 39, 0.39) 4.69%,
    rgba(1, 26, 39, 0.38) 56.25%,
    rgba(1, 26, 39, 0.5) 100%
  );
}
</style>