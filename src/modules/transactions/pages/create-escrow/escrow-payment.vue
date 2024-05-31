<template>
  <div>
    <div class="h5-text mgy-30">{{ getTransactionConfig.title || "" }}</div>

    <MilestoneCard
      v-for="(milestone, index) in allMilestones"
      :key="index + milestone.title"
      :txn_milestone="milestone"
      :deletable="false"
      :editable="false"
      class="mgy-30"
    />

    <SumTotalDisplayCard
      :total_value="escrowAmount"
      total_text="TOTAL AMOUNT"
      class="total-card"
    />

    <button
      class="btn btn-md btn-primary mgt-40"
      ref="start"
      @click="startEscrow"
    >
      Start escrow
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import MilestoneCard from "../../components/card-comps/milestone-card.vue";
import SumTotalDisplayCard from "../../../../shared/components/card-comps/sum-total-display-card.vue";
import countries from "@/utilities/countries";
export default {
  name: "EscrowPaymentPage",

  components: {
    MilestoneCard,
    SumTotalDisplayCard,
  },

  computed: {
    ...mapGetters({
      getTransactionConfig: "transactions/getTransactionConfig",
    }),

    currencies() {
      return countries.map((country) => ({
        ...country,
        id: country.code,
        name: `${country.currency.short} (${country.currency.sign})`,
      }));
    },

    currencySign() {
      return this.configCurrency.sign;
    },

    escrowAmount() {
      return `${this.currencySign}${this.$utils.formatCurrencyWithComma(
        this.escrowCost
      )}`;
    },

    configCurrency() {
      const config = this.getTransactionConfig;
      const default_currency = {
        sign: "₦",
        short: "NGN",
        long: "Naira",
        description: "Nigerian Naira",
      };
      if (!config) return default_currency;
      const currency = this.currencies?.find(
        (cc) => config.currency === cc.currency.short
      );
      return currency?.currency || default_currency;
    },

    allMilestones() {
      return this.getTransactionConfig?.milestones?.map((item) => {
        return {
          ...item,
          currency: this.configCurrency,
        };
      });
    },

    escrowCost() {
      return this.allMilestones?.reduce((sum, { amount }) => {
        sum += Number(amount);
        return sum;
      }, 0);
    },
  },

  methods: {
    ...mapActions({
      createEscrowTransaction: "transactions/createEscrowTransaction",
    }),

    ...mapMutations({
      CLEAR_TRANSACTION_CONFIG: "transactions/CLEAR_TRANSACTION_CONFIG",
    }),

    async startEscrow() {
      const payload = {
        ...this.getTransactionConfig,
        type:
          this.getTransactionConfig?.milestones?.length > 1
            ? "milestone"
            : "oneoff",
        milestones: [...this.getTransactionConfig?.milestones]?.map((item) => {
          return {
            ...item,
            amount: Number(item.amount),
            inspection_period: Number(item.inspection_period),
            grace_period: Number(item.grace_period),
            due_date: `${item.due_date} 00:00:00`,
          };
        }),
      };

      try {
        this.handleClick("start");
        const response = await this.createEscrowTransaction(payload);
        this.handleClick("start", "Start escrow", false);
        const message = response?.message;
        const type = [200, 201].includes(response?.code)
          ? "success"
          : "warning";
        this.pushToast(message, type);

        if (type == "success") {
          setTimeout(() => {
            this.CLEAR_TRANSACTION_CONFIG();
            this.$router.push("/transactions");
          }, 1500);
        }
      } catch (err) {
        console.log("ERROR STARTING ESCROW", err);
        this.pushToast("Failed to start escrow", "error");
        this.handleClick("start", "Start escrow", false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.total-card {
  max-width: toRem(820);
}
</style>
