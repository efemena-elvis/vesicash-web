<template>
  <tr class="send-money-row">
    <td class="display-col">{{ account.account_no }}</td>
    <td class="display-col">{{ account.bank_name }}</td>
    <td class="display-col">{{ account.account_name }}</td>
    <td class="input-col green-50-bg">
      <input type="number" v-model="account_amount" />
    </td>
    <td class="display-col space-btw">
      <div class="">{{ getTransferFee }}</div>

      <div
        class="icon-wrapper"
        title="Remove account"
        @click="removeAccountRow()"
      >
        <span class="icon-trash"></span>
      </div>
    </td>
  </tr>
</template>
      
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "SendMoneyTableRow",

  props: {
    account_index: {
      type: Number,
      default: 0,
    },

    account: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    account_amount: {
      handler(amount) {
        this.updateAmountOnAccount({
          account_no: this.account.account_no,
          amount: +amount,
        });
      },
    },
  },

  computed: {
    ...mapGetters({
      getTransactionCharges: "general/getTransactionCharges",
    }),

    getWithdrawalCharges() {
      const withdrawal_charge = this.getTransactionCharges?.wallet_withdrawal;
      if (!withdrawal_charge) return [];

      return withdrawal_charge.map((charge) => {
        charge.min_value = charge.MinValue || charge.min_value;

        if (charge.MaxValue == 0 || charge.max_value == 0)
          charge.max_value = Number.MAX_SAFE_INTEGER;

        return charge;
      });
    },

    getTransferFee() {
      let charge_fee = 0;
      const amount = +this.account_amount || 0;
      const currency = this.account.currency;

      const found_charge = this.getWithdrawalCharges.find((charge) => {
        return (
          charge.currency === currency &&
          amount >= charge.min_value &&
          amount <= charge.max_value
        );
      });

      if (!found_charge) return "0";

      const capped_at = found_charge?.value?.fee_capped_at;
      const fee = found_charge?.value?.fee;
      const is_capped = capped_at > 0;
      const is_percentage = found_charge?.value?.is_percentage_fee;
      const charge = is_percentage ? (fee / 100) * amount : fee;

      charge_fee = is_capped ? Math.min(capped_at, charge) : charge;

      return `${this.$utils.formatCurrency({
        input: currency,
        output: "sign",
      })}
      
       ${this.$utils.formatCurrencyWithComma(charge_fee, true)}`;
    },
  },

  data() {
    return {
      account_amount: this.account.amount,
    };
  },

  methods: {
    ...mapActions({
      removeAccountFromList: "payments/removeAccountFromList",
      updateAmountOnAccount: "payments/updateAmountOnAccount",
    }),

    removeAccountRow() {
      this.removeAccountFromList(this.account_index);
    },
  },
};
</script>
      
  <style scoped lang="scss">
.send-money-row {
  .input-col {
    padding: 0 !important;

    input {
      padding: toRem(6) toRem(20) toRem(8);
      width: toRem(120) !important;
      background: transparent;
      outline: none;
      border: none;
    }
  }

  .space-btw {
    @include flex-row-nowrap("space-between", "center");
    gap: toRem(10);

    .icon-wrapper {
      @include flex-column("center", "center");
      background: getColor("grey-100");
      @include transition(0.4s);
      @include draw-shape(30);
      border-radius: 50%;
      cursor: pointer;

      .icon-trash {
        color: getColor("red-600");
        font-size: toRem(16.5);
        font-weight: 500;
      }

      &:hover {
        background: getColor("grey-200");
      }
    }
  }
}
</style>
  
  