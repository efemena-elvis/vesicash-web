<template>
  <div>
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="transfer-wallet-tb"
      :table_data="table_data"
      :table_header="table_header"
      :is_loading="table_loading"
      empty_message="You have not made any transactions yet. Send money to a beneficiary to get started"
      empty_action_name="Send Money"
      :show_paging="true"
      :pagination="pagination"
      @emptyAction="initiateFundTransfer"
      @goToPage="changePageNumber($event)"
    >
      <template>
        <PaymentWithdrawalTableRow
          v-for="(data, index) in table_data"
          :key="index"
          table_name="transfer-wallet-tb"
          :data="data"
        />
      </template>

      <template slot="emptyIconSlot">
        <EmptyWalletIcon />
      </template>
    </TableContainer>
  </div>
</template>
  
  <script>
import { mapActions } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import EmptyWalletIcon from "@/shared/components/icon-comps/empty-wallet-icon";

export default {
  name: "PaymentWithdrawalTable",

  components: {
    TableContainer,
    EmptyWalletIcon,
    PaymentWithdrawalTableRow: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/components/payment-withdrawal-table-row"
      ),
  },

  computed: {
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

  data() {
    return {
      table_header: [
        "Transaction Date",
        "Beneficiary Name",
        "Amount",
        "Status",
        "Action",
      ],

      table_data: [],
      table_loading: false,
      pagination: {},
      pageNumber: 1,
    };
  },

  mounted() {
    this.fetchWithdrawalData();
  },

  methods: {
    ...mapActions({
      fetchAllWithdrawals: "dashboard/fetchAllWithdrawals",
    }),

    initiateFundTransfer() {
      this.$router.push({
        name: "SendMoney",
      });
    },

    async fetchWithdrawalData() {
      this.table_loading = true;

      let response = await this.handleDataRequest({
        action: "fetchAllWithdrawals",
        payload: this.getRequestPayload,
        alert_handler: {
          error: "Unable to fetch wallet transactions",
          not_found_error: "Wallet transactions not found",
        },
      });

      if (response.code === 200) {
        this.table_loading = false;
        this.table_data = response.data;
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
      this.pagination = {};
    },

    // CHANGE PAGE NUMBER VIEW
    changePageNumber(pageNumber) {
      this.pageNumber = pageNumber;

      this.$router
        .replace({
          name: this.$route.name,
          query: { ...this.$route.query, page: this.pageNumber },
        })
        .catch((error) => {
          if (error.name != "NavigationDuplicated") throw error;
        });
    },
  },
};
</script>
  
  <style lang="scss">
.transfer-wallet-tb {
  &-1 {
    max-width: toRem(170);
  }

  &-2 {
    @include text-truncate();
    max-width: toRem(160);
  }

  &-3 {
    max-width: toRem(210);
  }

  &-4 {
    max-width: toRem(140);
  }

  &-5 {
    max-width: toRem(140);
  }

  .head-data {
    padding: toRem(8) toRem(24) !important;
  }

  .body-data {
    padding: toRem(16) toRem(24) !important;
  }
}
</style>
  