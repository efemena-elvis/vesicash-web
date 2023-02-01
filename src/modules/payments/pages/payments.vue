<template>
  <div class="transactions-page">
    <!-- PAGE TITILE -->
    <div class="page-title grey-900 h4-text mgb-25">Payments</div>

    <!-- DASHBOARD TRANSACTIONS -->
    <div class="wrapper pdb-30">
      <DashboardTransactions />
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

export default {
  name: "Transactions",

  components: {
    DashboardTransactions: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/dashboard-transactions"
      ),
    walkthroughModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/modals/app-walkthrough/walkthrough-modal"
      ),
    tourCover: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/tour-cover"
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

        if (value === 7)
          setTimeout(() => (this.show_walkhthrough_card = true), 300);
      },
      immediate: true,
    },
  },

  data: () => ({
    show_walkhthrough_card: false,

    tour_data: {
      title: "All payments",
      description:
        "A record of all your payments can be found here; Disbursements, Wallet payments etc",
      marker: "center-right",
      position: "tour-seven-position",
    },
  }),
};
</script>

<style lang="scss" scoped>
.tour-seven-position {
  top: 22.75%;
  left: 18.75%;

  @include breakpoint-down(xl) {
    top: 23%;
    left: 22%;
  }
}
</style>
