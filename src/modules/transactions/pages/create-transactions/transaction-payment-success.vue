<template>
  <div>
    <AuthWrapper title_text v-if="payment_confirmed">
      <!-- AUTH PAGE -->
      <div class="auth-page auth-payment-success">
        <!-- TITLE TEXT -->
        <div class="title-text text-center teal-900 h4-text mgb-28 mgt-5">
          Congratulations
        </div>

        <!-- BODY DATA -->
        <div class="body-data">
          <template v-if="$route.query.type === 'funding'">
            <SuccessItemCard
              :info="{
                icon: 'SuccessIcon',
                title: 'Funding made successfully',
                description: `Your funding of <b>${getTransactionAmount}</b> has been made sucessfully.`,
              }"
            />
          </template>

          <template v-if="$route.query.type === 'seller_escrow'">
            <SuccessItemCard
              :info="{
                icon: 'SuccessIcon',
                title: `${
                  $route.query.parties === 'All' ? 'Users' : 'User'
                } invited successfully`,
                description: `${$route.query.parties} ${
                  $route.query.parties === 'All' ? 'parties have' : 'has'
                } been invited into the escrow transaction.`,
              }"
            />
          </template>

          <template v-else>
            <SuccessItemCard
              :info="{
                icon: 'SuccessIcon',
                title: 'Payment made successfully',
                description: `Your payment of <b>${getTransactionAmount}</b> has been made sucessfully.`,
              }"
            />

            <SuccessItemCard
              :info="{
                icon: 'SuccessIcon',
                title: 'Users invited successfully',
                description: `${$route.query.parties} ${
                  $route.query.parties === 'All' ? 'parties have' : 'has'
                } been invited into the escrow transaction.`,
              }"
            />
          </template>
        </div>

        <!-- BUTTON AREA -->
        <div class="btn-area mgt-30 mgb-10">
          <!-- <div class="btn btn-secondary btn-md mgb-24">Download Receipt</div> -->

          <a
            class="btn btn-primary btn-md"
            :href="$route.query.redirect"
            v-if="$route.query.redirect"
            >Continue transaction</a
          >

          <router-link v-else to="/dashboard" class="btn btn-primary btn-md"
            >Go to Dashboard</router-link
          >
        </div>
      </div>
    </AuthWrapper>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_failed_modal">
        <FailedPaymentModal @confirmed="showSuccessState" />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AuthWrapper from "@/modules/auth/components/auth-wrapper";
import FailedPaymentModal from "@/modules/transactions/modals/failed-payment-modal";

export default {
  name: "PaymentSuccessful",

  metaInfo: {
    title: "Payment Successful",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    FailedPaymentModal,
    AuthWrapper,
    SuccessItemCard: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/card-comps/success-item-card"
      ),
  },

  computed: {
    getTransactionAmount() {
      let currencies = ["NGN", "USD", "GPB"];
      let amount_data = this.$route.query.fee;
      let sliced_currency = amount_data.slice(0, 3);

      if (currencies.includes(sliced_currency)) {
        return `${this.$money.getSign(
          sliced_currency
        )}${this.$utils.formatCurrencyWithComma(amount_data.slice(3))}`;
      } else {
        return `${this.$utils.formatCurrencyWithComma(amount_data.slice(3))}`;
      }
    },
  },

  data() {
    return {
      show_failed_modal: false,
      payment_confirmed: false,
      retried: false,
    };
  },

  mounted() {
    if (this.$route.query.reference) this.confirmPayment();
    else this.payment_confirmed = true;
  },

  methods: {
    ...mapActions({
      confirmPaymentStatus: "transactions/confirmPaymentStatus",
    }),

    async retryConfirmation() {
      await this.confirmPayment();
      this.retried = true;
    },

    async confirmPayment() {
      this.showPageLoader("Confirming payment");

      try {
        const response = await this.confirmPaymentStatus({
          reference: this.$route.query.reference,
          fund_wallet: true,
          headless: true,
        });

        this.hidePageLoader();

        if (response?.code === 200) this.payment_confirmed = true;
        else {
          // this.pushToast(response.message || "Payment failed", "error");

          this.retried
            ? (this.show_failed_modal = true)
            : this.retryConfirmation();
        }
      } catch (error) {
        this.hidePageLoader();
        this.retried
          ? (this.show_failed_modal = true)
          : this.retryConfirmation();
        // this.show_failed_modal = true;

        // this.pushToast(
        //   "Failed to verify payment. Reload to try again",
        //   "error"
        // );
      }
    },

    showSuccessState() {
      this.show_failed_modal = false;
      this.payment_confirmed = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-payment-success {
  width: auto;

  @include breakpoint-down(sm) {
    width: 100% !important;
  }

  .title-text {
    font-size: toRem(23);

    @include breakpoint-down(xs) {
      font-size: toRem(22);
    }
  }
}
</style>
