<template>
  <router-link
    :to="nav.link"
    class="d-block mgb-10"
    @click="$emit('isClicked')"
  >
    <div
      class="sidebar-item smooth-transition rounded-8 position-relative"
      :class="[
        isActive && 'sidebar-item-active',
        ongoingTour && nav.tour_id.includes(getTourData.count) && 'tour-index',
      ]"
    >
      <!-- ACTIVE SIDE TAG -->
      <div
        class="active-side-tag position-absolute green-600-bg h-100"
        v-if="is_active"
      ></div>

      <!-- ICON COMPONENT -->
      <component :is="nav.icon" />

      <!-- NAV TEXT -->
      <div class="nav-text secondary-2-text grey-600 smooth-transition">
        {{ nav.title }}
      </div>

      <div
        class="item-tag rounded-circle position-relative pulse-animate"
        v-if="nav.tag"
      ></div>
    </div>
  </router-link>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SidebarItem",

  components: {
    DashboardIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/dashboard-icon"
      ),
    PaymentIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/payment-icon"
      ),
    TransactionIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/transaction-icon"
      ),
    ExchangeIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/exchange-icon"
      ),
    FundIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/fund-icon"
      ),
    TaxIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/tax-icon"
      ),
    ChartIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/chart-icon"
      ),
    CustomerIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/customer-icon"
      ),
    DeveloperIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/developer-icon"
      ),
    SettingsIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/settings-icon"
      ),
    MORIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/mor-icon"
      ),
  },

  props: {
    nav: {
      type: Object,
      default: () => ({
        title: "Dashboard",
        icon: "DashboardIcon",
        link: "/dashboard",
      }),
    },

    is_active: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({ getTourData: "general/getTourData" }),

    isActive() {
      return this.is_active || this.path_list.includes(this.nav.slug)
        ? true
        : false;
    },

    ongoingTour() {
      const { count, ongoing } = this.getTourData;

      if (ongoing) return [1, 5, 6, 7].includes(count) ? true : false;
      else return false;
    },
  },

  watch: {
    $route: {
      handler(value) {
        this.path_list = value.path.split("/");
      },
      immediate: true,
    },
  },

  data: () => ({
    path_list: [],
  }),
};
</script>

<style lang="scss">
%active-side-bar-state {
  background: getColor("neutral-10");

  .nav-text {
    color: getColor("teal-800");
  }

  svg {
    .light-theme {
      fill: getColor("teal-200") !important;
    }

    .dark-theme {
      fill: getColor("teal-800") !important;
    }
  }
}

.sidebar-item {
  @include flex-row-nowrap("flex-start", "center");
  padding: toRem(8);

  &:last-of-type {
    margin-bottom: 0;
  }

  .active-side-tag {
    border-radius: toRem(8) 0 0 toRem(8);
    width: toRem(3);
    top: 0;
    left: 0;
  }

  svg {
    margin-right: toRem(16);
    @include draw-shape(30);

    .light-theme {
      @include transition(0.325s);
      fill: getColor("grey-300");
    }

    .dark-theme {
      @include transition(0.325s);
      fill: getColor("grey-500");
    }
  }

  &:hover {
    @extend %active-side-bar-state;
  }

  &-active {
    @extend %active-side-bar-state;
  }

  .item-tag {
    @include draw-shape(12);
    box-shadow: 0 0 toRem(1) toRem(1) #0000001a;
    animation: pulse-animation 1.8s infinite;
    background: getColor("green-500");
    margin-left: auto;
    margin-right: toRem(2.5);
  }
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(getColor("green-500"), 0.45);
  }

  100% {
    box-shadow: 0 0 0 toRem(10) rgba(getColor("green-500"), 0);
  }
}

.tour-index {
  @include transition(0.7s);
  z-index: 1099;
}
</style>
