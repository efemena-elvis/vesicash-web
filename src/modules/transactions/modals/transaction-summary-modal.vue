<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-pre-sm' }"
    place_left_side
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Transaction Payment Details</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body mgt-6">
        <!-- AMOUNT TOP -->
        <div class="base-amount mgb-38">
          <div class="grey-500 f-size-13-5 mgb-8">Total Amount</div>
          <div class="amount red-800">
            {{ amount }}
          </div>
        </div>

        <!-- DATA BLOCK -->
        <div class="data-block">
          <div class="data-row" v-for="(data, index) in summary" :key="index">
            <div class="item-title">{{ data.title }}</div>
            <div class="item-value">{{ data.value }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer" v-if="action">
        <button class="btn btn-primary btn-md mgt-30" @click="$emit('action')">
          {{ action }}
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "EscrowTransactionSummaryModal",

  components: {
    ModalCover,
  },

  props: {
    amount: {
      type: Number | String,
      default: "",
    },

    summary: {
      type: Array,
      default: () => [],
    },

    action: {
      type: String,
      default: "Make payment",
    },
  },

  data() {
    return {};
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  .base-amount {
    .amount {
      @include font-height(26, 28, 700);
    }
  }

  .data-block {
    @include flex-column("flex-start", "space-between");
    gap: toRem(32);

    .data-row {
      @include flex-row-nowrap("space-between", "center");
      @include font-height(14.5, 18, 400);
      gap: toRem(10);

      .item-title {
        @include font-height(14, 18, 400);
        color: getColor("grey-500");
      }

      .item-value {
        @include font-height(14.5, 18, 500);
        color: getColor("grey-700");
      }
    }
  }
}

.modal-cover-footer {
  @include flex-row-wrap("flex-start", "center");

  .btn {
    @include breakpoint-down(sm) {
      margin-bottom: toRem(20);
      width: 100%;

      &:first-of-type {
        margin-right: 0 !important;
      }

      &:last-of-type {
        margin-bottom: toRem(10);
      }
    }
  }
}
</style>
