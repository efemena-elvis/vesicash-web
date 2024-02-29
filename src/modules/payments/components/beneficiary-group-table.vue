<template>
  <div>
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="group-beneficiary-tb"
      :table_data="table_data"
      :table_header="table_header"
      :is_loading="table_loading"
      empty_message="You don't have any saved group beneficiary yet. Add a beneficiary group now"
      empty_action_name="Add Beneficiary"
      :show_paging="true"
      :pagination="pagination"
      @emptyAction="toggleBeneficiaryModal()"
      @goToPage="changePageNumber($event)"
    >
      <template>
        <BeneficiaryGroupTableRow
          v-for="(data, index) in table_data"
          :key="index"
          table_name="group-beneficiary-tb"
          :data="data"
          @refetchData="fetchGroupBeneficiaries()"
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
          default_active_view="GroupBeneficiary"
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
  name: "BeneficiaryGroupTable",

  components: {
    TableContainer,
    UserIcon,
    BeneficiaryGroupTableRow: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/components/beneficiary-group-table-row"
      ),
    NewBeneficiaryModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/beneficiary-modal/new-beneficiary-modal"
      ),
  },

  data() {
    return {
      show_beneficiary_dialog: false,

      table_header: [
        "Group Name",
        "Number of Recipients",
        "Date Created",
        "Action",
      ],

      table_data: [{}, {}],
      table_loading: false,
      pagination: {},
      pageNumber: 1,
    };
  },

  mounted() {
    this.fetchGroupBeneficiaries();
  },

  methods: {
    ...mapActions({
      fetchGroupAccounts: "settings/fetchGroupAccounts",
    }),

    toggleBeneficiaryModal() {
      this.show_beneficiary_dialog = !this.show_beneficiary_dialog;
    },

    async fetchGroupBeneficiaries() {
      this.table_loading = true;

      let response = await this.handleDataRequest({
        action: "fetchGroupAccounts",
        alert_handler: {
          error: "Unable to fetch beneficiary groups",
          not_found_error: "Beneficiary groups not found",
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
.group-beneficiary-tb {
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
      