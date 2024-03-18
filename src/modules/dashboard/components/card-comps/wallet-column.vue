<template>
  <div
    class="wallet-column"
    :class="[is_escrow_type && 'escrow-column', renderColumnBorder]"
  >
    <!-- TITLE TEXT -->
    <div
      class="title-text tertiary-3-text mgb-15"
      :class="is_escrow_type ? 'grey-800' : 'teal-100'"
    >
      <template>
        {{ formatWalletDisplayName }}
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
      <div class="amount-value secondary-1-text mgb-7" :class="getAmountStyle">
        <span class="f-size-18">{{ wallet.sign }}</span>
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
  </div>
</template>
  
  <script>
export default {
  name: "WalletColumn",

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

    is_escrow_type: {
      type: Boolean,
      default: false,
    },

    item_length: {
      type: Number,
      default: 0,
    },

    border_color: {
      type: String,
      default: "teal-800",
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

      return this.is_escrow_type ? "teal-800" : amount_styles[this.index];
    },

    formatWalletDisplayName() {
      if (this.wallet?.short?.includes("ESCROW"))
        return `ESCROW ${this.wallet.short.split("_")[1]}`;
      else return this.wallet?.short ?? "----";
    },

    isBalanceHidden() {
      return this.is_hidden;
    },

    renderColumnBorder() {
      if (this.index !== 0 && this.index !== this.item_length) {
        return `border-left-${this.border_color} border-right-${this.border_color}`;
      }
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
.wallet-column {
  position: relative;
  padding: 0 toRem(20);

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

.escrow-column {
  &::after {
    content: "";
    background: getColor("grey-200");
  }
}
</style>
  