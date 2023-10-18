<template>
  <div class="dashboard-view">
    <!-- TITLE TOP BLOCK -->
    <TitleTopBlock title="Foreign Exchange" />

    <!-- WALLET BALANCE SECTION -->
    <WalletBlock card_type="exchange" />

    <!-- TRANSACTION SECTION -->
    <template>
      <div class="section-title mgt-45 mgb-18 h5-text grey-900">
        Exchange transactions
      </div>

      <!-- EXCHANGE TABLE DATA -->
      <div class="exchange-table-wrapper">
        <ExchangeTable />
      </div>
    </template>

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
import { mapActions, mapMutations, mapGetters } from "vuex";
import TitleTopBlock from "@/shared/components/block-comps/title-top-block";
import WalletBlock from "@/shared/components/block-comps/wallet-block";

export default {
  name: "ExchangeDashboard",

  metaInfo: {
    title: "Exchange Dashboard",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    TitleTopBlock,
    WalletBlock,
    ExchangeTable: () =>
      import(
        /* webpackChunkName: "exchange-module" */ "@/modules/exchange/components/table-comps/exchange-table"
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

    successActions() {
      return [
        {
          title: "Transfer money ",
          action: () => {},
        },

        {
          title: "Fund your wallet",
          action: () => {},
        },
      ];
    },
  },

  watch: {
    "getTourData.count": {
      handler(value) {
        this.show_walkhthrough_card = false;
        this.show_exchange_btn = false;

        if (value === 6) {
          setTimeout(() => (this.show_walkhthrough_card = true), 300);

          if (value === 6) {
            this.show_exchange_btn = true;
          }
        }
      },
      immediate: true,
    },
  },

  data() {
    return {
      show_walkhthrough_card: false,
      show_exchange_btn: false,

      tour_data: {
        title: "Exchange currency",
        description:
          "Swap currencies at the best rates on the market. View your exchange history here",
        marker: "center-top",
        position: "tour-six-position",
      },

      naira_dollar_wallet: [
        {
          title: "NGN",
          value: "0.00",
          sign: "naira",
        },
        {
          title: "USD",
          value: "0.00",
          sign: "dollar",
        },
        {
          title: "GBP",
          value: "0.00",
          sign: "pound",
        },
      ],

      loading_wallet: true,
    };
  },

  mounted() {
    // CLEAR OUT TRANSAACTION STORE
    this.RESET_TRANSACTION();
    this.clearAttachedFile();
  },

  methods: {
    ...mapActions({
      clearAttachedFile: "general/clearAttachedFile",
    }),
    ...mapMutations({
      RESET_TRANSACTION: "transactions/RESET_TRANSACTION",
    }),
  },
};
</script>

<style lang="scss" scoped>
.dashboard-view {
  .welcome-row {
    @include flex-row-wrap("space-between", "center");
    gap: toRem(24);
    margin-bottom: toRem(24);

    @include breakpoint-down(lg) {
      margin-bottom: toRem(16);
    }

    .welcome-message {
      @include breakpoint-down(sm) {
        font-size: toRem(18.75);
      }

      @include breakpoint-down(xs) {
        font-size: toRem(18.5);
      }
    }
  }

  .metrics-section {
    @include flex-row-wrap("flex-start", "center");
    gap: toRem(32);

    .btn {
      padding: toRem(10) toRem(19.5);
      font-size: toRem(14.5);

      @include breakpoint-custom-down(1220) {
        @include get-btn-size("md");
        margin-top: toRem(16);
      }

      @include breakpoint-down(sm) {
        padding: toRem(8.5) toRem(19);
        font-size: toRem(13.5);
        margin-top: toRem(16);
      }
    }
  }

  .section-title {
    @include breakpoint-down(sm) {
      font-size: toRem(18.75);
    }

    @include breakpoint-down(xs) {
      font-size: toRem(18.5);
    }
  }

  .exchange-table-wrapper {
    margin-bottom: toRem(50);

    @include breakpoint-down(lg) {
      margin-bottom: toRem(40);
    }
  }
}

.tour-index {
  @include transition(0.3s);
  z-index: 1099;
}

.tour-six-position {
  top: 21%;
  left: 58%;

  @include breakpoint-down(xl) {
    top: 22%;
    left: 68%;
  }
}
</style>
