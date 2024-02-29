<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-1`">
      {{ getTransactionDate }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      <div>{{ data.customer_name }}</div>
      <div class="f-size-13 mgt-4">
        {{ data.merchant_email }}
      </div>
    </td>

    <td class="body-data" :class="`${table_name}-3`">
      <span class="fw-semibold"
        >{{
          $utils.formatCurrency({
            input: data.currency,
            output: "sign",
          })
        }}{{ `${$utils.formatCurrencyWithComma(data.amount, true)}` }}</span
      >

      <div class="f-size-13 grey-500 mgt-4">
        Method:
        <span class="fw-medium grey-800">
          {{
            data.payment_method.includes("mobilemoney")
              ? "Mobilemoney"
              : $utils.getCapitalizeText(data.payment_method)
          }}</span
        >
      </div>
    </td>

    <td class="body-data fw-medium grey-700" :class="`${table_name}-4`">
      {{
        $utils.formatCurrency({
          input: data.currency,
          output: "sign",
        })
      }}
      {{ `${$utils.formatCurrencyWithComma(data.tax_fee, true)}` }}
    </td>

    <td class="body-data" :class="`${table_name}-5`">
      <TagCard
        :card_text="getTransactionStatus.text"
        :card_type="getTransactionStatus.type"
      />
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          :amount="data.amount"
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
  name: "MoRTransactionTableRow",

  components: {
    TagCard,

    TransactionSummaryModal: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/dashboard/modals/transaction-summary-modal"
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
    getTransactionDate() {
      let { w2, d3, m4, y1 } = this.$date
        .formatDate(this.data.transaction_date)
        .getAll();

      return `${w2}, ${d3} ${m4} ${y1}`;
    },

    getTransactionTime() {
      let { h01, b2, s2, a0 } = this.$date
        .formatDate(this.data.transaction_date)
        .getAll();

      return `${h01}:${b2}:${s2} ${a0}`;
    },

    getTransactionStatus() {
      if (this.data.status === "successful") {
        return {
          type: "success",
          text: "Successful",
        };
      } else if (this.data.status === "pending") {
        return {
          type: "progress",
          text: "Pending",
        };
      } else if (this.data.status === "failed") {
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
          value: this.getTransactionDate,
        },
        {
          title: "Transaction Time",
          value: this.getTransactionTime,
        },
        {
          title: "Reference ID",
          value: this.data.reference || "---",
        },
        {
          title: "Customer Name",
          value: this.data.customer_name || "---",
        },
        {
          title: "Merchant Name",
          value: this.data.merchant_name || "---",
        },
        {
          title: "Country",
          value: `${this.data.country} (${this.data.currency})` || "---",
        },
        {
          title: "Payment Method",
          value:
            this.$utils.getCapitalizeText(this.data.payment_method) || "---",
        },
        {
          title: "Tax Fee",
          value:
            `${this.$utils.formatCurrency({
              input: this.data.currency,
              output: "sign",
            })}${this.$utils.formatCurrencyWithComma(
              this.data.tax_fee,
              true
            )}` || "---",
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

<style lang="scss" scoped>
.transaction-table-row {
}
</style>
