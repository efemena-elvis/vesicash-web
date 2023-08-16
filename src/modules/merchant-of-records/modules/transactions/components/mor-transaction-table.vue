<template>
  <div class="transaction-table">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="mor-transaction-tb"
      :table_data="table_data"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="getEmptyMessage"
      :empty_action_name="getEmptyActionName"
      :show_paging="showPagination"
      :pagination="pagination"
      @goToPage="getUserTransactions($event)"
    >
      <template v-for="(data, index) in table_data">
        <MoRTransactionTableRow
          :key="index"
          table_name="mor-transaction-tb"
          :data="data"
        />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";

export default {
  name: "MoRTransaction",

  components: {
    TableContainer,
    MoRTransactionTableRow: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/merchant-of-records/modules/transactions/components/mor-transaction-table-row"
      ),
  },

  props: {
    dataset: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapGetters({ getWalletSize: "general/getWalletSize" }),

    showPagination() {
      return false;
    },

    getEmptyMessage() {
      return "No MoR transactions has been recorded at the moment.";
    },

    getEmptyActionName() {
      return "";
    },
  },

  data() {
    return {
      table_header: [
        "Transaction Date",
        "Reference ID",
        "Email Address",
        "Amount Paid",
        "Payment Method",
        "Status",
      ],
      // "Actions",

      table_data: [],
      table_loading: true,
      paginatedData: {},
      paginationPages: {},
      pagination: {
        current_page: 1,
        per_page: 10,
        last_page: 3,
        from: 1,
        to: 20,
        total: 50,
      },
    };
  },

  mounted() {
    this.fetchMoRTransaction();
  },

  methods: {
    ...mapActions({
      getMoRTransactions: "merchantTransactions/getMoRTransactions",
    }),

    async fetchMoRTransaction() {
      const response = await this.handleDataRequest({
        action: "getMoRTransactions",
        alert_handler: {
          error: "Unable to fetch MoR transactions",
          request_error: "Unable to fetch MoR transactions",
        },
      });

      if (response?.code === 200 && response.data?.length) {
        this.table_data = response?.data ?? [];
        this.sortTransactionByCountry(response?.data ?? []);
      } else if (response?.code === 200) {
        this.sortTransactionByCountry([]);
      }

      this.table_loading = false;
    },

    sortTransactionByCountry(transactions) {
      let mor_wallet = this.getWalletSize
        .filter(
          (wallet) =>
            wallet.enabled && !wallet.short.includes("ESCROW") && wallet?.mor
        )
        .map((filtered_wallet) => ({ ...filtered_wallet, metric_value: 0 }));

      transactions.forEach((obj) => {
        const wallet_payload = mor_wallet.find(
          (item) => item.short === obj.currency
        );

        if (wallet_payload) {
          wallet_payload.metric_value++;
        }
      });

      this.$bus.$emit("updateTransactionVolume", mor_wallet);
    },

    // ====================================
    // FETCH ALL USER TRANSACTIONS
    // ====================================
    getUserTransactions(page) {
      // USE PREVIOUSLY SAVED DATA FOR THAT PAGE NUMBER (AVOID UNNECESSARY API CALLS)
      if (this.paginatedData[page] && this.paginationPages[page]) {
        this.table_data = this.paginatedData[page];
        this.pagination = this.paginationPages[page];
        this.table_loading = false;
        return;
      }

      const payload = {
        payload: { account_id: this.getAccountId },
        page,
        limit: this.$route?.name === "AllTransactions" ? 20 : 3,
      };

      this.table_loading = true;

      this.fetchTransactionsByUser(payload)
        .then((response) => {
          if (response?.code === 200) {
            this.table_data = response.data;
            this.table_loading = false;

            this.saveTransactionDataAndPagination(
              response.data,
              response.pagination,
              page
            );
          }

          // HANDLE NON 200 RESPONSE
          else this.handleErrorResponse();
        })
        .catch(() => this.handleErrorResponse());
    },

    saveTransactionDataAndPagination(data, pagination, page) {
      //SET PAGINATION DATA
      const from = pagination?.limit * (pagination?.currentPage - 1) + 1;

      this.pagination = {
        current_page: pagination?.currentPage,
        per_page: pagination?.limit,
        last_page: pagination?.totalPages,
        from,
        to: from + (data?.length - 1),
        total: pagination?.total_records,
      };

      this.paginationPages[page] = this.pagination;

      this.paginatedData[page] = data;
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
.mor-transaction-tb {
  &-1 {
    min-width: toRem(150);
  }

  &-2 {
    min-width: toRem(150);
  }

  &-3 {
    min-width: toRem(150);
  }

  &-4 {
    min-width: toRem(120);
  }

  &-5 {
    min-width: toRem(120);
  }

  &-6 {
    min-width: toRem(60);
  }

  &-7 {
    min-width: toRem(60);
  }
}
</style>
