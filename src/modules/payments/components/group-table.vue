<template>
  <div>
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="group-beneficiary-tb"
      :table_data="table_data"
      :table_header="table_header"
      :is_loading="table_loading"
      empty_message="You don't have any saved group beneficiary yet. Add beneficiaries now"
      empty_action_name="Add beneficiaries"
      :show_paging="true"
      :pagination="pagination"
      @emptyAction="$emit('addGroupBeneficiary')"
      @goToPage="changePageNumber($event)"
    >
      <template>
        <GroupTableRow
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
  </div>
</template>
        
<script>
import { mapActions } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import UserIcon from "@/shared/components/icon-comps/user-icon";

export default {
  name: "GroupTable",

  components: {
    TableContainer,
    UserIcon,
    GroupTableRow: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/components/group-table-row"
      ),
  },

  computed: {},

  watch: {
    $route: {
      handler(route) {
        if (route.query.refresh) {
          if (this.$route.query.group_id) this.fetchGroupBeneficiaries();
          this.$emit("addGroupBeneficiary");

          const { name, group_id } = this.$route.query;
          this.$router.replace({ query: { name, group_id } });
        }
      },
    },
  },

  data() {
    return {
      table_header: [
        "Account Name",
        "Account Number",
        "Bank Name",
        "Amount",
        "Action",
      ],

      table_data: [],
      table_loading: false,
      pagination: {},
      pageNumber: 1,
    };
  },

  mounted() {
    if (this.$route.query.group_id) this.fetchGroupBeneficiaries();
  },

  methods: {
    ...mapActions({
      fetchGroupBeneficiaryAccounts: "settings/fetchGroupBeneficiaryAccounts",
    }),

    async fetchGroupBeneficiaries() {
      this.table_loading = true;

      let response = await this.handleDataRequest({
        action: "fetchGroupBeneficiaryAccounts",
        payload: {
          group_id: this.$route.query.group_id,
        },
        alert_handler: {
          error: "Unable fetch group beneficiaries",
          not_found_error: "Group beneficiaries not found",
        },
      });

      if (response.code === 200) {
        this.table_loading = false;
        this.table_data = response.data;
        // this.table_data = this.$utils.sortByDate(response.data, "desc");
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
        