<template>
  <div class="payment-user-card rounded-8 borde-grey-200">
    <!-- USER DETAILS -->
    <template v-for="(detail, index) in payment_details">
      <div class="item" :key="index">
        <div class="title grey-600">{{ detail.title }}</div>

        <div
          v-if="detail.has_sign"
          class="value grey-900 text-wrap"
          v-html="
            `${$money.getSign(
              currency?.slug || currency
            )}${$utils.formatCurrencyWithComma(detail.value)}`
          "
        ></div>

        <div v-else class="value grey-900 text-wrap">{{ detail.value }}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "PaymentUserCard",

  props: {
    payment_details: {
      type: Array,
      default: () => [
        {
          title: "User Details",
          value: "Salimadeyemi@gmail.com",
          has_sign: false,
        },
        { title: "Amount", value: "30,000", has_sign: true },
      ],
    },

    currency: {
      type: [Object, String],
    },
  },

  data: () => ({}),
};
</script>

<style lang="scss" scoped>
.payment-user-card {
  @include flex-row-nowrap("space-between", "flex-start");
  padding: toRem(16);

  .item {
    &:first-of-type {
      margin-right: toRem(20);
      width: 60%;

      @include breakpoint-down(xs) {
        padding-right: toRem(20);
        margin-right: unset;
        width: 55%;
      }
    }

    &:last-of-type {
      width: 40%;

      @include breakpoint-down(xs) {
        width: 45%;
      }
    }

    .title {
      @include generate-font-type("tertiary-3");
      text-transform: uppercase;
      margin-bottom: toRem(8);

      @include breakpoint-down(sm) {
        font-size: toRem(11.75);
      }

      @include breakpoint-down(xs) {
        font-size: toRem(11.5);
      }
    }

    .value {
      @include generate-font-type("secondary-2");

      @include breakpoint-down(sm) {
        font-size: toRem(13.5);
      }
    }
  }
}
</style>
