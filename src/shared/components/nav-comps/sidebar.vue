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
      <SidebarItem
        v-for="(nav, index) in sidebar_routes"
        :key="index"
        :nav="nav"
      />
    </div>

    <div class="fixed-sidebar" v-if="!isMoRSetupEnabled">
      <SidebarItem is_active :nav="merchant_of_record" />
    </div>

    <!-- LOG OUT ACCOUNT SECTION -->
    <div class="wrapper position-absolute wt-100">
      <ProfileMenu @exit="handleUserlogOut" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MoRDocValidate from "@/modules/merchant-of-records/modules/config/mixins/mor-docs-mixin";
import { escrowRoutes, merchantRoutes } from "@/shared/nav-routes";
import VesicashBrandLogo from "@/shared/components/icon-comps/vesicash-brand-logo";
import ExitIcon from "@/shared/components/icon-comps/exit-icon";
import SidebarItem from "@/shared/components/nav-comps/sidebar-item";
import ProfileMenu from "@/shared/components/nav-comps/profile-menu";

export default {
  name: "SidebarComp",

  mixins: [MoRDocValidate],

  components: {
    VesicashBrandLogo,
    SidebarItem,
    ExitIcon,
    ProfileMenu,
  },

  data() {
    return {
      sidebar_routes: "",
      merchant_of_record: {
        id: 5,
        title: "Merchant of Record",
        icon: "MORIcon",
        link: "/merchant/introduction",
        slug: "mor",
        tour_id: [],
        tag: true,
      },
    };
  },

  mounted() {
    this.sidebar_routes = this.isMoRSetupEnabled
      ? merchantRoutes
      : escrowRoutes;

    this.checkMoRVerficationState();

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
      setTimeout(() => this.logOutUser(), 2000);
    },

    checkMoRVerficationState() {
      let has_seen_mor_intro = this.getUser.has_seen_mor_introduction;

      if (has_seen_mor_intro) {
        // CHECK VERIFICATION UPGRADE
        if (this.validateMoRVerification) {
          this.merchant_of_record.link = "/settings/mor-setup";
        } else {
          this.merchant_of_record.link = "/merchant/document-upgrade";
        }
      } else {
        this.merchant_of_record.link = "/merchant/introduction";
      }
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
    svg {
      width: toRem(146);
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
