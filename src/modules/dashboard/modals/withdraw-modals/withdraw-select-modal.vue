<template>
  <ModalCover
    class="withdraw-select-modal"
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Transfer funds</div>

        <div class="modal-cover-meta">Please select a fund transfer option</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body mgb-30 mgb-hack">
        <PayTypeCard
          v-for="(data, index) in withdraw_options"
          :key="index"
          :payment="data"
          @payTypeClicked="$emit('accountTypeSelected', data)"
        />
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/modal-cover";

export default {
  name: "WithdrawSelectModal",

  components: {
    ModalCover,
    PayTypeCard: () =>
      import(
        /* webpackChunkName: 'modal-comps-module' */ "@/modules/dashboard/components/modal-comps/pay-type-card"
      ),
  },

  props: {
    type: {
      type: String,
      default: "single",
    },
  },

  computed: {
    isBusinessAccount() {
      return this.getAccountType === "business" ? true : false;
    },
  },

  data() {
    return {
      tool_tip: "<b>#50.00</b> will be charged for this withdrawal.",

      withdraw_options: [
        {
          id: 1,
          icon: "BusinessIcon",
          title: "Settlement account",
          slug: "settlement",
          description: this.isBusinessAccount
            ? "Transfer funds to your business accounts."
            : "Transfer funds to your personal accounts.",
        },
        {
          id: 2,
          icon: "ArrowRightIcon",
          title: "3rd party account",
          slug: "3rd party",
          description: "Transfer funds to a 3rd party account.",
        },
        {
          id: 3,
          icon: "WalletIcon",
          title: "Vesicash wallet",
          slug: "wallet",
          description: "Transfer funds to a Vesicash user wallet.",
        },
      ],
    };
  },
};
</script>

<style  lang="scss" scoped>
.mgb-hack {
  border: toRem(1) solid transparent;
}
</style>