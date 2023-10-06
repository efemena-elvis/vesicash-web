import { mapActions } from "vuex";

const OnboardingMixin = {
  computed: {
    getCompletedRoutes() {
      let { completed_routes } = this.getOnboardingState;

      return completed_routes.includes(this.$route.name)
        ? completed_routes
        : [...completed_routes, this.$route.name];
    },
  },

  methods: {
    ...mapActions({
      saveUserProfile: "settings/saveUserProfile",
      updateOnboardingState: "general/updateOnboardingState",
      updateMerchantState: "general/updateMerchantState",
    }),

    // UPDATE ONBOARDING UPDATE AND REDIRECT
    async handleOnboardingUpdate(
      next_onboarding_route = null,
      is_completed = false,
      skip_mor = false
    ) {
      const response = await this.handleDataRequest({
        action: "saveUserProfile",
        payload: this.getOnboardingPayload(is_completed, skip_mor),
        alert_handler: {
          request_error: "User profile not found",
          not_found_error: "User profile not found",
        },
      });

      if (response.code === 200) {
        this.updateOnboardingState({
          is_completed,
          completed_routes: this.getCompletedRoutes,
        });

        if (!skip_mor && this.$route.name === "VesicashMoROnboarding")
          this.updateMerchantState(true);
        else this.updateMerchantState(false);

        if (next_onboarding_route) {
          this.$router.push({ name: next_onboarding_route });
        } else this.toggleCongratDialog();
      }
    },

    getOnboardingPayload(is_completed, skip_mor) {
      const current_route = this.$route.name;

      if (current_route === "VesicashMoROnboarding" && !skip_mor) {
        return {
          extra_data: {
            onboarding: {
              is_completed,
              completed_routes: this.getCompletedRoutes,
            },
            merchant: true,
          },
        };
      } else {
        return {
          extra_data: {
            onboarding: {
              is_completed,
              completed_routes: this.getCompletedRoutes,
            },
            merchant: false,
          },
        };
      }
    },
  },
};

export default OnboardingMixin;
