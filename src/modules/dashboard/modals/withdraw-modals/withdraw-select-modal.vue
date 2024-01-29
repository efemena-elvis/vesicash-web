<template>
  <div class="mgb-30 mgb-hack">
    <PayTypeCard
      v-for="(data, index) in getWithdrawalOptions"
      :key="index"
      :payment="data"
      @payTypeClicked="$emit('accountTypeSelected', data)"
    />
  </div>
</template>

<script>
export default {
  name: "WithdrawSelectModal",

  components: {
    PayTypeCard: () =>
      import(
        /* webpackChunkName: 'modal-comps-module' */ "@/modules/dashboard/components/modal-comps/pay-type-card"
      ),
  },

  props: {
    type: {
      type: String,
      default: "single",
    },
  },

  computed: {
    isBusinessAccount() {
      return this.getAccountType === "business" ? true : false;
    },

    getWithdrawalOptions() {
      return this.isMoRSetupEnabled
        ? [...this.withdraw_options, ...this.mor_withdraw_option]
        : this.withdraw_options;
    },
  },

  data() {
    return {
      withdraw_options: [
        {
          id: 1,
          icon: "BusinessIcon",
          title: "Settlement account",
          slug: "settlement",
          description: "Transfer funds to a settlement account.",
        },
        {
          id: 2,
          icon: "ArrowRightIcon",
          title: "3rd party account",
          slug: "third_party",
          description: "Transfer funds to a 3rd party account.",
        },
        {
          id: 3,
          icon: "WalletIcon",
          title: "Vesicash wallet",
          slug: "wallet",
          description: "Transfer funds to a Vesicash user wallet.",
        },
      ],

      mor_withdraw_option: [
        {
          id: 4,
          icon: "MoneyIcon",
          title: "MoR fund transfer",
          slug: "transfer_request",
          description: "Process MoR funds to primary wallet",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.mgb-hack {
  border: toRem(1) solid transparent;
}
</style>
