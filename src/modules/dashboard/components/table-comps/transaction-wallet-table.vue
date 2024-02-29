<template>
  <div>
    <!-- TABLE CONTAINER -->
    <!-- empty_action_name="Withdraw" -->
    <TableContainer
      table_name="transaction-wallet-tb"
      :table_data="table_data"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="empty_message"
      empty_action_name="Fund wallet"
      :show_paging="false"
      :pagination="pagination"
      @emptyAction="initiateWalletFunding"
      @goToPage="$emit('changePageView', $event)"
    >
      <template>
        <TransactionWalletTableRow
          v-for="(data, index) in table_data"
          :key="index"
          table_name="transaction-wallet-tb"
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
  name: "TransactionWalletTable",

  components: {
    TableContainer,
    EmptyWalletIcon,
    TransactionWalletTableRow: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/table-comps/transaction-wallet-table-row"
      ),
  },

  props: {
    table_data: {
      type: Array,
      default: () => [],
    },

    table_loading: {
      type: Boolean,
      default: false,
    },

    pagination: {
      type: Object,
      default: () => ({
        current_page: 1,
        per_page: 10,
        last_page: 3,
        from: 1,
        to: 20,
        total: 50,
      }),
    },

    empty_message: {
      type: String,
      default:
        "You have not made any transactions yet. Fund your wallet to get started",
    },
  },

  data() {
    return {
      table_header: [
        "Transaction Date",
        "Transaction Type",
        "Amount",
        "Status",
        "Action",
      ],
    };
  },

  methods: {
    initiateWalletFunding() {
      this.$router.push({
        name: "VesicashDashboard",
        query: { fund_wallet: true },
      });
    },
  },
};
</script>

<style lang="scss">
.transaction-wallet-tb {
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

  //   &-6 {
  //   }

  //   &-7 {
  //   }

  .head-data {
    padding: toRem(8) toRem(24) !important;
  }

  .body-data {
    padding: toRem(16) toRem(24) !important;
  }
}
</style>
