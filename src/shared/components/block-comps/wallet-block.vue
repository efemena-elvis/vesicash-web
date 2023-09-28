<template>
  <div class="wallet-block mgb-40">
    <!-- PRIMARY WALLET SECTION -->
    <PrimaryWalletCard
      :wallet_balance="extractPrimaryWallet"
      :loading_wallet="loading_wallet"
      :card_type="card_type"
    />

    <!-- ESCROW WALLET SECTION -->
    <EscrowWalletCard
      v-if="card_type === 'escrow'"
      :escrow_balance="extractEscrowWallet"
      :loading_wallet="loading_wallet"
    />
  </div>
</template>

<script>
import WalletMixin from "@/modules/dashboard/mixins/wallet-mixin";

export default {
  name: "WalletBlock",

  mixins: [WalletMixin],

  components: {
    PrimaryWalletCard: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/card-comps/primary-wallet-card"
      ),
    EscrowWalletCard: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/card-comps/escrow-wallet-card"
      ),
  },

  props: {
    card_type: {
      type: String,
      default: "escrow",
    },
  },

  computed: {
    extractPrimaryWallet() {
      let empty_wallet = Array.from({ length: 3 }, () => this.default_wallet);
      let exclude_mor_list = ["USD", "GBP"];

      let primary_wallets = this.getWalletSize.filter(
        (wallet) => !wallet.short.includes("ESCROW") && !wallet.mor
      );

      let mor_wallets = this.getWalletSize
        .filter((wallet) => wallet.mor)
        .filter((w) => !exclude_mor_list.includes(w.short));

      return this.getWalletSize.length
        ? [...primary_wallets, ...mor_wallets]
        : empty_wallet;
    },

    extractEscrowWallet() {
      return this.getWalletSize.filter((wallet) =>
        wallet.short.includes("ESCROW")
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet-block {
  @include flex-row-wrap("flex-start", "stretch");
  gap: toRem(28);
}
</style>
