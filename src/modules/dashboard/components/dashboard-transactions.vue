<template>
  <div class="dashboard-transactions">
    <PageSwitcher
      :page_data="pages"
      :full_width="false"
      @swapItem="updateTransactionChanges($event)"
    />

    <!-- DATA FILTERS -->
    <div class="filters mgt-28 mgb-28 row">
      <!-- SELECT WALLET TYPE -->
      <div class="select-field col-6 col-lg-3">
        <DropSelectInput
          placeholder="Select wallet type"
          @selectedOption="selectUserOption('wallet', $event, wallet_options)"
          :options="wallet_options"
          :pre_select="preselect_wallet"
          class_name="custom-drop-input"
        />
      </div>

      <!-- SELECT PAYMENT ENTRY -->
      <div class="select-field col-6 col-lg-3">
        <DropSelectInput
          placeholder="Payment source"
          @selectedOption="
            selectUserOption('source', $event, payment_source_options)
          "
          :options="source_options"
          :pre_select="preselect_source"
          class_name="custom-drop-input"
        />
      </div>

      <!-- SELECT DATE RANGE -->
      <div class="select-field col-6 col-lg-3">
        <!-- prefix-class="xmx" -->
        <!-- :formatter="{ stringify: () => '' }" -->
        <date-picker
          v-model="filters.date_range"
          type="date"
          range
          input-class="my-picker-class"
          placeholder="Select date"
          :clearable="true"
          :editable="false"
          :append-to-body="false"
          :disabled-date="disabledDate"
          :shortcuts="shortcutConfig"
        >
        </date-picker>
      </div>

      <div class="select-field mgt-5" v-if="showFilters">
        <button class="btn btn-md red-500 px-0 reset-btn" @click="resetFilters">
          <span class="icon-close f-size-20"></span> Reset filters
        </button>
      </div>
    </div>

    <!-- DISPLAY AREA FOR PAYMENTS/DISBURSEMENTS/WALLET -->
    <transition name="fade" mode="out-in">
      <component
        :is="getCurrentTable"
        :table_data="table_data"
        :table_loading="table_loading"
        :pagination="pagination"
        :empty_message="empty_message"
        @showTransactionModal="toggleTransactionSummaryModal"
        @changePageView="changePageNumber"
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
import { mapActions, mapGetters } from "vuex";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";
import DatePicker from "vue2-datepicker";
import { MixinDateFilter } from "@/shared/mixins";

export default {
  name: "DashboardTransactions",

  mixins: [MixinDateFilter],

  components: {
    PageSwitcher,
    DatePicker,
    TransactionWalletExchangeTable: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/components/table-comps/transaction-wallet-exchange-table"
      ),

    TransactionWalletEscrowTable: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/components/table-comps/transaction-wallet-escrow-table"
      ),

    TransactionWalletTransferTable: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/components/table-comps/transaction-wallet-transfer-table"
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

  computed: {
    ...mapGetters({ getWalletSize: "general/getWalletSize" }),

    getCurrentTable() {
      if (this.filters?.source?.length) {
        let table = this.$utils.getCapitalizeText(
          this.filters?.source || "funding"
        );

        return `TransactionWallet${table}Table`;
      } else return "TransactionWalletFundingTable";
    },

    showFilters() {
      return this.filters.wallet?.length ||
        this.filters.source?.length ||
        this.filters.date_range?.length
        ? true
        : false;
    },

    getTransactionPayload() {
      return {
        wallet_type: this.filters.wallet,
        tx_type: this.filters.transaction,
        payment_entry: this.filters.source,
        start_date: this.filters.date_range.length
          ? this.formatSelectedDate(this.filters.date_range[0])
          : "",
        end_date: this.filters.date_range.length
          ? this.formatSelectedDate(this.filters.date_range[1])
          : "",
        account_id: this.getAccountId.toString(),
        page: this.pageNumber,
      };
    },
  },

  watch: {
    "filters.date_range": {
      handler(value) {
        if (value.length)
          this.$router
            .replace({
              name: this.$route.name,
              query: {
                ...this.$route.query,
                start_date: this.formatSelectedDate(value[0]),
                end_date: this.formatSelectedDate(value[1]),
              },
            })
            .catch((error) => {
              if (error.name != "NavigationDuplicated") throw error;
            });
      },
    },

    $route: {
      handler(value) {
        let { wallet, source, pageNumber, start_date, end_date } = value.query;

        if (
          (wallet && this.filters.transaction && source) ||
          pageNumber ||
          start_date ||
          end_date
        ) {
          this.fetchTransactionData();
        } else {
          this.table_data = [];
          this.table_loading = false;
          this.pagination = {};
        }
      },
    },

    getWalletSize: {
      handler(wallet) {
        if (wallet.length > 4) {
          this.populateWalletOptions();
        }
      },
      immediate: true,
    },
  },

  data: () => ({
    wallet_options: [],

    payment_source_options: [
      {
        id: 1,
        name: "Funding",
        slug: "funding",
      },
      {
        id: 2,
        name: "Exchange",
        slug: "exchange",
      },
      {
        id: 3,
        name: "Escrow",
        slug: "escrow",
      },
      {
        id: 4,
        name: "Transfer",
        slug: "transfer",
      },
    ],

    pages: [
      {
        title: "Inflow",
        value: "inflow",
        active: true,
      },
      {
        title: "Outflow",
        value: "outflow",
        active: false,
      },
    ],

    source_options: [],

    preselect_wallet: null,
    preselect_source: null,

    filters: {
      wallet: "",
      transaction: "inflow",
      source: "funding",
      date_range: [],
    },

    show_transaction_summary_modal: false,

    table_data: [],
    table_loading: false,
    pageNumber: 1,
    pagination: {},

    empty_message:
      "You have not made any payment selections yet. You can fund your wallet to get started",
  }),

  created() {
    this.source_options = this.payment_source_options;

    this.$bus.$on("showTransactionSummary", () =>
      this.toggleTransactionSummaryModal()
    );
  },

  methods: {
    ...mapActions({
      getTransactionPayments: "dashboard/getTransactionPayments",
    }),

    toggleTransactionSummaryModal() {
      this.show_transaction_summary_modal =
        !this.show_transaction_summary_modal;
    },

    populateWalletOptions() {
      this.getWalletSize
        .filter((wallet) => wallet.enabled)
        .map((wallet_type) => {
          this.wallet_options.push({
            id: wallet_type.id,
            name: wallet_type.short.includes("ESCROW")
              ? `${wallet_type.short.split("_").join(" ")} wallet`
              : `${wallet_type.short} wallet`,
            slug: wallet_type.short,
          });
        });

      this.checkFilterStateOnRoute();
    },

    // CHECK FILTER STATE ON ROUTE
    checkFilterStateOnRoute() {
      let queries = this.$route.query;

      if (Object.keys(queries).length) {
        for (let query in queries) {
          if (["start_date", "end_date"].includes(query)) {
            this.filters.date_range[0] = new Date(queries.start_date);
            this.filters.date_range[1] = new Date(queries.end_date);
          }

          // NON DATE SELECTIONS
          else {
            let selected_option = this[`${query}_options`]?.find(
              (option) => option.slug === queries[query]
            );

            this.filters[query] = queries[query];
            this[`preselect_${query}`] = selected_option;
          }
        }

        // FETCH TRANSACTION PAYMENT DATA
        this.fetchTransactionData();
      }

      // LOAD DEFAULT OPTION
      else {
        // CHECK IF WALLET HAS FEASIBLE LENGTH
        if (this.wallet_options.length) {
          this.filters.wallet = this.wallet_options[0]?.slug;
          this.preselect_wallet = this.wallet_options[0];

          this.filters.source = this.payment_source_options[0]?.slug;
          this.preselect_source = this.payment_source_options[0];

          this.$router
            .replace({
              name: this.$route.name,
              query: {
                wallet: this.filters.wallet,
                source: this.filters.source,
              },
            })
            .catch((error) => {
              if (error.name != "NavigationDuplicated") throw error;
            });

          // FETCH TRANSACTION PAYMENT DATA
          this.fetchTransactionData();
        }
      }
    },

    // FORMAT SELECTED FILTER DATE RANGE
    formatSelectedDate(date) {
      const date_value = this.$date.formatDate(new Date(date), false);

      const day = date_value?.getDay("d2");
      const month = date_value?.getMonth("m2");
      const year = date_value?.getYear("y1");

      return `${year}-${month}-${day}`;
    },

    // RESET ALL SELECTED FILTERS
    resetFilters() {
      this.preselect_wallet = {};
      this.preselect_source = {};

      this.filters.date_range = [];
      this.filters.wallet = "";
      this.filters.source = "";

      this.table_data = [];
      this.table_loading = false;
      this.pagination = {};

      // RESET ROUTE URL
      this.$router
        .replace({ name: this.$route.name, query: {} })
        .catch((error) => {
          if (error.name != "NavigationDuplicated") throw error;
        });
    },

    // UPDATE USER FILTER SELECTION
    selectUserOption(type, value, list) {
      let selected_option = list.find((item) => item.id === value).slug;

      // VALIDATE PREVIOUS SELECTIONS
      if (this.validateFilterSelection(type, selected_option)) return true;
      this.filters[type] = selected_option;

      // UPDATE ROUTE URL QUERY
      this.$router
        .replace({
          name: this.$route.name,
          query: { ...this.$route.query, [type]: selected_option },
        })
        .catch((error) => {
          if (error.name != "NavigationDuplicated") throw error;
        });
    },

    // MANUALLY UPDATE TRANSACTION CHANGES
    updateTransactionChanges(selected_value) {
      this.filters.transaction = selected_value;

      this.$router
        .replace({
          name: this.$route.name,
          query: { ...this.$route.query, transaction: selected_value },
        })
        .catch((error) => {
          if (error.name != "NavigationDuplicated") throw error;
        });
    },

    validateFilterSelection(filter_type, filter_value) {
      let { wallet, transaction, source } = this.filters;

      // WALLET SELECTION VALIDATION
      if (filter_type === "wallet") {
        if (filter_value.toLowerCase().includes("escrow")) {
          this.source_options = this.payment_source_options.filter(
            (item) => item.slug === "escrow"
          );
        } else if (transaction.length && transaction === "outflow") {
          this.source_options = this.payment_source_options.filter(
            (item) => item.slug !== "funding"
          );
        } else this.source_options = this.payment_source_options;

        // CHECK IF PAYMENT SOURCE HAS BEEN SELECTED
        if (source.length) {
          this.resetPaymentSource();
          return false;
        }
      }

      // TRANSACTION SELECTION VALIDATION
      if (filter_type === "transaction") {
        // CHECK IF WALLET TYPE HAS BEEN SELECTED
        if (!wallet.length) {
          this.pushToast(`Please select a wallet type`, "error");
          this.preselect_transaction = {};
          return true;
        } else {
          // WALLET SELECTED
          if (
            ["outflow", "inflow"].includes(filter_value) &&
            wallet.toLowerCase().includes("escrow")
          ) {
            this.source_options = this.payment_source_options.filter(
              (item) => item.slug === "escrow"
            );
          } else {
            if (filter_value === "outflow") {
              this.source_options = this.payment_source_options.filter(
                (item) => item.slug !== "funding"
              );
            } else this.source_options = this.payment_source_options;
          }

          // RESET SELECTED PAYMENT SOURCE
          this.resetPaymentSource();
        }
      }

      // PAYMENT SOURCE SELECTION VALIDATION
      if (filter_type === "source") {
        // CHECK IF WALLET TYPE HAS BEEN SELECTED
        if (!wallet.length) {
          this.pushToast(`Please select a wallet type`, "error");
          this.preselect_source = {};
          return true;
        }

        // CHECK IF TRANSACTION TYPE HAS BEEN SELECTED
        else if (!transaction.length) {
          this.pushToast(`Please select a transaction type`, "error");
          this.preselect_source = {};
          return true;
        }
      }
    },

    // RESET SELECTED PAYMENT SOURCE
    resetPaymentSource() {
      this.filters.source = "";
      this.preselect_source = {};

      const queryParams = Object.assign({}, this.$route.query);
      delete queryParams.source;

      // Navigate to the current route with the updated query parameters
      this.$router.replace({ query: queryParams }).catch((error) => {
        if (error.name != "NavigationDuplicated") throw error;
      });
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

    // FETCH TRANSACTION DATA
    fetchTransactionData() {
      this.table_loading = true;

      this.getTransactionPayments(this.getTransactionPayload)
        .then((response) => {
          let { data, ...pagination } = response.data;

          if (response?.code === 200) {
            this.table_loading = false;

            this.table_data =
              this.$route.name === "VesicashDashboard"
                ? data.slice(0, 3)
                : data;
            this.pagination = pagination;
          } else {
            this.handleErrorResponse();
          }
        })
        .catch(() => this.handleErrorResponse());
    },

    // ==========================
    // HANDLE ERROR RESPONSE
    // ==========================
    handleErrorResponse() {
      this.table_loading = false;
      this.table_data = [];
      this.pagination = {};
    },
  },
};
</script>

<style lang="scss">
.dashboard-transactions {
  .filters {
    .select-field {
      &:nth-of-type(3),
      &:nth-of-type(4) {
        @include breakpoint-down(lg) {
          margin-top: toRem(18);
        }
      }
    }
  }
}

.custom-drop-input {
  .select-input {
    border: toRem(1) solid getColor("grey-200");
    background-color: getColor("grey-10");

    .placeholder-text {
      color: getColor("grey-500") !important;
    }
  }
}
</style>
