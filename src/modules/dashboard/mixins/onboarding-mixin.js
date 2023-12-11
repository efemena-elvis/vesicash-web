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
      next_onboarding_route = "",
      is_completed = false
    ) {
      const response = await this.handleDataRequest({
        action: "saveUserProfile",
        payload: this.getOnboardingPayload(is_completed),
        show_alert: false,
      });

      if (response.code === 200) {
        this.updateOnboardingState({
          is_completed,
          completed_routes: this.getCompletedRoutes,
        });

        if (this.$route.name === "VesicashIdentityOnboarding")
          this.updateMerchantState(false);

        if (next_onboarding_route?.length) {
          this.$router.push({ name: next_onboarding_route });
        } else this.toggleCongratDialog();
      }
    },

    getOnboardingPayload(is_completed) {
      const current_route = this.$route.name;

      if (current_route === "VesicashIdentityOnboarding") {
        return {
          extra_data: {
            onboarding: {
              is_completed,
              completed_routes: this.getCompletedRoutes,
            },
            merchant: false,
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
