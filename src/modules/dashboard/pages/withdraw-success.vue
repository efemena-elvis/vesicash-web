<template>
  <AuthWrapper title_text>
    <!-- AUTH PAGE -->
    <div class="auth-page auth-page-success">
      <WarningIcon v-if="type === 'pending'" />
      <SuccessIcon backgroundColor="#043B56" v-else />

      <!-- TITLE TEXT -->
      <div class="title-text primary-1-text neutral-100 mgb-8 text-center">
        {{ getTitle }}
      </div>

      <!-- DESCRIPTION TEXT -->
      <div
        class="description-text tertiary-2-text grey-400 text-center"
        v-html="getDescription"
      ></div>

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
import SuccessIcon from "@/shared/components/icon-comps/success-icon";
import WarningIcon from "@/shared/components/icon-comps/warning-icon";

export default {
  name: "WithdrawSuccessful",

  metaInfo: {
    title: "Fund Withdrawal",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    AuthWrapper,
    SuccessIcon,
    WarningIcon,
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

    getTitle() {
      return this.type === "pending"
        ? "Confirming your request"
        : "Congratulations";
    },

    getDescription() {
      return this.type === "pending"
        ? `Please wait while we confirm your withdrawal request of <span class=fw-bold>${this.getFormattedAmount}</span>, your account manager would reach out shortly.`
        : `Your withdrawal of
       <span class=fw-bold>${this.getFormattedAmount}</span> has been sent to
        your bank account, Please check your bank account for details`;
    },
  },

  data() {
    return {
      type: "",
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
      this.type = type;
      this.amount = amount;
      this.currency = currency;
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-page-success {
  @include flex-column("center", "center");
  margin-top: toRem(70);

  svg {
    @include draw-shape(120);
    margin-bottom: toRem(24);

    @include breakpoint-down(xs) {
      @include draw-shape(115);
    }
  }

  .description-text {
    @include breakpoint-down(xs) {
      font-size: toRem(13.75);
    }
  }
}
</style>
