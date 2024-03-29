<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-1`">{{ getCreatedDate }}</td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ $utils.getCapitalizeText(data.payment_method?.split("_")?.join(" ")) }}
    </td>

    <td
      class="body-data fw-medium"
      :class="`${table_name}-3`"
      v-html="getTransactionAmount"
    ></td>

    <td class="body-data" :class="`${table_name}-4`">
      <TagCard
        :card_text="getTransactionStatus.text"
        :card_type="getTransactionStatus.type"
      />
    </td>

    <td class="body-data" :class="`${table_name}-5`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          :amount="data.total_amount"
          :currency="data.currency"
          :summary_data="getSummaryData"
          @closeTriggered="toggleTransactionSummaryModal"
        />
      </transition>
    </portal>
  </tr>
</template>
    
    <script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "PaymentFundingTableRow",

  components: {
    TagCard,

    TransactionSummaryModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/dashboard/modals/transaction-summary-modal"
      ),
  },

  props: {
    table_name: {
      type: String,
      default: "",
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    getCreatedDate() {
      let { w2, d3, m4, y1 } = this.$date
        .formatDate(this.data.created_at)
        .getAll();

      return `${w2}, ${d3} ${m4} ${y1}`;
    },

    getCreatedTime() {
      let { h01, b2, s2, a0 } = this.$date
        .formatDate(this.data.created_at)
        .getAll();

      return `${h01}:${b2}:${s2} ${a0}`;
    },

    getTransactionType() {
      if (this.data.transaction_id) {
        return "Escrow";
      } else if (this.data.payment_method) {
        return "Funding";
      } else if (this.data.beneficiary_name) {
        return "Transfer";
      } else "Transfer";
    },

    getAmount() {
      let currency_slice = this.data.currency.split("_");

      return `${this.$utils.formatCurrency({
        input:
          currency_slice.length > 1 ? currency_slice[1] : this.data.currency,
        output: "sign",
      })}
       ${this.$utils.formatCurrencyWithComma(this.data.total_amount, true)}`;
    },

    getTransactionAmount() {
      if (this.data.wallet_funded) {
        return `<span class='green-600'>+${this.getAmount}</span>`;
      } else if (this.getTransactionType === "Funding") {
        return `<span class='green-600'>+${this.getAmount}</span>`;
      } else if (this.getTransactionType === "Transfer") {
        return `<span class='red-700'>-${this.getAmount}</span>`;
      } else {
        return this.getAmount;
      }
    },

    getTransactionStatus() {
      if (this.data.is_paid) {
        return {
          type: "success",
          text: "Successful",
        };
      } else if (this.data.payment_status === "pending") {
        return {
          type: "progress",
          text: "Pending",
        };
      } else if (this.data.payment_status === "failed") {
        return {
          type: "error",
          text: "Failed",
        };
      } else {
        return {
          type: "stale",
          text: "System error",
        };
      }
    },

    getSummaryData() {
      return [
        {
          title: "Transaction Date",
          value: this.getCreatedDate,
        },
        {
          title: "Transaction Time",
          value: this.getCreatedTime,
        },
        {
          title: "Payment ID",
          value: this.data.payment_id || "---",
        },
        {
          title: "Transaction Type",
          value: this.getTransactionType || "---",
        },
        this.getTransactionType === "Escrow"
          ? {
              title: "Escrow Transacion ID",
              value: this.data.transaction_id || "---",
            }
          : {},
        {
          title: "Currency",
          value: this.data.currency || "---",
        },
        this.getTransactionType === "Funding"
          ? {
              title: "Payment Method",
              value:
                this.$utils.getCapitalizeText(
                  this.data.payment_method?.split("_")?.join(" ")
                ) || "---",
            }
          : {
              title: "Beneficiary Name",
              value: this.data.beneficiary_name || "---",
            },
        {
          title: "Paid By",
          value: this.data.paid_by || "---",
        },
        {
          title: "Transaction Status",
          value: this.getTransactionStatus,
        },
      ];
    },
  },

  data: () => ({
    show_transaction_summary_modal: false,
  }),

  methods: {
    toggleTransactionSummaryModal() {
      this.show_transaction_summary_modal =
        !this.show_transaction_summary_modal;
    },
  },
};
</script>
    
    <style></style>
    