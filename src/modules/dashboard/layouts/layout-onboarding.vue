<template>
  <div class="layout-disbursement">
    <!-- TITLE TEXT -->
    <!-- <div class="title-text h4-text mgb-12 grey-900">Let's get you verified</div> -->

    <!-- FUND DISBURSMENT FLOW -->
    <!-- <ProgressFlowCard :flows="getComputedPageFlow" /> -->

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>

    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_welcome_dialog">
        <welcomeModal
          @closeDialog="toggleWelcomeDialog"
          @closeTriggered="toggleWelcomeDialog"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ProgressFlowCard from "@/shared/components/card-comps/progress-flow-card";

export default {
  name: "layoutOnboarding",

  components: {
    ProgressFlowCard,
    welcomeModal: () =>
      import(
        /* webpackChunkName: "onboarding-module" */ "@/modules/dashboard/modals/welcome-modal"
      ),
  },

  computed: {
    ...mapGetters({ getOnboardingData: "general/getOnboardingData" }),

    getComputedPageFlow() {
      return this.page_flows;
    },
  },

  watch: {
    $route: {
      handler(route) {
        // CHECK IF A USER HAS COMPLETED CURRENT ROUTE
        let { completed_routes } = this.getOnboardingData;
        const has_completed_current_onboarding = completed_routes.includes(
          route.name
        );

        if (has_completed_current_onboarding) {
          this.$router
            .push({
              name: this.page_flows[completed_routes.length].route,
            })
            .catch((error) => {
              if (error.name != "NavigationDuplicated") throw error;
            });
        }
      },
      immediate: true,
    },

    getOnboardingData: {
      handler() {
        // this.validateUserOnboarding();
      },
    },
  },

  data: () => ({
    computed_page_flow: [],
    show_welcome_dialog: true,

    default_onboarding_state: {
      is_completed: false,
      completed_routes: [],
    },

    page_flows: [
      {
        id: 1,
        title: "Business Information",
        route: "VesicashBusinessInfoOnboarding",
        alias_route: "",
        state: "current",
      },
      {
        id: 2,
        title: "Business verification",
        route: "VesicashBusinessOnboarding",
        alias_route: "",
        state: "next",
      },
      {
        id: 3,
        title: "Identity verification",
        route: "VesicashIdentityOnboarding",
        alias_route: "",
        state: "next",
      },
      {
        id: 4,
        title: "MoR deployment",
        route: "VesicashMoROnboarding",
        alias_route: "",
        state: "next",
      },
    ],
  }),

  mounted() {
    this.fetchUserState();
  },

  methods: {
    ...mapActions({
      saveUserProfile: "settings/saveUserProfile",
      updateMerchantState: "general/updateMerchantState",
      updateOnboardingState: "general/updateOnboardingState",
    }),

    toggleWelcomeDialog() {
      this.show_welcome_dialog = !this.show_welcome_dialog;
    },

    validateUserOnboarding() {
      let { is_completed, completed_routes } = this.getOnboardingData;

      if (
        this.$route.name === "VesicashBusinessInfoOnboarding" &&
        !completed_routes.length
      )
        this.toggleWelcomeDialog();

      if (is_completed) location.href = "/dashboard";
    },

    async fetchUserState() {
      const response = await this.handleDataRequest({
        action: "saveUserProfile",
        payload: {},
        alert_handler: {
          request_error: "User profile not found",
          not_found_error: "User profile not found",
        },
      });

      if (response.code === 200) {
        let user_extra_data = response.data.user?.extra_data;

        // EXTRACT COMPLETED STATE AND COMPLETED ROUTES
        let { is_completed, completed_routes } =
          user_extra_data?.onboarding ?? this.default_onboarding_state;

        // UPDATE AND PERSIST ONBOARDING AND MERCHANT DATA IN STORE
        this.updateOnboardingState({ is_completed, completed_routes });
        this.updateMerchantState(user_extra_data?.merchant ?? true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title-text {
  @include breakpoint-down(sm) {
    font-size: toRem(22);
  }

  @include breakpoint-down(xs) {
    font-size: toRem(20);
  }
}
</style>
