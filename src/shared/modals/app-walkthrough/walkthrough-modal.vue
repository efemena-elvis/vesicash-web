<template>
  <div class="wrapper position-absolute w-auto h-auto" :class="tour.position">
    <div
      class="walkthrough-modal position-relative rounded-8 neutral-10-bg h-auto"
    >
      <!-- TOP AREA -->
      <div class="top-area">
        <!-- TITLE TEXT -->
        <div class="title-text primary-1-text text-center grey-900 mgb-8">
          {{ tour.title }}
        </div>

        <!-- DESCRIPTION TEXT -->
        <div
          class="description-text tertiary-1-text text-center grey-700"
          v-html="tour.description"
        ></div>
      </div>

      <!-- BOTTOM AREA -->
      <div class="bottom-area">
        <button class="btn btn-secondary btn-md" @click="skipTour" ref="skip">
          Skip
        </button>

        <!-- PAGING OPTIONS -->
        <div class="paging-option tertiary-2-text grey-700">
          {{ getTourData.count }} of {{ getTourData.total }}
        </div>

        <button class="btn btn-primary btn-md" @click="nextTour">Next</button>
      </div>

      <!-- ARROW INDICATOR -->
      <div class="arrow-indicator smooth-transition" :class="tour.marker"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "walkthroughModal",

  props: {
    tour: {
      type: Object,
      default: () => ({
        title: "Your dashboard",
        description:
          "  Your dashboard shows your Wallet balances at a glance. Any funds currently being held in Escrow are also displayed here.",
        marker: "center-top",
        position: "",
      }),
    },
  },

  computed: {
    ...mapGetters({ getTourData: "general/getTourData" }),
  },

  methods: {
    ...mapActions({ updateUserTourStatus: "auth/updateUserTourStatus" }),

    ...mapMutations({ UPDATE_TOUR_FLOW: "general/UPDATE_TOUR_FLOW" }),

    async upateTourStatus() {
      const payload = {
        account_id: this.getAccountId,
        status: true,
      };

      this.handleClick("skip");

      const response = await this.updateUserTourStatus(payload);

      this.handleClick("skip", "Skip", false);

      if (response?.code === 200) this.$emit("skipTour");
    },

    // MOVE TO NEXT TOUR SCREEN
    nextTour() {
      this.UPDATE_TOUR_FLOW(this.getTourData.count + 1);

      if (this.getTourData.count === 5)
        this.$router.push({ name: "AllTransactions" });

      if (this.getTourData.count === 6)
        this.$router.push({ name: "VesicashEchange" });

      if (this.getTourData.count === 7)
        this.$router.push({ name: "PaymentsPage" });

      if (this.getTourData.count === 8)
        this.$router.push({ name: "VesicashDashboard" });
    },

    // END TOUR SCREEN FLOW
    async skipTour() {
      await this.upateTourStatus();
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  .walkthrough-modal {
    z-index: 2099;
    width: toRem(330);

    .top-area {
      padding: toRem(20) toRem(24);
      border-bottom: toRem(0.5) solid getColor("grey-100");

      .description-text {
        @include font-height(15, 24.5);
      }
    }

    .bottom-area {
      padding: toRem(20) toRem(16);
      @include flex-row-nowrap("space-between", "center");
    }

    .arrow-indicator {
      position: absolute;
      width: 0;
      height: 0;
      border: toRem(12) solid transparent;
      border-top: 0;
      border-bottom: toRem(14) solid getColor("neutral-10");
    }

    .center-top {
      top: toRem(-14);
      left: 50%;
    }

    .edge-top {
      top: toRem(-14);
      left: 25%;
    }

    .center-bottom {
      transform: rotate(180deg);
      bottom: toRem(-14);
      left: 50%;
    }

    .center-left {
      transform: rotate(90deg);
      right: toRem(-16.65);
      top: 50%;
    }

    .center-right {
      transform: rotate(-90deg);
      left: toRem(-16.65);
      top: 50%;
    }

    .edge-right {
      transform: rotate(-90deg);
      left: toRem(-16.65);
      top: 85%;
    }
  }
}
</style>
