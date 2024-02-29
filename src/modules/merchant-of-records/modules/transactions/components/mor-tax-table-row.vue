<template>
  <tr @click="viewTransactionDetails">
    <td class="body-data" :class="`${table_name}-1`">
      {{ getTransactionDate }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ data.reference }}
    </td>

    <td class="body-data" :class="`${table_name}-3`">
      {{
        $utils.formatCurrency({
          input: data.currency,
          output: "sign",
        })
      }}{{
        `${$utils.formatCurrencyWithComma(
          data.amount?.toString()?.split(".")[0] ?? data.amount
        )}.${data.amount?.toString()?.split(".")[1] ?? "00"}`
      }}

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

    <td class="body-data fw-medium" :class="`${table_name}-4`">
      {{
        $utils.formatCurrency({
          input: data.currency,
          output: "sign",
        })
      }}
      {{
        `${$utils.formatCurrencyWithComma(
          data.tax_fee?.toString()?.split(".")[0] ?? data.tax_fee
        )}.${data.tax_fee?.toString()?.split(".")[1] ?? "00"}`
      }}
    </td>

    <!-- <td class="body-data" :class="`${table_name}-5`">
        {{ data.payment_method }}
      </td> -->

    <td class="body-data" :class="`${table_name}-6`">
      <TagCard card_text="Successful" card_type="success" />
    </td>
  </tr>
  <!-- <td class="body-data" :class="`${table_name}-7`">
        <button class="btn btn-secondary btn-sm">View</button>
      </td> -->
</template>
  
  <script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "MoRTaxTableRow",

  components: {
    TagCard,
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
  },

  methods: {
    viewTransactionDetails() {},
  },
};
</script>
  
  <style lang="scss" scoped>
.transaction-table-row {
}
</style>
  