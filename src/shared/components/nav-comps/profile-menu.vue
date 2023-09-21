<template>
  <div>
    <div class="profile-menu-wrapper onboarding-view" v-if="onboarding_view">
      <div class="onboarding-item" @click="$emit('exit')">
        <ExitIcon profileMenu />
        <span class="red-600 tertiary-1-text">Logout</span>
      </div>
    </div>

    <div
      v-else
      class="profile-menu-wrapper"
      :class="show_profile_menu ? 'tour-index' : null"
    >
      <div class="user-icon-wrapper">
        <UserIcon profileMenu />
      </div>

      <div>
        <div class="grey-900 primary-2-text mgb-4">
          {{ getUser.business_name || getUser.fullname || getUser.email }}
        </div>

        <div class="tertiary-3-text green-500">ID: {{ getAccountId }}</div>
      </div>

      <div class="menu-icon-wrapper pdl-5">
        <span class="icon icon-ellipsis-h" @click="toggleMenu"></span>

        <div
          class="profile-menu-block smooth-transition"
          v-if="show_menu"
          v-on-clickaway="toggleMenu"
        >
          <div
            class="profile-menu-item border-bottom-grey-100"
            @click="copyMerchantID"
          >
            <CopyIcon />
            <span class="tertiary-2-text grey-900" v-if="copied"
              >ID Copied!</span
            >
            <span class="tertiary-2-text grey-900" v-else>Copy Account ID</span>
          </div>

          <div class="profile-menu-item" @click="$emit('exit')">
            <ExitIcon profileMenu />
            <span class="red-600 tertiary-2-text">Logout</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserIcon from "@/shared/components/icon-comps/user-icon";
import ExitIcon from "@/shared/components/icon-comps/exit-icon";
import CopyIcon from "@/shared/components/icon-comps/copy-icon";

export default {
  name: "ProfileMenu",

  components: {
    UserIcon,
    CopyIcon,
    ExitIcon,
  },

  props: {
    onboarding_view: {
      type: Boolean,
    },
  },

  computed: {
    ...mapGetters({ getTourData: "general/getTourData" }),
  },

  watch: {
    "getTourData.count": {
      handler(value) {
        this.show_profile_menu = false;

        if (value === 8) {
          setTimeout(() => (this.show_profile_menu = true), 300);
        }
      },
      immediate: true,
    },
  },

  data() {
    return {
      show_profile_menu: false,
      show_menu: false,
      copied: false,
    };
  },

  methods: {
    toggleMenu() {
      this.show_menu = !this.show_menu;
    },

    async copyMerchantID() {
      await navigator.clipboard.writeText(this.getAccountId);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-menu-wrapper {
  position: relative;
  @include flex-row-nowrap("flex-start", "center");
  gap: 0 toRem(16);
  background: getColor("neutral-10");
  padding: toRem(8);
  border-radius: toRem(8);
  cursor: pointer;
  z-index: 999;

  .user-icon-wrapper {
    @include draw-shape(40);
    @include flex-column("center", "center");
    border: toRem(0.715) solid getColor("teal-200");
    border-radius: toRem(8.57);
    background: getColor("teal-50");
  }

  .menu-icon-wrapper {
    position: absolute;
    left: calc(100% - 30px);
    cursor: pointer;
    z-index: 1000;

    .icon-ellipsis-h {
      position: absolute;
      top: toRem(-8);
      transform: rotate(90deg);
    }

    .profile-menu-block {
      filter: drop-shadow(1px -1px 3px rgba(184, 194, 192, 0.2))
        drop-shadow(-1px 1px 3px rgba(184, 194, 192, 0.2));
      position: absolute;
      min-width: toRem(200);
      top: toRem(-35);
      left: calc(100% + 30px);
      transform: translate(-100%, -100%);
      border-radius: toRem(8);
      background: getColor("neutral-10");
      z-index: 1000;
      animation: panel-slide-up 0.4s ease-in-out;

      .profile-menu-item {
        @include flex-row-nowrap("flex-start", "center");
        background: getColor("neutral-10");
        padding: toRem(12) toRem(12);
        @include transition(0.3s);
        gap: 0 toRem(16);
        cursor: pointer;
        z-index: 1000;

        &:hover {
          background: getColor("green-50");
        }

        &:first-of-type {
          border-radius: toRem(8) toRem(8) 0 0;
        }

        &:last-of-type {
          border-radius: 0 0 toRem(8) toRem(8);
        }
      }
    }
  }
}

.tour-index {
  @include transition(0.3s);
  z-index: 1099;
}

.onboarding-view {
  position: relative;
  margin-top: toRem(-20);
  padding: toRem(12) toRem(10);

  .onboarding-item {
    @include flex-row-nowrap("flex-start", "center");
    gap: 0 toRem(16);

    svg {
      width: toRem(30);
      height: auto;
    }

    span {
      font-size: toRem(15);
    }
  }
}
</style>
