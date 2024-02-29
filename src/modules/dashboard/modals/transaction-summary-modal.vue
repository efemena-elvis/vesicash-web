<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-pre-sm' }"
    place_side
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Transaction Summary</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body mgt-6">
        <!-- AMOUNT TOP -->
        <div class="base-amount mgb-38">
          <div class="grey-500 f-size-13-5 mgb-8">Amount Paid</div>
          <div class="amount" :class="is_inflow ? 'green-600' : 'red-800'">
            <span class="f-size-21"
              >{{ is_inflow ? "+" : "-" }}{{ getCurrency }}</span
            >
            <span>{{ getFormattedAmount }}</span>
          </div>
        </div>

        <!-- DATA BLOCK -->
        <div class="data-block">
          <div
            class="data-row"
            v-for="(data, index) in getSummaryData"
            :key="index"
          >
            <template v-if="data.title.toLowerCase() === 'transaction status'">
              <div class="item-title">{{ data.title }}</div>
              <TagCard
                :card_text="data.value.text"
                :card_type="data.value.type"
              />
            </template>

            <template v-else>
              <div class="item-title">{{ data.title }}</div>
              <div class="item-value">{{ data.value }}</div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer" v-if="false">
        <button class="btn btn-primary btn-md mgr-24">Download receipt</button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "TransactionSummaryModal",

  components: {
    ModalCover,
    TagCard,
  },

  props: {
    amount: {
      type: Number | String,
      default: "",
    },

    currency: {
      type: String,
      default: "",
    },

    is_inflow: {
      type: Boolean,
      default: true,
    },

    summary_data: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    getFormattedAmount() {
      return this.$utils.formatCurrencyWithComma(this.amount, true);
    },

    getCurrency() {
      let currency_slice = this.currency.split("_");

      return `${this.$utils.formatCurrency({
        input: currency_slice.length > 1 ? currency_slice[1] : this.currency,
        output: "sign",
      })}`;
    },

    getSummaryData() {
      return this.summary_data.filter((obj) => Object.keys(obj).length !== 0);
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
