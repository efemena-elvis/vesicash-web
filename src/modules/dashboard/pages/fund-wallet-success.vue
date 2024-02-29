<template>
  <AuthWrapper title_text>
    <!-- AUTH PAGE -->
    <div class="auth-page auth-page-success">
      <WarningIcon v-if="funding_type === 'transfer'" />
      <SuccessIcon backgroundColor="#043B56" v-else />

      <!-- TITLE TEXT -->
      <div class="h4-text grey-800 mgb-10 text-center">
        {{ getTitle }}
      </div>

      <!-- DESCRIPTION TEXT -->
      <div
        class="description-text grey-600 text-center"
        v-html="getDescription"
      ></div>

      <!-- BUTTON AREA -->
      <div class="btn-area mgt-30 wt-100">
        <button
          @click="handleGoToDashboard"
          class="btn btn-primary btn-md wt-100"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  </AuthWrapper>
</template>

<script>
import AuthWrapper from "@/modules/auth/components/auth-wrapper";
import SuccessIcon from "@/shared/components/icon-comps/success-icon";
import WarningIcon from "@/shared/components/icon-comps/warning-icon";

export default {
  name: "FundWalletSuccess",

  metaInfo: {
    title: "Wallet Funded Successfully",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    AuthWrapper,
    SuccessIcon,
    WarningIcon,
  },

  computed: {
    getTitle() {
      return this.funding_type === "transfer"
        ? "Confirming your payment"
        : "Payment confirmed";
    },

    getFormattedAmount() {
      const currency_sign = this.$utils.formatCurrency({
        input: this.currency,
        output: "sign",
      });

      const amount = this.$utils.formatCurrencyWithComma(this.amount);

      return `${currency_sign}${amount}`;
    },

    getDescription() {
      return this.funding_type === "transfer"
        ? `Please wait while we confirm your payment of <span class=fw-bold>${this.getFormattedAmount}</span>, if your payment is sucessful, it will reflect on your dashboard`
        : `Your card funding of <span class=fw-bold>${this.getFormattedAmount}</span> has been confirmed, your funds should reflect on your wallet soon`;
    },
  },

  data() {
    return {
      funding_type: "",
      amount: "",
      currency: "",
    };
  },

  mounted() {
    this.getRouteData();
  },

  methods: {
    getRouteData() {
      const { type, amount, currency } = this.$route.query;
      this.funding_type = type;
      this.amount = amount;
      this.currency = currency;
    },

    // ===============================
    // HANDLE DASHBOARD REDIRECT
    // ===============================
    handleGoToDashboard() {
      this.$router.push("/dashboard");
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
    width: 90%;

    @include breakpoint-down(xs) {
      @include font-height(14, 21);
    }
  }
}
</style>
