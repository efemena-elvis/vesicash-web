<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>

    <!-- ALERT BANNER -->
    <AlertBanner
      v-if="show_alert"
      :message="alert.message"
      :status="alert.status"
    />

    <!-- FEATHER PAGE LOADER -->
    <transition name="fade" v-if="show_feather_loader">
      <PageLoader :message="feather_loader_msg" />
    </transition>

    <!-- VESICASH MODAL PORTAL TARGET -->
    <portal-target name="vesicash-modals"></portal-target>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "App",

  metaInfo: {
    title: "Escrow Payment service Nigeria Africa",
    titleTemplate: "Vesicash | %s",
    htmlAttrs: {
      lang: "en",
      amp: true,
    },
  },

  components: {
    PageLoader: () =>
      import(
        /* webpackChunkName: "app-module" */ "@/shared/components/util-comps/page-loader"
      ),

    AlertBanner: () =>
      import(
        /* webpackChunkName: "app-module" */ "@/shared/components/util-comps/alert-banner"
      ),
  },

  watch: {
    $route: {
      handler() {
        this.show_feather_loader = false;
      },
    },
  },

  data: () => ({
    show_feather_loader: false,
    feather_loader_msg: "",

    show_alert: false,
    alert: {
      status: "success",
      message: "Alert message here...",
    },
  }),

  created() {
    // EVENT BUS TO TOGGLE PAGE LOADER
    this.$bus.$on("toggle-page-loader", (message = "") => {
      this.show_feather_loader = !this.show_feather_loader;
      this.feather_loader_msg = message;
    });

    this.$bus.$on("show-page-loader", (message) => {
      this.show_feather_loader = true;
      this.feather_loader_msg = message;
    });

    this.$bus.$on("hide-page-loader", () => {
      this.show_feather_loader = false;
      this.feather_loader_msg = "";
    });

    // EVENT BUS TO TOGGLE ALERT BANNER
    this.$bus.$on("toggle-alert-banner", (data) => this.toggleAlert(data));

    // CHECK IF USER EMAIL NEEDS VALIDATION
    this.checkIfEmailIsVerified();
  },

  methods: {
    ...mapActions({
      verifyEmailOTP: "settings/verifyEmailOTP",
    }),

    toggleAlert(data) {
      this.alert = data;
      this.show_alert = !this.show_alert;
    },

    async checkIfEmailIsVerified() {
      const saved_token = this.$storage.getStorage({
        storage_name: "validate_user_email",
      });

      if (saved_token) {
        await this.handleDataRequest({
          action: "verifyEmailOTP",
          payload: { account_id: this.getAccountId, code: saved_token },
        });

        this.$storage.removeStorage("validate_user_email");
      }
    },
  },
};
</script>

<style lang="scss">
*,
html,
body {
  scroll-behavior: smooth !important;
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.2s ease;
}
.fade-leave-active {
  transition: opacity 0.2s ease;
  opacity: 0;
}
</style>
