<template>
  <div
    class="metric-card rounded-12 teal-10-bg border-teal-100 mgb-24"
    :class="`border-${metric_theme}-100 ${metric_theme}-10-bg`"
  >
    <div class="metric-title h5-text grey-900">{{ metric_title }}</div>

    <!-- METRIC DATA ROW -->
    <div class="metric-data-row">
      <div
        class="metric-data"
        v-for="(wallet, index) in metric_data"
        :key="index"
      >
        <div class="title grey-700 mgb-4">
          {{ wallet.description }} ({{ wallet.short }})
        </div>

        <template>
          <div v-if="is_loading">
            <div
              class="loading-amount-value rounded-3 skeleton-loader mgt-8"
            ></div>
          </div>

          <div class="value teal-800" v-else>
            {{ is_currency_type ? wallet.sign : ""
            }}{{
              is_currency_type
                ? `${$utils.formatCurrencyWithComma(
                    wallet.metric_value?.split(".")[0] ?? wallet.metric_value
                  )}.${wallet.metric_value?.split(".")[1] ?? "00"}`
                : wallet?.metric_value ?? 0
            }}
          </div>
        </template>
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

    metric_data: {
      type: Array,
      default: () => [],
    },

    is_currency_type: {
      type: Boolean,
      default: true,
    },

    is_loading: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.metric-card {
  width: max-content;

  @include breakpoint-custom-down(530) {
    width: 100%;
  }

  .metric-title {
    padding: toRem(16) toRem(24) 0;
    font-size: toRem(18);

    @include breakpoint-down(lg) {
      font-size: toRem(17);
    }

    @include breakpoint-custom-down(530) {
      padding: toRem(18) toRem(18) 0;
    }
  }

  .metric-data-row {
    @include flex-row-wrap("flex-start", "center");

    .metric-data {
      position: relative;
      padding: toRem(16) toRem(24) toRem(20);
      min-width: toRem(170);
      width: auto;
      max-width: toRem(240);

      &::after {
        content: "";
        width: toRem(1);
        background: getColor("grey-100");
        height: 64%;
        @include center-placement("y-axis");
        right: 0;
      }

      &:last-of-type {
        &::after {
          width: 0;
        }
      }

      @include breakpoint-custom-down(530) {
        width: 100%;
        max-width: unset;
        padding-left: toRem(18);

        &::after {
          width: 92%;
          height: toRem(1);
          right: unset;
          bottom: 0;
          left: 50%;
          top: 100%;
          transform: translateX(-50%) !important;
        }
      }

      .title {
        @include font-height(12.5, 20);
      }

      .value {
        @include generate-font-type("h5");
        font-size: toRem(21);

        @include breakpoint-down(lg) {
          @include generate-font-type("primary-1");
          font-size: toRem(18.5);
        }

        @include breakpoint-custom-down(700) {
          font-size: toRem(18);
        }
      }

      .loading-amount-value {
        @include draw-shape(120, 32);
      }
    }
  }
}
</style>
