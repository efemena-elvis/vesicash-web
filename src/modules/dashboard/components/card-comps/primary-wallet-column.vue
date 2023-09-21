<template>
  <div class="primary-column">
    <!-- TITLE TEXT -->
    <div class="title-text tertiary-3-text teal-100 mgb-10">
      <template>
        {{ wallet?.short ?? "----" }}
        <span
          class="icon f-size-12 mgl-4 pointer"
          :class="isBalanceHidden ? 'icon-show' : 'icon-hide'"
          @click="toggleWalletBalance"
        ></span>
      </template>
    </div>

    <!-- LOADING AMOUNT VALUE -->
    <template v-if="loading_wallet">
      <div class="loading-amount-value rounded-3 skeleton-loader mgb-5"></div>
    </template>

    <template v-else>
      <!-- AMOUNT VALUE -->
      <div class="amount-value secondary-1-text mgb-4" :class="getAmountStyle">
        <span>{{ wallet.sign }}</span>
        <template v-if="isBalanceHidden">
          <span class="hidden-balance smooth-transition">****</span>
        </template>

        <template v-else
          ><span class="smooth-transition">{{
            $utils.formatCurrencyWithComma(
              wallet.balance?.split(".")[0] ?? wallet.balance
            )
          }}</span
          ><span class="amount-zero smooth-transition"
            >.{{ wallet.balance?.split(".")[1] ?? "00" }}</span
          >
        </template>
      </div>
    </template>

    <!-- TITLE DESCRIPTION -->
    <div class="title-description secondary-3-text neutral-10 mgt-5">
      {{ wallet?.description ?? "-----------" }}
    </div>
  </div>
</template>

<script>
export default {
  name: "PrimaryWalletColumn",

  props: {
    index: {
      type: Number,
      default: 0,
    },

    wallet: {
      type: Object,
    },

    loading_wallet: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    getAmountStyle() {
      let amount_styles = [
        "neutral-10",
        "green-400",
        "teal-500",
        "yellow-300",
        "red-300",
        "teal-300",
        "green-300",
      ];

      return amount_styles[this.index];
    },

    isBalanceHidden() {
      return this.is_hidden;
    },
  },

  data() {
    return {
      is_hidden: true,
    };
  },

  methods: {
    toggleWalletBalance() {
      this.is_hidden = !this.is_hidden;
    },
  },
};
</script>

<style lang="scss" scoped>
.primary-column {
  position: relative;
  padding: toRem(24) toRem(24) toRem(12);
  min-width: toRem(170);
  width: auto;
  max-width: toRem(240);

  &::after {
    content: "";
    width: toRem(1);
    background: getColor("teal-800");
    height: 66%;
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

    &::after {
      width: 92%;
      height: toRem(1);
      right: unset;
      bottom: 0;
      left: 50%;
      top: 105%;
      transform: translateX(-50%) !important;
    }
  }

  .title-text {
    @include breakpoint-down(xs) {
      font-size: toRem(12);
    }
  }

  .amount-value {
    font-size: toRem(22);

    @include breakpoint-down(lg) {
      @include generate-font-type("primary-1");
      font-size: toRem(18.5);
    }

    @include breakpoint-custom-down(700) {
      font-size: toRem(18);
    }

    .amount-zero {
      font-size: toRem(18);

      @include breakpoint-custom-down(700) {
        font-size: toRem(14.5);
      }
    }
  }

  .hidden-balance {
    position: relative;
    top: toRem(3);
  }

  .loading-amount-value {
    @include draw-shape(120, 32);
  }
}
</style>
