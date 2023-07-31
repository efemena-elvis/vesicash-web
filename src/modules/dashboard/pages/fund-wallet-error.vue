<template>
  <AuthWrapper title_text="">
    <!-- AUTH PAGE -->
    <div class="auth-page auth-page-success">
      <ErrorIcon />

      <!-- TITLE TEXT -->
      <div class="title-text primary-1-text grey-900 mgb-8 text-center">
        Funding unsucessful!
      </div>

      <!-- DESCRIPTION TEXT -->
      <div class="description-text tertiary-2-text grey-600 text-center">
        Your wallet funding of
        <span class="fw-bold"> {{ getFormattedAmount }}</span> was not
        successful, please try again.
      </div>

      <!-- BUTTON AREA -->
      <div class="btn-area mgt-30 mgb-10 wt-100">
        <router-link to="/dashboard" class="btn btn-primary btn-md wt-100"
          >Go to Dashboard</router-link
        >
      </div>
    </div>
  </AuthWrapper>
</template>

<script>
import AuthWrapper from "@/modules/auth/components/auth-wrapper";
import ErrorIcon from "@/shared/components/icon-comps/error-icon";

export default {
  name: "FundWalletError",

  metaInfo: {
    title: "Wallet Funding failed",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    AuthWrapper,
    ErrorIcon,
  },

  computed: {
    getFormattedAmount() {
      const currency_sign = this.$utils.formatCurrency({
        input: this.currency,
        output: "sign",
      });

      const amount = this.$utils.formatCurrencyWithComma(this.amount);

      return `${currency_sign}${amount}`;
    },
  },

  data() {
    return {
      amount: "",
      currency: "",
    };
  },

  mounted() {
    this.getRouteData();
  },

  methods: {
    getRouteData() {
      const { amount, currency } = this.$route.query;
      this.amount = amount;
      this.currency = currency;
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-page-success {
  @include flex-column("center", "center");

  svg {
    @include draw-shape(120);
    margin-bottom: toRem(24);

    @include breakpoint-down(xs) {
      @include draw-shape(115);
    }
  }

  .description-text {
    @include font-height(14, 22);
    padding: 0 toRem(15);

    @include breakpoint-down(xs) {
      font-size: toRem(13.75);
      padding: 0;
    }
  }
}
</style>
