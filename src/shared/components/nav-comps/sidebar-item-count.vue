<template>
  <div class="d-block mgb-14">
    <div
      class="sidebar-item smooth-transition rounded-8 position-relative"
      :class="[isDisabled && !isCompleted ? 'sidebar-item-disabled' : '']"
    >
      <div class="count-wrapper">
        <SuccessIcon v-if="isCompleted" />
        <div v-else class="count primary-3-text">{{ nav.id }}</div>
      </div>

      <!-- NAV TEXT -->
      <div class="nav-text secondary-2-text grey-600 smooth-transition">
        {{ nav.title }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SuccessIcon from "@/shared/components/icon-comps/success-icon";

export default {
  name: "SidebarItemCount",

  components: {
    SuccessIcon,
  },

  props: {
    nav: {
      type: Object,
      default: () => ({
        title: "Dashboard",
        icon: "CheckIcon",
        link: "/dashboard",
      }),
    },

    onboarding_state: {
      type: Object,
    },

    is_active: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({ getOnboardingData: "general/getOnboardingData" }),

    isDisabled() {
      return this.onboarding_state?.disabled ? true : false;
    },

    isCompleted() {
      let { completed_routes } = this.getOnboardingData;
      return completed_routes.includes(this.onboarding_state.route)
        ? true
        : false;
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

<style lang="scss" scoped>
.sidebar-item {
  @include flex-row-nowrap("flex-start", "center");
  background: getColor("neutral-10");
  padding: toRem(8);
  gap: toRem(8);

  &:last-of-type {
    margin-bottom: 0;
  }

  .count-wrapper {
    background: lighten(getColor("green-100"), 4%);
    @include draw-shape(30);
    position: relative;
    border-radius: 50%;

    .count {
      color: getColor("green-600");
      @include center-placement;
    }

    svg {
      @include center-placement;
      @include draw-shape(24);
    }
  }

  .nav-text {
    color: getColor("teal-800");
  }

  &-disabled {
    pointer-events: none;
    cursor: not-allowed;
    background: unset;

    .count-wrapper {
      background: lighten(getColor("green-50"), 4%);

      .count {
        color: getColor("green-300");
      }
    }

    .nav-text {
      color: getColor("grey-400");
    }
  }
}
</style>
