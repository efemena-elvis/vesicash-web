<template>
  <AuthWrapper title_text="">
    <!-- AUTH PAGE -->
    <div class="auth-page auth-page-success">
      <ErrorIcon />

      <!-- TITLE TEXT -->
      <div class="h4-text grey-800 mgb-10 text-center">Funding failed!</div>

      <!-- DESCRIPTION TEXT -->
      <div class="description-text grey-600 text-center">
        Your wallet funding of
        <span class="fw-bold"> {{ getFormattedAmount }}</span> was not
        successful, please try again.
      </div>

      <!-- BUTTON AREA -->
      <div class="btn-area mgt-30 wt-100">
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
  margin-top: toRem(10);

  svg {
    @include draw-shape(115);
    margin-bottom: toRem(24);
  }

  .description-text {
    @include font-height(15, 23);
    padding: 0 toRem(15);

    @include breakpoint-down(xs) {
      @include font-height(14, 21);
      padding: 0;
    }
  }
}
</style>
