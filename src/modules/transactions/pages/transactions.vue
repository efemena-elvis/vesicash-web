<template>
  <div class="escrow-page">
    <!-- PAGE TITILE -->
    <TitleTopBlock title="Escrow Transactions" type="escrow" />

    <!-- DISBURSEMENT TABLE DATA -->
    <div class="escrow-table-wrapper">
      <TransactionTable />
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="getTourData.ongoing">
        <tourCover />
      </transition>

      <transition name="fade" v-if="show_walkhthrough_card">
        <walkthroughModal :tour="tour_data" />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TitleTopBlock from "@/shared/components/block-comps/title-top-block";

export default {
  name: "EscrowTransactions",

  components: {
    TitleTopBlock,
    TransactionTable: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/table-comps/transaction-table"
      ),
    walkthroughModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/modals/app-walkthrough/walkthrough-modal"
      ),
    tourCover: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/util-comps/tour-cover"
      ),
  },

  computed: {
    ...mapGetters({
      getTourData: "general/getTourData",
    }),
  },

  watch: {
    "getTourData.count": {
      handler(value) {
        this.show_walkhthrough_card = false;

        if (value === 5)
          setTimeout(() => (this.show_walkhthrough_card = true), 300);
      },
      immediate: true,
    },
  },

  data: () => ({
    show_walkhthrough_card: false,

    tour_data: {
      title: "Escrow transactions",
      description:
        "Access all your escrow transactions here. View and Manage the status of your transactions.",
      marker: "center-right",
      position: "tour-five-position",
    },
  }),
};
</script>

<style lang="scss" scoped>
.tour-five-position {
  top: 8%;
  left: 18.75%;

  @include breakpoint-down(xl) {
    top: 7.75%;
    left: 22%;
  }
}
</style>
