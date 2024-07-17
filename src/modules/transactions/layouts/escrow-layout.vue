<template>
  <div class="layout-body">
    <div class="h4-text grey-900 mgb-25">Escrow</div>
    <PageBackBtn :back_link="pageBackLink" />
    <ProgressBar :items="escrowProgressFlow" />
    <RouterView />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";
import ProgressBar from "@/shared/components/block-comps/progress-bar";

export default {
  name: "EscrowLayout",

  components: {
    ProgressBar,
    PageBackBtn,
  },

  mounted() {
    this.fetchCharges("escrow");
    this.fetchCharges("wallet_withdrawal");
  },

  computed: {
    escrowProgressFlow() {
      const routeName = this.$route?.name;
      return [
        {
          title: "Creating escrow as?",
          active: routeName === "CreateEscrowPage",
          done: [
            "EscrowDetailsPage",
            "EscrowDisbursementDetailsPage",
            "EscrowPaymentPage",
          ].includes(routeName),
        },
        {
          title: "About the transaction",
          active: routeName === "EscrowDetailsPage",
          done: ["EscrowDisbursementDetailsPage", "EscrowPaymentPage"].includes(
            routeName
          ),
        },
        {
          title: "Disbursement details",
          active: routeName === "EscrowDisbursementDetailsPage",
          done: ["EscrowPaymentPage"].includes(routeName),
        },
        {
          title: "Make payment",
          active: routeName === "EscrowPaymentPage",
          done: false,
        },
      ];
    },

    pageBackLink() {
      const routeName = this.$route?.name;
      switch (routeName) {
        case "CreateEscrowPage":
          return "/dashboard";
        case "EscrowDetailsPage":
          return "/escrow/create";
        case "EscrowDisbursementDetailsPage":
          return "/escrow/transaction-details";
        case "EscrowPaymentPage":
          return "/escrow/disbursement-details";
        default:
          return "/dashboard";
      }
    },
  },

  methods: {
    ...mapActions({
      fetchCharges: "general/fetchCharges",
    }),
  },
};
</script>

<style lang="scss" scoped>
.layout-body {
  width: toRem(850);
  max-width: 100%;
  padding-bottom: toRem(50);
}
</style>
