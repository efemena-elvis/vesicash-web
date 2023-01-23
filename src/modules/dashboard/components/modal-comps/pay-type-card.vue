<template>
  <div
    class="pay-type-card rounded-12 border-grey-100 pointer smooth-transition"
    @click="handleCardSelection"
  >
    <!-- DISABLED OVERLAY -->
    <div class="disabled-pay-card" v-if="payment.id === 3"></div>

    <!-- LEFT SECTION -->
    <div class="left-section">
      <!-- ICON CARD -->
      <div class="icon-card position-relative rounded-circle teal-50-bg">
        <component :is="payment.icon" />
      </div>

      <!-- CARD INFO -->
      <div class="card-info">
        <!-- CARD TITLE -->
        <div class="card-title primary-1-text grey-900 mgb-4">
          {{ payment.title }}
        </div>

        <!-- CARD DESCRIPTION -->
        <div class="card-description tertiary-2-text grey-600">
          {{ payment.description }}
        </div>
      </div>

      <!-- v-if="payment.id===3" -->
      <template v-if="false">
        <div class="coming-soon-wrapper">
          <div class="icon icon-question-circle teal-300"></div>
        </div>

        <!-- BOTTOM TOOLTIP -->
        <div class="tooltip-wrapper wt-100 position-absolute">
          <div class="tooltip-data wt-100 grey-10-bg rounded-8 grey-900">
            This feature is still under development and will be added as part of
            the payment options soon
          </div>
        </div>
      </template>
    </div>

    <!-- RIGHT SECTION -->
    <div class="right-section">
      <div class="icon icon-caret-right grey-500"></div>
    </div>
  </div>
</template>

<script>
import CreditCardIcon from "@/shared/components/icon-comps/credit-card-icon";
import ArrowRightIcon from "@/shared/components/icon-comps/arrow-right-icon";
import BusinessIcon from "@/shared/components/icon-comps/business-icon";
import EmptyWalletIcon from "@/shared/components/icon-comps/empty-wallet-icon";

export default {
  name: "PayTypeCard",

  components: {
    CreditCardIcon,
    ArrowRightIcon,
    BusinessIcon,
    WalletIcon: EmptyWalletIcon,
  },

  props: {
    payment: {
      type: Object,
      default: () => ({
        id: 1,
        icon: "CreditCardIcon",
        title: "Pay with card",
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit consectetur.",
        action_type: "route",
        action: "",
      }),
    },
  },

  methods: {
    handleCardSelection() {
      if (this.payment.action_type === "route") {
        this.$router.push({ name: this.payment.action });
      } else this.$emit("payTypeClicked");
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-type-card {
  @include flex-row-between-nowrap;
  padding: toRem(14) toRem(16);
  margin-bottom: toRem(24);
  position: relative;

  @include breakpoint-down(sm) {
    padding: toRem(14);
  }

  &:hover {
    background: rgba(getColor("grey-10"), 0.85);
    transform: scale(1.02);
  }

  .left-section {
    @include flex-row-start-nowrap;
    align-items: flex-start;

    .icon-card {
      @include draw-shape(48);
      margin-right: toRem(16);

      @include breakpoint-down(sm) {
        margin-right: toRem(12);
      }

      svg {
        @include center-placement();
        @include draw-shape(25);
      }
    }

    .card-title {
      @include breakpoint-down(sm) {
        font-size: toRem(15.25);
      }
    }

    .card-description {
      @include breakpoint-down(sm) {
        font-size: toRem(13.5);
      }
    }
  }

  .right-section {
    @include draw-shape(24);
    margin-left: toRem(14);
    position: relative;

    .icon {
      @include center-placement();
      font-size: toRem(28);
    }
  }

  .coming-soon-wrapper {
    position: absolute;
    right: 10px;
    top: 8px;
    transform: rotate(-0deg);
    z-index: 8;

    .icon {
      font-size: toRem(19.5);
    }

    &:hover ~ .tooltip-wrapper {
      visibility: visible;
    }
  }

  .tooltip-wrapper {
    left: 0;
    top: 40px;
    visibility: hidden;
    z-index: 10;

    .tooltip-data {
      position: relative;
      border: toRem(1) solid getColor("grey-100");
      @include generate-font-type("tertiary-2");
      padding: toRem(14) toRem(16);
      background: getColor("neutral-10");
      filter: drop-shadow(1px -1px 3px rgba(184, 194, 192, 0.2))
        drop-shadow(-1px 1px 3px rgba(184, 194, 192, 0.2));

      &:before {
        content: "";
        position: absolute;
        top: toRem(-9);
        right: toRem(17);
        @include draw-shape(18);
        transform: rotate(45deg);
        background: getColor("neutral-10");
        border-top: toRem(1) solid getColor("grey-100");
        border-left: toRem(1) solid getColor("grey-100");
      }
    }
  }
}

.disabled-pay-card {
  background: rgba(getColor("grey-10"), 0.5);
  @include stretch-area();
  @include set-full-bg();
  pointer-events: none;
  cursor: not-allowed;
  z-index: 1;
}

.coming-soon-wrapper {
  .chip-text {
    font-size: 0.7rem;
  }
}
</style>
