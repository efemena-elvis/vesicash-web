<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-1`">
      {{ getFormattedData.date }}
    </td>

    <td class="body-data text-no-wrap" :class="`${table_name}-2`">
      {{ getFormattedData.name }}
    </td>

    <td class="body-data" :class="`${table_name}-3`">
      {{ getFormattedData.initial_amount }}
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      {{ getFormattedData.final_amount }}
    </td>

    <td class="body-data" :class="`${table_name}-5`">
      {{ getFormattedData.rate }}
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      <TagCard
        :card_text="data.status === 'failed' ? 'Failed' : 'Completed'"
        :card_type="data.status === 'failed' ? 'error' : 'success'"
      />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <ExchangeTransactionSummary
          :summary="getFormattedData"
          @closeTriggered="toggleTransactionSummaryModal"
          @close="toggleTransactionSummaryModal"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "ExchangeTableRow",

  components: {
    TagCard,

    ExchangeTransactionSummary: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/exchange/modals/exchange-transaction-summary"
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
    getFormattedData() {
      const initial_currency = this.data.rate.from_currency;
      const final_currency = this.data.rate.to_currency;

      return {
        date: this.data.date,
        name: this.data.transaction_name,
        initial_amount: this.formattedMoney(
          initial_currency,
          this.data.initial_amount
        ),
        final_amount: this.formattedMoney(
          final_currency,
          this.data.final_amount
        ),
        rate: `${this.$money.getSign(initial_currency)}1/${this.$money.getSign(
          final_currency
        )}${this.data.rate.amount}`,
        status: this.data.status,
      };
    },

    preparedSummary() {
      let summary_list = [];
      delete this.data.shit;

      for (const prop in this.data) {
        let prop_obj = {};
        prop_obj.title = prop.split("_").join(" ");
        prop_obj.value = this.data[prop];

        summary_list.push(prop_obj);
      }

      return summary_list;
    },
  },

  data: () => ({
    show_transaction_summary_modal: false,
  }),

  methods: {
    formattedMoney(currency, amount) {
      return `${this.$money.getSign(
        currency
      )}${this.$utils.formatCurrencyWithComma(amount)}`;
    },

    toggleTransactionSummaryModal() {
      this.show_transaction_summary_modal =
        !this.show_transaction_summary_modal;
    },

    viewTransactionDetail() {
      this.$bus.$emit("showTransactionSummary");
    },
  },
};
</script>

<style></style>
