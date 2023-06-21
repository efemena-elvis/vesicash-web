<template>
  <div
    class="escrow-metric-card position-relative rounded-12 border-green-100 green-10-bg"
    :class="ongoingTour ? 'tour-index' : null"
  >
    <!-- TITLE TEXT -->
    <div class="title-text tertiary-2-text grey-700 mgb-2">In Escrow</div>

    <div class="escrow-balance-block">
      <div class="balance-block">
        <div class="border-bottom-grey-100">
          <div
            class="loading-amount-value rounded-3 skeleton-loader mgb-16"
            v-if="loading_wallet"
          ></div>

          <div class="amount-value mgb-8" v-else>
            <span
              >{{ escrow_balance[0]?.sign || "-"
              }}{{
                $utils.formatCurrencyWithComma(
                  escrow_balance[0]?.balance.split(".")[0] || "0"
                )
              }}</span
            >
            <span class="amount-zero"
              >.{{ escrow_balance[0]?.balance.split(".")[1] || "00" }}</span
            >
          </div>
        </div>

        <div class="third-balance">
          <div
            class="loading-amount-value rounded-3 skeleton-loader mgb-16"
            v-if="loading_wallet"
          ></div>

          <div class="amount-value mgb-8" v-else>
            <span
              >{{ escrow_balance[1]?.sign || "-"
              }}{{
                $utils.formatCurrencyWithComma(
                  escrow_balance[1]?.balance.split(".")[0] || "0"
                )
              }}</span
            >
            <span class="amount-zero"
              >.{{ escrow_balance[1]?.balance.split(".")[1] || "00" }}</span
            >
          </div>

          <div class="balance-meta title-description grey-700 secondary-3-text">
            Escrow balance
          </div>
        </div>
      </div>

      <div class="balance-block">
        <div class="border-bottom-grey-100">
          <div
            class="loading-amount-value rounded-3 skeleton-loader mgb-16"
            v-if="loading_wallet"
          ></div>

          <div class="amount-value mgb-8" style="opacity: 0.5" v-else>
            <span
              >{{ escrow_balance[2]?.sign || "-"
              }}{{
                $utils.formatCurrencyWithComma(
                  escrow_balance[2]?.balance.split(".")[0] || "0"
                )
              }}</span
            >
            <span class="amount-zero"
              >.{{ escrow_balance[2]?.balance.split(".")[1] || "00" }}</span
            >
          </div>
        </div>

        <div>
          <div
            class="loading-amount-value rounded-3 skeleton-loader mgb-16"
            v-if="loading_wallet"
          ></div>

          <div class="amount-value mgb-8" v-else>
            <span>---------</span>
          </div>

          <div
            class="balance-meta title-description grey-700 secondary-3-text"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "EscrowMetricCard",

  props: {
    escrow_balance: {
      type: Array,
      default: () => [],
    },

    loading_wallet: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    ...mapGetters({ getTourData: "general/getTourData" }),

    ongoingTour() {
      const { count, ongoing } = this.getTourData;

      if (ongoing) return [1].includes(count) ? true : false;
      else return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.escrow-metric-card {
  padding: toRem(14) toRem(24);
  width: toRem(380);
  max-width: 100%;

  @include breakpoint-custom-down(530) {
    width: 100%;
  }

  .escrow-balance-block {
    @include flex-row-wrap("flex-start", "center");

    .balance-block {
      width: 50%;
      padding: 0 toRem(16);
      border-left: toRem(1) solid getColor("grey-100");

      &:first-of-type {
        padding-left: 0;
        border-left: 0;
      }

      @include breakpoint-down(xxs) {
        width: 100%;
        border-left: 0;
        padding-left: 0;

        .third-balance {
          border-bottom: toRem(1) solid getColor("grey-100");
          padding-bottom: toRem(16);
        }
      }

      .balance-meta {
        min-height: toRem(17);
      }
    }
  }

  .title-text {
    @include breakpoint-down(xs) {
      font-size: toRem(11.75);
    }
  }

  .amount-value {
    @include generate-font-type("h4");
    color: getColor("teal-800");
    padding: toRem(10) 0 toRem(8) 0;
    font-size: toRem(23.5);
    margin: 0 !important;

    @include breakpoint-down(lg) {
      @include generate-font-type("primary-1");
      padding-bottom: toRem(12.75);
      font-size: toRem(18.5);
    }

    @include breakpoint-custom-down(700) {
      font-size: toRem(16);
    }

    .amount-zero {
      font-size: toRem(18);

      @include breakpoint-custom-down(700) {
        font-size: toRem(16);
      }
    }
  }

  .loading-amount-value {
    @include draw-shape(120, 32);
    margin-top: toRem(5);
  }
}

.tour-index {
  @include transition(0.7s);
  z-index: 1099;
}
</style>
