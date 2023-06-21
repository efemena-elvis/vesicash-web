<template>
  <div
    class="metric-card rounded-12 teal-10-bg border-teal-100 mgb-24"
    :class="`border-${metric_theme}-100 ${metric_theme}-10-bg`"
  >
    <div class="metric-title h5-text grey-900 mgb-16">{{ metric_title }}</div>

    <!-- METRIC DATA ROW -->
    <div class="metric-data-row">
      <div class="metric-data">
        <div class="title grey-700 mgb-4">USD REVENUE</div>
        <div class="value teal-800">$6,400,000.00</div>
      </div>

      <div class="metric-data">
        <div class="title grey-700 mgb-4">USD REVENUE</div>
        <div class="value teal-800">$6,400,000.00</div>
      </div>

      <div class="metric-data">
        <div class="title grey-700 mgb-4">USD REVENUE</div>
        <div class="value teal-800">$6,400,000.00</div>
      </div>

      <div class="metric-data">
        <div class="title grey-700 mgb-4">USD REVENUE</div>
        <div class="value teal-800">$6,400,000.00</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MetricCard",

  props: {
    metric_title: {
      type: String,
    },

    metric_theme: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.metric-card {
  padding: toRem(16) toRem(24);

  .metric-title {
    font-size: toRem(18);
  }

  .metric-data-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    .metric-data {
      border-right: toRem(1) solid getColor("grey-100");
      padding: 0 toRem(16);

      &:first-of-type {
        padding-left: 0;
      }

      &:last-of-type {
        border-right: 0;
      }

      .title {
        @include generate-font-type("tertiary-3");
      }

      .value {
        @include generate-font-type("h5");
        font-size: toRem(21);
      }
    }
  }
}
</style>
