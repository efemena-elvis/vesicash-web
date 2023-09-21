<template>
  <div class="sidebar teal-50-bg">
    <!-- BRAND LOGO -->
    <router-link
      :to="{ name: 'VesicashDashboard' }"
      class="brand-logo mgb-40 d-block"
    >
      <VesicashBrandLogo />
    </router-link>

    <!-- SIDE NAV ITEMS -->
    <div
      :class="
        isMoRSetupEnabled
          ? 'sidebar-item-list sidebar-item-list__long'
          : 'sidebar-item-list'
      "
    >
      <component
        :is="sidebar_view"
        v-for="(nav, index) in getSidebarRoutes"
        :key="index"
        :nav="nav"
        :onboarding_state="getOnboardingRouteState[index]"
      />
    </div>

    <!-- LOG OUT ACCOUNT SECTION -->
    <div class="wrapper position-absolute wt-100">
      <ProfileMenu
        @exit="handleUserlogOut"
        :onboarding_view="isBaseView ? false : true"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MoRDocValidate from "@/modules/merchant-of-records/modules/config/mixins/mor-docs-mixin";
import {
  escrowRoutes,
  merchantRoutes,
  onboardingRoutes,
} from "@/shared/nav-routes";
import VesicashBrandLogo from "@/shared/components/icon-comps/vesicash-brand-logo";
import ExitIcon from "@/shared/components/icon-comps/exit-icon";
import SidebarItem from "@/shared/components/nav-comps/sidebar-item";
import SidebarItemCount from "@/shared/components/nav-comps/sidebar-item-count";
import ProfileMenu from "@/shared/components/nav-comps/profile-menu";

export default {
  name: "SidebarComp",

  mixins: [MoRDocValidate],

  components: {
    VesicashBrandLogo,
    SidebarItem,
    SidebarItemCount,
    ExitIcon,
    ProfileMenu,
  },

  computed: {
    isBaseView() {
      return this.base_view ? true : false;
    },

    getSidebarRoutes() {
      if (!this.base_view) {
        this.sidebar_view = "SidebarItemCount";
        return onboardingRoutes;
      } else {
        this.sidebar_view = "SidebarItem";
        return this.isMoRSetupEnabled ? merchantRoutes : escrowRoutes;
      }
    },

    getOnboardingRouteState() {
      return this.onboarding_route_state;
    },
  },

  data() {
    return {
      base_view: true,
      sidebar_view: "SidebarItem",

      onboarding_route_state: [
        {
          route: "VesicashBusinessInfoOnboarding",
          disabled: false,
        },
        {
          route: "VesicashBusinessOnboarding",
          disabled: true,
        },
        {
          route: "VesicashIdentityOnboarding",
          disabled: true,
        },
        {
          route: "VesicashMoROnboarding",
          disabled: true,
        },
      ],
    };
  },

  watch: {
    $route: {
      handler(route) {
        this.base_view = route.meta?.page_type === "onboarding" ? false : true;

        if (!this.base_view) {
          if (route.name === "VesicashBusinessOnboarding") {
            this.onbording_route_state = [];
          }
        }
      },
      immediate: true,
    },
  },

  mounted() {
    if (this.getAccountType === "business" && !this.isMoRSetupEnabled) {
      this.fetchVerifications();
    }
  },

  methods: {
    ...mapActions({
      logOutUser: "auth/logOutUser",
    }),

    handleUserlogOut() {
      this.togglePageLoader();
      this.logOutUser();
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  padding: toRem(22) toRem(16);
  @include stretch-area;
  position: relative;

  @include breakpoint-down(lg) {
    width: 60%;
  }

  @include breakpoint-down(sm) {
    width: 65%;
  }

  @include breakpoint-down(xs) {
    width: 75%;
  }

  .sidebar-item-list {
    max-height: 65vh !important;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 5px;
      background-color: getColor("grey-300");
    }

    &::-webkit-scrollbar-thumb {
      background-color: getColor("grey-400");
    }
  }

  .sidebar-item-list__long {
    max-height: 85vh !important;
  }

  .brand-logo {
    margin-top: toRem(6);

    svg {
      width: toRem(150);
      height: auto;
    }
  }

  .fixed-sidebar {
    margin-top: toRem(10);
  }

  .wrapper {
    padding: 0 toRem(16);
    bottom: toRem(14);
    left: 0;

    .log-out-section {
      @include flex-row-nowrap("flex-start", "center");
      position: relative;
      padding: toRem(8);

      svg {
        margin-right: toRem(16);
      }

      &:hover {
        background: getColor("neutral-10");
      }
    }
  }
}
</style>
