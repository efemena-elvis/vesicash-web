<template>
  <div class="merchant-introduction">
    <!-- MERCHANT HEADER -->
    <MerchantHeader />

    <!-- MERCHANT BODY AREA -->
    <div class="merchant-body">
      <div class="welcome-text teal-800 text-center roobert-400">
        Welcome to our exciting new feature:
        <span class="roobert-600 green-600">Merchant of Record!</span> With this
        powerful tool, we take care of the complexities involved in processing
        your transactions, so you can focus on growing your business and
        providing an exceptional customer experience. Key features includes:
      </div>

      <!-- KEY FEATURES -->
      <div class="features mgt-20">
        <FeatureCard
          v-for="(feature, index) of features"
          :key="index"
          :feature="feature"
        />
      </div>

      <!-- ACTIONS ROW -->
      <div class="action-row mgt-20 mgb-30">
        <!-- <button class="btn btn-md btn-secondary" @click="remindMeLater">
          Remind me later
        </button> -->

        <button class="btn btn-md btn-primary" @click="toggleWaitlistModal">
          Get started
        </button>
      </div>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_waitlist_modal">
        <MorWaitlistModal
          @closeTriggered="toggleWaitlistModal"
          @done="updateMoRIntroductionState"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import MerchantHeader from "@/modules/merchant-of-records/modules/config/components/merchant-header";
import FeatureCard from "@/modules/merchant-of-records/modules/config/components/feature-card";
import MorWaitlistModal from "@/modules/mor/modals/mor-waitlist-modal";

export default {
  name: "MerchantIntroduction",

  components: {
    MerchantHeader,
    FeatureCard,
    MorWaitlistModal,
  },

  data: () => ({
    show_waitlist_modal: false,
    features: [
      {
        icon: "money-icon.png",
        title: "Global Payment Processing",
        description:
          "Seamlessly accept payments from customers worldwide with support for multiple payment methods, currencies, and languages.",
      },
      {
        icon: "tax-icon.png",
        title: "Tax Compliance Made Simple",
        description:
          "Automate tax calculations and collections across different jurisdictions, ensuring compliance without the hassle.",
      },
      {
        icon: "shield-icon.png",
        title: "Robust Customer Security",
        description:
          "Protect customer payment information with industry-leading security measures, including data encryption and fraud detection.",
      },
      {
        icon: "chart-icon.png",
        title: "Analytics and Reporting",
        description:
          "Gain valuable insights into sales performance and customer behavior through comprehensive analytics and reporting tools.",
      },
    ],
  }),

  mounted() {
    // this.updateMoRIntroductionState();
    this.fetchMORBusinessTypes();
    this.fetchMORCountries();
  },

  methods: {
    ...mapActions({
      saveUserProfile: "settings/saveUserProfile",
      fetchMORCountries: "mor/fetchMORCountries",
      fetchMORBusinessTypes: "mor/fetchMORBusinessTypes",
    }),

    toggleWaitlistModal() {
      this.show_waitlist_modal = !this.show_waitlist_modal;
    },

    ...mapMutations({ UPDATE_AUTH_USER: "auth/UPDATE_AUTH_USER" }),

    remindMeLater() {
      this.$router.push({ name: "VesicashDashboard" });
    },

    enableMoR() {
      this.$router.push({ name: "MerchantUpgrade" });
    },

    async updateMoRIntroductionState() {
      const response = await this.handleDataRequest({
        action: "saveUserProfile",
        payload: { has_seen_mor_introduction: true },
        alert_handler: {
          error: "Failed to update mor introduction",
        },
      });

      if (response?.code === 200) {
        this.updateProfile();
        location.href = this.getUser?.is_upgraded
          ? "/dashboard"
          : "/merchant/document-upgrade";
      }
    },

    updateProfile() {
      const updatedUser = {
        ...this.getUser,
        has_seen_mor_introduction: true,
      };

      this.UPDATE_AUTH_USER(updatedUser);
    },
  },
};
</script>

<style lang="scss" scoped>
.merchant-introduction {
  .merchant-body {
    @include flex-column("center", "center");

    .welcome-text {
      @include font-height(17.5, 28);
      width: 60%;

      @include breakpoint-down(md) {
        @include font-height(16.25, 26);
        width: 80%;
      }

      @include breakpoint-custom-down(680) {
        @include font-height(16, 26);
        width: 85%;
      }

      @include breakpoint-down(sm) {
        @include font-height(15.25, 26);
        width: 90%;
      }

      @include breakpoint-down(xs) {
        @include font-height(14.75, 26);
        width: 100%;
      }
    }

    .features {
      @include flex-row-wrap("center", "flex-start");

      @include breakpoint-custom-down(680) {
        @include flex-row-wrap("space-between", "flex-start");
      }
    }

    .action-row {
      @include flex-row-nowrap("center", "flex-start");

      .btn {
        padding: toRem(10) toRem(22);
        margin: 0 toRem(12);
        width: toRem(170);
      }
    }
  }
}
</style>
