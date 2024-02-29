<template>
  <div class="transactions-page">
    <!-- PAGE TITILE -->
    <TitleTopBlock title="Payments" />

    <!-- BENEFICIARY BLOCK -->
    <BeneficiaryBlock />

    <div class="title-text h5-text grey-900 mgt-20 mgb-30">
      Payment transactions
    </div>

    <!-- PAYMENT TRANSACTIONS -->
    <div class="wrapper pdb-30">
      <div class="mgb-30">
        <PageSwitcher
          :page_data="pages"
          :full_width="false"
          @swapItem="updateTransactionChanges($event)"
        />
      </div>

      <component
        :is="
          active_view === 'outflow'
            ? 'PaymentWithdrawalTable'
            : 'PaymentFundingTable'
        "
      />
    </div>
  </div>
</template>

<script>
import TitleTopBlock from "@/shared/components/block-comps/title-top-block";
import BeneficiaryBlock from "@/modules/payments/components/beneficiary-block";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";

export default {
  name: "PaymentPage",

  components: {
    TitleTopBlock,
    BeneficiaryBlock,
    PageSwitcher,
    PaymentWithdrawalTable: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/components/payment-withdrawal-table"
      ),
    PaymentFundingTable: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/components/payment-funding-table"
      ),
  },

  data: () => ({
    active_view: "outflow",

    pages: [
      {
        title: "Payment Outflow",
        value: "outflow",
        active: true,
      },
      {
        title: "Payment Inflow",
        value: "inflow",
        active: false,
      },
    ],
  }),

  methods: {
    updateTransactionChanges(selected_value) {
      this.active_view = selected_value;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
