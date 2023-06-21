<template>
  <div class="transactions-page">
    <!-- PAGE TITILE -->
    <TitleTopBlock title="Payments" />

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
import TitleTopBlock from "@/shared/components/block-comps/title-top-block";

export default {
  name: "PaymentPage",

  components: {
    TitleTopBlock,
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
