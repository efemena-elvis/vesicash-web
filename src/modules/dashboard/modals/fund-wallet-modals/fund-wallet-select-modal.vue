<template>
  <ModalCover
    class="wallet-select-modal"
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Fund wallet</div>

        <div class="modal-cover-meta">
          Please select a payment funding option
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body mgb-30 mgb-hack">
        <PayTypeCard
          v-for="(data, index) in withdraw_options"
          :key="index"
          :payment="data"
          @payTypeClicked="$emit('fundingOptionSelected', data)"
        />
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/modal-cover";

export default {
  name: "FundWalletSelectModal",

  components: {
    ModalCover,
    PayTypeCard: () =>
      import(
        /* webpackChunkName: 'modal-comps-module' */ "@/modules/dashboard/components/modal-comps/pay-type-card"
      ),
  },

  data: () => ({
    // tool_tip:
    //   "Fund wallet Charges <br> ₦500 for ₦0 - ₦500,000 <br> ₦1,000 for ₦500,001 - ₦1,000,000  <br> ₦2,000 (capped) for ₦1,000,001 and above",
    tool_tip:
      "<table class='table f-size-13 grey-700'><thead><tr><td>Fund amount range</td><td>Charges</td></tr></thead><tbody><tr><td>₦1,000 - ₦500,000</td><td>₦500</td></tr><tr><td>₦500,001 - ₦1,000,000</td><td>₦1,000</td></tr><tr><td>₦1,000,001 and above</td><td>₦2,000 (capped)</td></tr></tbody></table> Minimum wallet funding amount is <b>₦1,000</b>. Do not send below this amount.",

    withdraw_options: [
      {
        id: 1,
        icon: "CreditCardIcon",
        title: "Fund via card",
        slug: "card",
        description: "Fund wallet via credit card.",
      },
      {
        id: 2,
        icon: "ArrowRightIcon",
        title: "Fund via transfer",
        slug: "transfer",
        description: "Fund wallet via bank transfer.",
      },
    ],
  }),
};
</script>

<style lang="scss" scoped>
.mgb-hack {
  border: toRem(1) solid transparent;
}
</style>
