<template>
  <div class="layout-base w-100">
    <!-- SIDEBAR BUILD -->
    <div
      class="sidebar-build"
      :class="show_mobile_sidebar && 'sidebar-build-open'"
      @click="hideSidebar"
    >
      <Sidebar :show_items="showSideBar" />
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

    showSideBar() {
      return this.$route?.name !== "VesicashBusinessDetailsOnboarding";
    },
  },

  watch: {
    $route: {
      handler() {
        this.fetchUserExtraData();
      },
      immediate: true,
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
      const onboarding_fields = ["business_type"];
      const verification_fields = ["cac"];

      const is_onboarded =
        onboarding_fields.every((field) => !!user[field]) &&
        verification_fields.every((field) => user.verifications[field]);

      const ONBOARDING_ROUTE_NAME = "VesicashBusinessDetailsOnboarding";

      const route_name = this.$route?.name;

      // if (!is_onboarded && route_name != ONBOARDING_ROUTE_NAME)
      //   this.$router.push("/onboarding/business-details");
      // if (is_onboarded && route_name === ONBOARDING_ROUTE_NAME)
      //   this.$router.push("/dashboard");
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

        // UPDATE AND PERSIST MERCHANT IN STORE
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
      padding: toRem(32) toRem(32) 0;

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
