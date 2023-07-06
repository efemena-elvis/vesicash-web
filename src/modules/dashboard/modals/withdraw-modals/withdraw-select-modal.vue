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
        ? this.withdraw_options
        : this.withdraw_options.slice(1);
    },
  },

  data() {
    return {
      withdraw_options: [
        {
          id: 1,
          icon: "MoneyIcon",
          title: "MoR transfer request",
          slug: "transfer_request",
          description: "Initiate an assisted transfer from your MoR wallet(s)",
        },
        {
          id: 2,
          icon: "BusinessIcon",
          title: "Settlement account",
          slug: "settlement",
          description: this.isBusinessAccount
            ? "Transfer funds to your business accounts."
            : "Transfer funds to your personal accounts.",
        },
        {
          id: 2,
          icon: "ArrowRightIcon",
          title: "3rd party account",
          slug: "third_party",
          description: "Transfer funds to a 3rd party account.",
        },
        {
          id: 4,
          icon: "WalletIcon",
          title: "Vesicash wallet",
          slug: "wallet",
          description: "Transfer funds to a Vesicash user wallet.",
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
