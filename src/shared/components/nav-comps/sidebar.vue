<template>
  <div class="sidebar teal-50-bg">
    <!-- BRAND LOGO -->
    <router-link
      :to="{ name: 'VesicashDashboard' }"
      class="brand-logo d-block"
      v-if="show_items"
    >
      <VesicashBrandLogo />
    </router-link>

    <div class="brand-logo d-block pointer" v-else @click="handleUserlogOut">
      <VesicashBrandLogo />
    </div>

    <div class="sidebar-wrapper d-flex flex-column justify-content-between">
      <div class="sidebar-content w-100" v-if="show_items">
        <!-- SIDE NAV ITEMS -->
        <div class="sidebar-item-list">
          <SidebarItem
            v-for="(nav, index) in getSidebarRoutes"
            :key="index"
            :nav="nav"
          />
        </div>
      </div>

      <!-- LOG OUT ACCOUNT SECTION -->
      <div class="wrapper wt-100 mt-auto">
        <ProfileMenu @exit="handleUserlogOut" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MoRDocValidate from "@/modules/merchant-of-records/modules/config/mixins/mor-docs-mixin";
import { sidebarRoutes } from "@/shared/nav-routes";
import VesicashBrandLogo from "@/shared/components/icon-comps/vesicash-brand-logo";
import ExitIcon from "@/shared/components/icon-comps/exit-icon";
import SidebarItem from "@/shared/components/nav-comps/sidebar-item";
import ProfileMenu from "@/shared/components/nav-comps/profile-menu";

export default {
  name: "SidebarComp",

  mixins: [MoRDocValidate],

  props: {
    show_items: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    VesicashBrandLogo,
    SidebarItem,
    ExitIcon,
    ProfileMenu,
  },

  computed: {
    getSidebarRoutes() {
      return sidebarRoutes;
    },
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
  border: toRem(1) solid transparent;
  @include stretch-area;
  position: relative;
  height: 100vh;

  @include breakpoint-down(lg) {
    width: 60%;
  }

  @include breakpoint-down(sm) {
    width: 65%;
  }

  @include breakpoint-down(xs) {
    width: 75%;
  }

  .brand-logo {
    padding: toRem(32) toRem(20);
    height: 12%;

    svg {
      width: toRem(150);
      height: auto;
    }
  }

  .sidebar-wrapper {
    height: 85%;
  }

  .sidebar-content {
    overflow: overlay;
    height: 87%;
    margin-bottom: 3%;

    &::-webkit-scrollbar {
      @include transition(0.3s);
      background-color: getColor("grey-200");
      display: none;
      width: 0;
    }

    &::-webkit-scrollbar-thumb {
      background-color: getColor("grey-300");
    }

    &:hover {
      &::-webkit-scrollbar {
        width: toRem(4);
        display: unset;
      }
    }

    .sidebar-item-list {
      padding: 0 toRem(16);
    }
  }

  .fixed-sidebar {
    margin-top: toRem(10);
  }

  .wrapper {
    position: relative;
    padding: 0 toRem(16);
    bottom: 0;
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
