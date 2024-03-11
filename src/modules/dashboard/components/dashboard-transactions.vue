<template>
  <div class="dashboard-transactions">
    <div class="section-row mgb-33">
      <div class="section-title h5-text grey-900">Recent transactions</div>

      <router-link
        to="/payments"
        class="action-text btn-tertiary btn-sm rounded-8 smooth-transition link-no-underline secondary-2-text green-500 pointer btn-link"
        v-if="table_repo.length > 5"
      >
        View All
      </router-link>
    </div>

    <!-- DISPLAY AREA FOR PAYMENTS WALLET -->
    <transition name="fade" mode="out-in">
      <TransactionWalletTable
        :table_data="table_data"
        :table_loading="table_loading"
        :empty_message="empty_message"
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
import { mapActions } from "vuex";

export default {
  name: "DashboardTransactions",

  components: {
    TransactionWalletTable: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/components/table-comps/transaction-wallet-table"
      ),

    TransactionSummaryModal: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/modals/transaction-summary-modal"
      ),
  },

  computed: {
    showPagination() {
      return this.$route?.name === "PaymentsPage" ? true : false;
    },

    getRequestPayload() {
      return {
        page: 1,
        account_id: this.getAccountId,
        start_date: "",
        end_date: "",
        currency: "",
      };
    },
  },

  data: () => ({
    show_transaction_summary_modal: false,

    table_repo: [],
    table_data: [],
    table_loading: false,
    pageNumber: 1,

    empty_message:
      "You have not made any transactions yet. Fund your wallet to get started",
  }),

  mounted() {
    this.fetchTransactionData();
  },

  methods: {
    ...mapActions({
      fetchAllFundings: "dashboard/fetchAllFundings",
      fetchAllWithdrawals: "dashboard/fetchAllWithdrawals",
    }),

    toggleTransactionSummaryModal() {
      this.show_transaction_summary_modal =
        !this.show_transaction_summary_modal;
    },

    // FETCH TRANSACTION DATA
    async fetchTransactionData() {
      this.table_loading = true;

      const [funding, withdrawal] = await Promise.all([
        this.handleDataRequest({
          action: "fetchAllFundings",
          payload: this.getRequestPayload,
          alert_handler: {
            error: "Unable fetch wallet transactions",
            not_found_error: "Wallet transactions not found",
          },
        }),

        this.handleDataRequest({
          action: "fetchAllWithdrawals",
          payload: this.getRequestPayload,
          alert_handler: {
            error: "Unable fetch wallet transactions",
            not_found_error: "Wallet transactions not found",
          },
        }),
      ]);

      if (funding.code === 200 && withdrawal.code === 200) {
        let transactions = this.$utils.sortByDate(
          [...funding.data, ...withdrawal.data],
          "desc"
        );

        this.table_loading = false;
        this.table_repo = transactions;
        this.table_data = transactions.slice(0, 5);
      } else {
        this.handleErrorResponse();
      }
    },

    // ==========================
    // HANDLE ERROR RESPONSE
    // ==========================
    handleErrorResponse() {
      this.table_loading = false;
      this.table_data = [];
    },
  },
};
</script>

<style lang="scss">
.dashboard-transactions {
  .section-row {
    @include flex-row-nowrap("space-between", "center");

    .section-title {
      @include breakpoint-down(sm) {
        font-size: toRem(18.75);
      }

      @include breakpoint-down(xs) {
        font-size: toRem(18.5);
      }
    }

    .action-text {
      &:hover {
        color: getColor("green-600");
      }
    }
  }
}
</style>
