<template>
  <div class="dashboard-transactions">
    <!-- PAGE SWITCHER -->
    <PageSwitcher
      :page_data="pages"
      @swapTable="transaction_table_type = $event"
    />

    <!-- TAB SWITCHER -->
    <!-- <TabSwitcher
      class="mgb-25"
      v-if="
        transaction_table_type === 'TransactionWalletFundingTable' ||
        transaction_table_type === 'TransactionWalletWithdrawalTable'
      "
      @tabSelected="transaction_tab_type = $event"
    /> -->

    <!-- DISPLAY AREA FOR PAYMENTS/DISBURSEMENTS/WALLET -->
    <transition name="fade" mode="out-in">
      <component
        :is="getCurrentTable"
        @showTransactionModal="toggleTransactionSummaryModal"
      />
    </transition>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          @closeTriggered="toggleTransactionSummaryModal"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import PageSwitcher from "@/shared/components/page-switcher";
import TabSwitcher from "@/shared/components/tab-switcher";

export default {
  name: "DashboardTransactions",

  components: {
    PageSwitcher,
    TabSwitcher,
    TransactionPaymentTable: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/components/table-comps/transaction-payment-table"
      ),

    TransactionDisbursementTable: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/components/table-comps/transaction-disbursement-table"
      ),

    TransactionWalletWithdrawalTable: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/components/table-comps/transaction-wallet-withdrawal-table"
      ),

    TransactionWalletFundingTable: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/components/table-comps/transaction-wallet-funding-table"
      ),

    TransactionSummaryModal: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/modals/transaction-summary-modal"
      ),
  },

  data: () => ({
    pages: [
      {
        title: "My Fundings",
        table: "TransactionWalletFundingTable",
        active: true,
      },
      {
        title: "My Withdrawals",
        table: "TransactionWalletWithdrawalTable",
        active: false,
      },
    ],

    transaction_table_type: "TransactionWalletFundingTable",
    show_transaction_summary_modal: false,
  }),

  created() {
    this.$bus.$on("showTransactionSummary", () =>
      this.toggleTransactionSummaryModal()
    );
  },

  computed: {
    getCurrentTable() {
      return this.transaction_table_type;
    },
  },

  methods: {
    toggleTransactionSummaryModal() {
      this.show_transaction_summary_modal =
        !this.show_transaction_summary_modal;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>