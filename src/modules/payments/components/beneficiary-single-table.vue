<template>
  <div>
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="single-beneficiary-tb"
      :table_data="table_data"
      :table_header="table_header"
      :is_loading="table_loading"
      empty_message="You don't have any saved beneficiary yet. Add a beneficiary now"
      empty_action_name="Add Beneficiary"
      :show_paging="true"
      :pagination="pagination"
      @emptyAction="toggleBeneficiaryModal()"
      @goToPage="changePageNumber($event)"
    >
      <template>
        <BeneficiarySingleTableRow
          v-for="(data, index) in table_data"
          :key="index"
          table_name="single-beneficiary-tb"
          :data="data"
          @refetchData="fetchBeneficiaryData()"
        />
      </template>

      <template slot="emptyIconSlot">
        <UserIcon big />
      </template>
    </TableContainer>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_beneficiary_dialog">
        <NewBeneficiaryModal
          :show_page_switcher="false"
          default_active_view="SingleBeneficiary"
          @closeTriggered="toggleBeneficiaryModal()"
        />
      </transition>
    </portal>
  </div>
</template>
    
    <script>
import { mapActions } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import UserIcon from "@/shared/components/icon-comps/user-icon";

export default {
  name: "BeneficiarySingleTable",

  components: {
    TableContainer,
    UserIcon,
    BeneficiarySingleTableRow: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/components/beneficiary-single-table-row"
      ),
    NewBeneficiaryModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/beneficiary-modal/new-beneficiary-modal"
      ),
  },

  watch: {
    $route: {
      handler(route) {
        if (route.query.refresh) {
          this.fetchBeneficiaryData();

          const { refresh, ...others } = this.$route.query;
          this.$router.replace({ query: { ...others } });
        }
      },
    },
  },

  data() {
    return {
      show_beneficiary_dialog: false,

      table_header: [
        "Account Name",
        "Account Number",
        "Account Bank",
        "Action",
      ],

      table_data: [],
      table_loading: false,
      pagination: {},
      pageNumber: 1,
    };
  },

  mounted() {
    this.fetchBeneficiaryData();
  },

  methods: {
    ...mapActions({
      fetchBankDetails: "dashboard/fetchBankDetails",
    }),

    toggleBeneficiaryModal() {
      this.show_beneficiary_dialog = !this.show_beneficiary_dialog;
    },

    async fetchBeneficiaryData() {
      this.table_loading = true;

      let response = await this.handleDataRequest({
        action: "fetchBankDetails",
        payload: this.getAccountId,
        alert_handler: {
          error: "Unable to fetch user beneficiaries",
          request_error: "Unable to fetch user beneficiaries",
        },
      });

      if (response.code === 200) {
        this.table_loading = false;
        this.table_data = this.$utils.sortByDate(response.data, "desc");
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
.single-beneficiary-tb {
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

  .head-data {
    padding: toRem(8) toRem(24) !important;
  }

  .body-data {
    padding: toRem(16) toRem(24) !important;
  }
}
</style>
    