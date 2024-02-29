<template>
  <div class="layout-base w-100">
    <!-- SIDEBAR BUILD -->
    <div
      class="sidebar-build"
      :class="show_mobile_sidebar && 'sidebar-build-open'"
      @click="hideSidebar"
    >
      <Sidebar />
    </div>

    <!-- BODY AREA -->
    <div class="body-build position-relative">
      <!-- MOBILE TOP BAR -->
      <MobileTopbar />

      <!-- CONTENT BUILD -->
      <div class="content-build position-relative">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Sidebar from "@/shared/components/nav-comps/sidebar";
import MobileTopbar from "@/shared/components/nav-comps/mobile-topbar";

export default {
  name: "LayoutBase",

  components: {
    Sidebar,
    MobileTopbar,
  },

  computed: {
    ...mapGetters({ getOnboardingData: "general/getOnboardingData" }),
  },

  watch: {
    $route: {
      handler(route) {
        // let { is_completed, completed_routes } = this.getOnboardingData;
        // let is_onbording_route = this.onboarding_paths.includes(route.path);
        // if (is_completed && is_onbording_route) {
        //   this.$router.push("/dashboard");
        // } else if (!is_completed && !is_onbording_route) {
        //   this.fetchUserExtraData();
        //   this.$router.push(this.onboarding_paths[completed_routes.length]);
        // }
      },
      immediate: true,
      deep: true,
    },

    getUser: {
      handler(user) {
        this.checkOnboardingState(user);
      },
      immediate: true,
      deep: true,
    },
  },

  data: () => ({
    show_mobile_sidebar: false,

    onboarding_paths: [
      "/onboarding/business-information",
      "/onboarding/business-verification",
      "/onboarding/identity-verification",
      "/onboarding/mor-deployment",
    ],
  }),

  created() {
    this.$bus.$on("show-sidebar", () => (this.show_mobile_sidebar = true));

    this.$bus.$on("close-sidebar", () => {
      if (this.show_mobile_sidebar) this.show_mobile_sidebar = false;
    });
  },

  mounted() {
    this.$utils.setPageBackgroundColor("#ffffff");
  },

  methods: {
    ...mapActions({
      saveUserProfile: "settings/saveUserProfile",
      updateMerchantState: "general/updateMerchantState",
      updateOnboardingState: "general/updateOnboardingState",
    }),

    checkOnboardingState(user) {
      const onboarding_fields = [
        "business_name",
        "business_type",
        "business_country",
      ];

      const is_onboarded = onboarding_fields.every((field) => !!user[field]);

      const ONBOARDING_ROUTE_NAME = "VesicashBusinessDetailsOnboarding";

      const route_name = this.$route?.name;

      if (!is_onboarded && route_name != ONBOARDING_ROUTE_NAME)
        this.$router.push("/onboarding/business-details");
    },

    hideSidebar($event) {
      if ($event.target.classList.contains("sidebar-build-open"))
        this.show_mobile_sidebar = !this.show_mobile_sidebar;
    },

    async fetchUserExtraData() {
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
          user_extra_data?.onboarding ?? {};

        // UPDATE AND PERSIST ONBOARDING DATAAND MERCHANT IN STORE
        this.updateOnboardingState({ is_completed, completed_routes });
        this.updateMerchantState(user_extra_data?.merchant ?? false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-base {
  @include flex-row-nowrap("space-between", "flex-start");

  .sidebar-build {
    width: 19%;
    height: 100vh;
    top: 0;
    left: 0;

    @include breakpoint-down(xl) {
      width: 22%;
    }

    @include breakpoint-down(lg) {
      @include fixed-display-area;
      transition: left 0.3s ease-in;
      left: -100%;
      width: 0;
    }

    &-open {
      @include breakpoint-down(lg) {
        background: linear-gradient(
          180deg,
          rgba(1, 26, 39, 0.28) 4.69%,
          rgba(1, 26, 39, 0.25) 56.25%,
          rgba(1, 26, 39, 0.37) 100%
        );
        z-index: 99;
        width: 100%;
        left: 0;
      }
    }
  }

  .body-build {
    @include stretch-area;
    height: 100vh;
    width: 81%;
    overflow: auto;

    @include breakpoint-down(xl) {
      width: 78%;
    }

    @include breakpoint-down(lg) {
      width: 100%;
    }

    .content-build {
      padding: toRem(40) toRem(32) 0;

      @include breakpoint-down(lg) {
        padding: toRem(32) toRem(24) 0;
        top: toRem(56);
      }

      @include breakpoint-down(sm) {
        padding: toRem(32) toRem(16) 0;
      }

      @include breakpoint-down(xs) {
        padding: toRem(32) toRem(13) 0;
      }
    }
  }
}
</style>
