<template>
  <div class="dashboard-view">
    <transition name="fade" mode="out-in">
      <div class="alert-wrapper" v-if="getUserVerifications && !isDocVerified">
        <UpgradeAlertCard />
      </div>
    </transition>

    <div class="welcome-row">
      <!-- WELCOME MESSAGE -->
      <div class="welcome-message h5-text grey-900">
        Welcome
        <span>{{ displayUserFirstname }}</span>
      </div>

      <!-- DISBURSE MONEY BUTTON -->
      <router-link
        :to="{ name: 'TransactionSetup' }"
        class="btn btn-primary btn-md"
        :class="show_escrow_btn ? 'tour-index' : null"
        >Create Escrow</router-link
      >
    </div>

    <!-- METRICS SECTION -->
    <div class="metrics-section mgb-40">
      <!-- NAIRA DOLLAR SECTION -->
      <NairaDollarMetricCard
        :wallet_balance="naira_dollar_wallet"
        :loading_wallet="loading_wallet"
      />

      <!-- ESCROW SECTION -->
      <EscrowMetricCard
        :escrow_balance="escrow_wallet"
        :loading_wallet="loading_wallet"
      />

      <!-- DISBURSE MONEY BUTTON -->
      <!-- <router-link :to="{ name: 'TransactionSetup' }" class="btn btn-primary btn-md">Create Escrow</router-link> -->
    </div>

    <!-- TRANSACTION SECTION -->
    <template>
      <div class="section-title mgb-18 h5-text grey-900">Transactions</div>

      <!-- TRANSACTION TABLE DATA -->
      <div class="disbursement-table-wrapper">
        <TransactionTable />
      </div>
    </template>

    <!-- TRANSACTION SECTION -->
    <template>
      <div class="section-title mgb-8 h5-text grey-900">Payments</div>

      <!-- DASHBOARD TRANSACTIONS -->
      <div class="wrapper pdb-30">
        <DashboardTransactions />
      </div>
    </template>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition
        name="fade"
        v-if="show_start_walkthrough_modal && !hasUserSeenTour"
      >
        <startWalkthroughModal @closeTriggered="toggleStartWalkthrough" />
      </transition>

      <transition name="fade" v-if="show_end_walkthrough_modal">
        <endWalkthroughModal @endTour="closeTourAndVerifyUser" />
      </transition>

      <transition
        name="fade"
        v-if="show_phone_entry && !isPhoneVerified && !hasUserSeenTour"
      >
        <VerifyInputModal
          @continue="updateVerificationPhone"
          :input="getUserPhone"
          @closeTriggered="show_phone_entry = false"
        />
      </transition>

      <transition name="fade" v-if="show_phone_otp_entry">
        <VerifyOTPModal
          :input="verify_phone_number"
          @done="closeAndShowSuccess"
          @closeTriggered="show_phone_otp_entry = false"
        />
      </transition>

      <transition name="fade" v-if="show_success">
        <successModal
          message="Your phone number has been verified successfully"
          main_cta_title="Back to home"
          @done="closeModal"
        />
      </transition>

      <transition name="fade" v-if="getTourData.ongoing">
        <tourCover />
      </transition>

      <transition name="fade" v-if="show_walkthrough_card">
        <walkthroughModal
          @skipTour="skipTour"
          :tour="tour_data[getTourData.count === 8 ? 4 : getTourData.count - 1]"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
  name: "Dashboard",

  metaInfo: {
    title: "Dashboard",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    NairaDollarMetricCard: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/card-comps/naira-dollar-metric-card"
      ),
    EscrowMetricCard: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/card-comps/escrow-metric-card"
      ),
    TransactionTable: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/table-comps/transaction-table"
      ),
    DashboardTransactions: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/dashboard-transactions"
      ),
    UpgradeAlertCard: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/card-comps/upgrade-alert-card"
      ),
    startWalkthroughModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/modals/app-walkthrough/start-walkthrough-modal"
      ),
    endWalkthroughModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/modals/app-walkthrough/end-walkthrough-modal"
      ),
    walkthroughModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/modals/app-walkthrough/walkthrough-modal"
      ),
    VerifyInputModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/modules/settings/modals/verify-input-modal"
      ),
    VerifyOTPModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/modules/settings/modals/verify-otp-modal"
      ),
    successModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/modals/success-modal"
      ),
    tourCover: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/tour-cover"
      ),
  },

  computed: {
    ...mapGetters({
      getUserVerifications: "settings/getUserVerifications",
      getTourData: "general/getTourData",
      hasUserSeenTour: "auth/hasUserSeenTour",
    }),

    displayUserFirstname() {
      return this.getUser?.fullname?.split(" ")[0] ?? this.getUser.email;
    },

    isDocVerified() {
      if (!this.getUserVerifications) return false;
      const doc_verification = this.getUserVerifications.find(
        (type) => type.verification_type === "cac"
      );
      return doc_verification ? doc_verification?.is_verified : false;
    },

    isPhoneVerified() {
      if (!this.getUserVerifications) return false;
      const phone_verification = this.getUserVerifications.find(
        (type) => type.verification_type === "phone"
      );
      return phone_verification ? phone_verification?.is_verified : false;
    },

    getUserPhone() {
      return this.getUser?.phone;
    },
  },

  watch: {
    getTourData: {
      handler(value) {
        if (!value.ongoing) {
          // SCROLL TO TOP
          window.scrollTo(0, 0);

          if (this.getTourData.count === 0) {
            if (window.innerWidth > 1024)
              this.show_start_walkthrough_modal = true;
            else this.show_phone_entry = true;
          } else if (this.getTourData.count === this.getTourData.total + 1)
            this.show_end_walkthrough_modal = true;
        }
      },
      immediate: true,
      deep: true,
    },

    "getTourData.count": {
      handler(value) {
        this.show_walkthrough_card = false;
        this.show_escrow_btn = false;

        if (this.getTourData.ongoing) {
          if (value > 0 && value < this.getTourData.total + 1) {
            setTimeout(() => (this.show_walkthrough_card = true), 300);

            if (value === 4) {
              this.show_escrow_btn = true;
            }
          }
        }
      },
      immediate: true,
    },
  },

  data() {
    return {
      show_start_walkthrough_modal: false,
      show_end_walkthrough_modal: false,
      show_walkthrough_card: false,
      show_escrow_btn: false,

      show_phone_entry: false,
      show_phone_otp_entry: false,
      show_success: false,
      verify_phone_number: this.getUserPhone,

      tour_data: [
        {
          title: "Your dashboard",
          description:
            "Your dashboard shows your Wallet balances at a glance. Any funds currently being held in Escrow are also displayed here.",
          marker: "center-top",
          position: "tour-one-position",
        },
        {
          title: "Funding",
          description:
            "Easily add funds to your Wallet(s) here. Funding can be made via Bank or Wire transfer to any of your selected wallet",
          marker: "center-top",
          position: "tour-two-position",
        },

        {
          title: "Withdrawals",
          description:
            "You can initiate wallet withdrawals here. The entered amount would settle in your designated bank account(s) immediately.",
          marker: "center-top",
          position: "tour-three-position",
        },
        {
          title: "Create Escrow",
          description:
            "Initiate One–to-one or Multi-party Escrow transactions and specify either a one time or milestone disbursement payment type.",
          marker: "center-left",
          position: "tour-four-position",
        },

        {
          title: "Business ID",
          description:
            "Your Business ID is unique to your account. Access and copy it here to receive payments from other businesses on the Vesicash platform.",
          marker: "center-bottom",
          position: "tour-eight-position",
        },
      ],

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

      escrow_wallet: [
        {
          title: "DOLLAR",
          value: "0.00",
          sign: "dollar",
        },
        {
          title: "NAIRA",
          value: "0.00",
          sign: "naira",
        },
        {
          title: "POUND",
          value: "0.00",
          sign: "pound",
        },
      ],

      loading_wallet: true,
    };
  },

  mounted() {
    this.fetchUserWalletBalance();

    if (!this.getUserVerifications) this.fetchVerifications();

    // CLEAR OUT TRANSAACTION STORE
    this.RESET_TRANSACTION();
    this.clearAttachedFile();
  },

  methods: {
    ...mapActions({
      getWalletBalance: "dashboard/getWalletBalance",
      clearAttachedFile: "general/clearAttachedFile",
      fetchUserVerifications: "settings/fetchUserVerifications",
      updateUserTourStatus: "auth/updateUserTourStatus",
    }),

    updateProfile() {
      const updatedUser = {
        ...this.getUser,
        has_seen_tour: true,
      };

      this.UPDATE_AUTH_USER(updatedUser);
    },

    updateVerificationPhone(phone) {
      this.verify_phone_number = phone;
      this.closeAndVerifyOTP();
    },

    async upateTourStatus() {
      const payload = {
        account_id: this.getAccountId,
        status: true,
      };
      await this.updateUserTourStatus(payload);
    },

    ...mapMutations({
      RESET_TRANSACTION: "transactions/RESET_TRANSACTION",
      END_TOUR_FLOW: "general/END_TOUR_FLOW",
      UPDATE_AUTH_USER: "auth/UPDATE_AUTH_USER",
    }),

    skipTour() {
      this.show_walkthrough_card = false;
      this.END_TOUR_FLOW();
      this.updateProfile();
    },

    // RELOAD PAGE ON COMPLETE VERIFICATION
    closeModal() {
      location.reload();
    },

    closeTourAndVerifyUser() {
      this.show_end_walkthrough_modal = false;
      this.show_phone_entry = true;
      this.upateTourStatus();
    },

    closeAndVerifyOTP() {
      this.show_phone_entry = false;
      this.show_phone_otp_entry = true;
    },

    closeAndShowSuccess() {
      this.show_phone_otp_entry = false;
      this.show_success = true;
    },

    toggleStartWalkthrough() {
      this.show_start_walkthrough_modal = !this.show_start_walkthrough_modal;
    },

    toggleEndWalkthrough() {
      this.show_end_walkthrough_modal = !this.show_end_walkthrough_modal;
    },

    async fetchVerifications() {
      await this.fetchUserVerifications({ account_id: this.getAccountId });
    },

    // =============================================
    // FETCH ALL WALLET BALANCE OF CURRENT USER
    // =============================================
    fetchUserWalletBalance() {
      let request_payload = {
        account_id: this.getAccountId,
      };

      this.getWalletBalance(request_payload)
        .then((response) => {
          if (response.code === 200) {
            let { wallets } = response?.data;
            // DOLLAR BALANCE
            let dollar_balance = wallets.find(
              (wallet) => wallet.currency == "USD"
            );

            // NAIRA BALANCE
            let naira_balance = wallets.find(
              (wallet) => wallet.currency == "NGN"
            );

            // ESCROW NAIRA BALANCE
            let escrow_naira_balance = wallets.find(
              (wallet) => wallet.currency == "ESCROW_NGN"
            );

            // ESCROW DOLLAR BALANCE
            let escrow_dollar_balance = wallets.find(
              (wallet) => wallet.currency == "ESCROW_USD"
            );

            this.naira_dollar_wallet[0].value = naira_balance.available;
            this.naira_dollar_wallet[1].value = dollar_balance.available;
            this.escrow_wallet[0].value = escrow_naira_balance.available;
            this.escrow_wallet[1].value = escrow_dollar_balance.available;

            this.loading_wallet = false;
          } else {
            this.loading_wallet = false;
          }
        })
        .catch(() => (this.loading_wallet = false));
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-view {
  position: relative;

  .alert-wrapper {
    width: 680px;
    max-width: 99%;
    margin-bottom: toRem(24);
  }

  .welcome-row {
    @include flex-row-between-wrap;
    align-items: center;
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

  .metrics-section {
    @include flex-row-start-wrap;
    align-items: stretch;
    gap: toRem(32);
  }

  .section-title {
    @include breakpoint-down(sm) {
      font-size: toRem(18.75);
    }

    @include breakpoint-down(xs) {
      font-size: toRem(18.5);
    }
  }

  .disbursement-table-wrapper {
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

.tour-one-position {
  top: 46.5%;
  left: 47%;

  @include breakpoint-down(xl) {
    top: 48%;
    left: 58%;
  }
}

.tour-two-position {
  top: 45%;
  left: 15%;

  @include breakpoint-down(xl) {
    top: 47%;
    left: 18%;
  }
}

.tour-three-position {
  top: 45%;
  left: 26%;

  @include breakpoint-down(xl) {
    top: 47%;
    left: 31%;
  }
}

.tour-four-position {
  top: 5%;
  left: 64.75%;

  @include breakpoint-down(xl) {
    top: 6.5%;
    left: 56.5%;
  }
}

.tour-eight-position {
  top: 59.25%;
  left: 4%;
}
</style>
