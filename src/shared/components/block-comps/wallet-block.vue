<template>
  <div class="wallet-block mgb-32">
    <div class="wallet-row">
      <div class="primary-wallet">
        <!-- PRIMARY WALLET -->
        <PrimaryWalletCard
          :wallet_balance="extractPrimaryWallet"
          :loading_wallet="loading_wallet"
          :card_type="card_type"
        />
      </div>

      <div class="escrow-wallet">
        <!-- ESCROW WALLET -->
        <EscrowWalletCard
          v-if="card_type === 'escrow'"
          :escrow_balance="extractEscrowWallet"
          :loading_wallet="loading_wallet"
        />
      </div>
    </div>
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

      let primary_wallets = this.getWalletSize.filter(
        (wallet) => !wallet.short.includes("ESCROW") && !wallet.mor
      );

      return this.getWalletSize.length ? [...primary_wallets] : empty_wallet;
    },

    extractEscrowWallet() {
      return this.getWalletSize.filter((wallet) =>
        wallet.short.includes("ESCROW")
      );
      // .filter((wallet) => wallet.short !== "ESCROW_GBP");
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet-block {
  .wallet-row {
    @include flex-row-nowrap("space-between", "center");
    gap: 2%;
  }

  .primary-wallet {
    width: 54%;

    @include breakpoint-down(md) {
      width: 100%;
    }
  }

  .escrow-wallet {
    width: 44%;

    @include breakpoint-down(md) {
      width: 100%;
    }
  }
}
</style>
