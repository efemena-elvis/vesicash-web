<template>
  <div class="mgb-30 mgb-hack">
    <PayTypeCard
      v-for="(data, index) in withdraw_options"
      :key="index"
      :payment="data"
      @payTypeClicked="$emit('fundingOptionSelected', data)"
    />
  </div>
</template>

<script>
export default {
  name: "FundWalletSelectModal",

  components: {
    PayTypeCard: () =>
      import(
        /* webpackChunkName: 'modal-comps-module' */ "@/modules/dashboard/components/modal-comps/pay-type-card"
      ),
  },

  data: () => ({
    withdraw_options: [
      {
        id: 1,
        icon: "CreditCardIcon",
        title: "Fund via card",
        slug: "card",
        description: "Fund wallet via credit card.",
      },
      {
        id: 2,
        icon: "ArrowRightIcon",
        title: "Fund via transfer",
        slug: "transfer",
        description: "Fund wallet via bank transfer.",
      },
    ],
  }),
};
</script>

<style lang="scss" scoped>
.mgb-hack {
  border: toRem(1) solid transparent;
}
</style>
