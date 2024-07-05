<template>
  <div>
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="transaction-tb"
      :table_data="table_data"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="getEmptyMessage"
      :empty_action_name="getEmptyActionName"
      :show_paging="showPagination"
      :pagination="pagination"
      @goToPage="fetchUserTransactions($event)"
      @emptyAction="initiateEscrowTransaction"
    >
      <template>
        <TransactionTableRow
          v-for="(data, index) in table_data"
          :key="index"
          table_name="transaction-tb"
          :data="data"
        />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";

export default {
  name: "TransactionTable",

  components: {
    TableContainer,
    TransactionTableRow: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/table-comps/escrow-transaction-table-row"
      ),
  },

  props: {
    dataset: {
      type: Array,
      default: () => [],
    },

    status: {
      type: String,
      default: "all",
    },
  },

  computed: {
    showPagination() {
      return this.$route?.name === "EscrowTransactions" ? true : false;
    },

    getEmptyMessage() {
      return this.$route?.name === "EscrowTransactions"
        ? "You have not created any transactions yet. Click the button below to get started"
        : "You have not created any transactions yet. Click the 'create escrow' button to get started";
    },

    getEmptyActionName() {
      return this.$route?.name === "EscrowTransactions" ? "Create escrow" : "";
    },

    escrowStatus() {
      const status = this.status;
      switch (status) {
        case "all":
          return [];
        case "draft":
          return ["Draft"];
        case "ongoing":
          return [
            "Accepted - Funded",
            "Accepted - Not Funded",
            "In Progress",
            "Delivered",
            "Active",
            "Funded - Awaiting Confirmation",
          ];
        case "closed":
          return [
            "Sent - Rejected",
            "Funded - Rejected",
            "Delivered - Accepted",
            "Delivered - Rejected",
            "Closed - Disbursement Pending",
            "Closed - Manual Disbursement Pending",
            "Closed - Disbursement Complete",
            "Closed - Insufficient Disbursement Balance",
            "Closed - Disputed",
            "Closed - Not Funded",
            "Closed",
            "Closed - Refunded",
            "Deleted",
          ];
        default:
          return [];
      }
    },
  },

  watch: {
    status: {
      handler() {
        this.fetchUserTransactions(1);
      },
      immediate: true,
    },
  },

  data() {
    return {
      table_header: [
        "Date created",
        "Transaction name",
        "Transacting type",
        "Amount",
        "Status",
        "Actions",
      ],

      table_data: [],
      table_loading: true,
      paginatedData: {},
      paginationPages: {},
      pagination: {
        current_page: 1,
        per_page: 20,
        last_page: 3,
        from: 1,
        to: 20,
        total: 50,
      },
      empty_message:
        "You have not created any transactions yet. Click the button below to get started",
    };
  },

  methods: {
    ...mapActions({
      fetchEscrowTransactions: "transactions/fetchEscrowTransactions",
    }),

    initiateEscrowTransaction() {
      this.$router.push({ name: "CreateEscrowPage" });
    },

    async fetchUserTransactions(page) {
      try {
        this.table_loading = true;
        const statuses = this.escrowStatus;
        const response = await this.fetchEscrowTransactions({
          page,
          statuses,
          id: this.getAccountId,
        });

        this.table_loading = false;
        if (response?.code === 200) {
          this.table_data = response?.data;
          this.pagination = {
            current_page: response?.pagination?.current_page,
            per_page: 20,
            last_page: response?.pagination?.total_pages_count || 0,
            from: 0,
            to: 0,
            total: 0,
          };
        } else {
          this.table_data = [];
          this.pushToast("Failed to load escrow transactions", "warning");
        }
      } catch (err) {
        this.table_loading = false;
        this.table_data = [];
        this.pushToast("Failed to load escrow transactions", "error");
        console.log("ERROR FETCHING ESCROW", err);
      }
    },
  },
};
</script>

<style lang="scss">
.transaction-tb {
  &-1 {
    min-width: toRem(150);
  }

  &-2 {
    min-width: toRem(200);
    max-width: toRem(205);
  }

  &-3 {
    min-width: toRem(150);
  }

  &-4 {
    min-width: toRem(110);
  }

  &-5 {
    min-width: toRem(80);
  }

  &-6 {
  }
}
</style>
