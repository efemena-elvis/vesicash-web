<template>
  <div class="escrow-page">
    <!-- PAGE TITILE -->
    <TitleTopBlock title="Escrow Transactions" />

    <div class="wallet-wrapper">
      <EscrowWalletCard
        :escrow_balance="extractEscrowWallet"
        :loading_wallet="loading_wallet"
      />
    </div>

    <div class="mgt-30 mgb-30">
      <PageSwitcher
        :page_data="pages"
        full_width
        @swapItem="updateView($event)"
      />
    </div>

    <!-- DISBURSEMENT TABLE DATA -->
    <div class="escrow-table-wrapper">
      <TransactionTable :status="view" />
    </div>
  </div>
</template>

<script>
import TitleTopBlock from "@/shared/components/block-comps/title-top-block";
import EscrowWalletCard from "../../../dashboard/components/card-comps/escrow-wallet-card.vue";
import WalletMixin from "@/modules/dashboard/mixins/wallet-mixin";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";

export default {
  name: "EscrowTransactions",

  mixins: [WalletMixin],

  components: {
    TitleTopBlock,
    PageSwitcher,
    EscrowWalletCard,
    TransactionTable: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/table-comps/escrow-transaction-table"
      ),
  },

  computed: {
    extractEscrowWallet() {
      return this.getWalletSize.filter((wallet) =>
        wallet.short.includes("ESCROW")
      );
      // .filter((wallet) => wallet.short !== "ESCROW_GBP");
    },
  },

  data() {
    return {
      pages: [
        {
          title: "All",
          value: "all",
          slug: "all",
          active: true,
        },
        {
          title: "Ongoing",
          value: "ongoing",
          slug: "ongoing",
          active: false,
        },
        {
          title: "Closed",
          value: "closed",
          slug: "closed",
          active: false,
        },
        {
          title: "Drafts",
          value: "draft",
          slug: "draft",
          active: false,
        },
      ],
      view: "all",
    };
  },

  methods: {
    updateView(view) {
      this.view = view;
    },
  },
};
</script>

<style lang="scss" scoped>
.escrow-page {
  padding-bottom: toRem(100);
}
.wallet-wrapper {
  max-width: toRem(467);
}
</style>
