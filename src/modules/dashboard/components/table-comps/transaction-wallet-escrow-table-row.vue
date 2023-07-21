<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-1`">{{ getCreatedDate }}</td>

    <td
      class="body-data text-no-wrap"
      :class="`${table_name}-2`"
      :title="data?.transaction?.transaction_id ?? '--------'"
    >
      {{ data?.transaction?.transaction_id ?? "--------" }}
    </td>

    <td class="body-data text-capitalize" :class="`${table_name}-3`">
      {{ data?.transaction?.type ?? "-------" }}
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      {{ data.payment_type || data.payment_method || "-------" }}
    </td>

    <td class="body-data" :class="`${table_name}-5`">
      <span v-html="$money.getSign(data.currency)"></span>
      {{ $utils.formatCurrencyWithComma(data.total_amount) }}
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      <TagCard
        :card_text="data.is_paid === false ? 'Not paid' : 'Paid'"
        :card_type="data.is_paid === false ? 'error' : 'success'"
      />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          :prepared_summary="preparedSummary"
          type="wallet"
          :summary_data="data"
          @closeTriggered="toggleTransactionSummaryModal"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "TransactionWalletEscrowTableRow",

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
    getCreatedDate() {
      let { d3, m4, y1 } = this.$date.formatDate(this.data.created_at).getAll();

      return `${d3} ${m4}, ${y1}`;
    },

    preparedSummary() {
      let summary_list = [];
      delete this.data.payment_made_at;
      delete this.data.deleted_at;
      delete this.data.updated_at;
      delete this.data.business_id;
      delete this.data.payment_method;
      delete this.data.payment_type;
      delete this.data.paid_by;

      for (const prop in this.data) {
        let prop_obj = {};
        prop_obj.title = prop.split("_").join(" ");
        prop_obj.value = this.data[prop];

        if (prop_obj.title === "user") {
          prop_obj.value = this.data[prop].email_address;
        }

        if (prop_obj.title === "transaction") {
          prop_obj.title = "Transaction Type";
          prop_obj.value = this.data[prop].type;
        }

        summary_list.push(prop_obj);
      }

      return summary_list;
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

    viewTransactionDetail() {
      this.$bus.$emit("showTransactionSummary");
    },
  },
};
</script>

<style></style>
