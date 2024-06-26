<template>
  <div>
    <div class="h4-text mgy-30">{{ getTransactionConfig.title || "" }}</div>

    <MilestoneCard
      v-for="(milestone, index) in allMilestones"
      :key="index + milestone.title"
      :txn_milestone="milestone"
      :deletable="false"
      :editable="false"
      class="mgy-30"
    />

    <div class="sum-card">
      <div class="card-row">
        <div class="title grey-700 tertiary-2-text text-capitalize">
          Payment
        </div>
        <div class="value grey-600 primary-2-text">{{ escrowAmount }}</div>
      </div>
      <div class="card-row">
        <div class="title grey-700 tertiary-2-text text-capitalize">
          Escrow fee
        </div>
        <div class="value grey-600 primary-2-text">{{ escrowFee }}</div>
      </div>
      <div class="card-row">
        <div class="title grey-700 tertiary-2-text text-capitalize">
          Disbursement fee
        </div>
        <div class="value grey-600 primary-2-text">{{ disbursementFee }}</div>
      </div>
      <div class="card-row">
        <div class="title grey-900 tertiary-2-text text-capitalize">
          TOTAL AMOUNT
        </div>
        <div class="value grey-900 primary-1-text">{{ totalAmount }}</div>
      </div>
    </div>

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
      getTransactionCharges: "general/getTransactionCharges",
    }),

    parties() {
      return this.getTransactionConfig?.parties || [];
    },

    isBuyer() {
      const initiator = this.getTransactionConfig?.parties?.find(
        (party) => party?.is_initiator
      );
      return initiator && initiator.role === "buyer";
    },

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

    escrowFee() {
      const fee = this.escrowCharge?.fee_charge || 0;
      return `${this.currencySign}${this.$utils.formatCurrencyWithComma(fee)}`;
    },

    totalAmount() {
      const total =
        (this.escrowCost || 0) +
        (this.escrowCharge?.fee_charge || 0) +
        (this.disbursementCharge?.fee_charge || 0);
      return `${this.currencySign}${this.$utils.formatCurrencyWithComma(
        total
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
      const parties = this.getTransactionConfig?.parties;

      const broker = this.getTransactionConfig?.parties?.find(
        (party) => party.role === "broker"
      );

      const brokerShare =
        broker && broker?.percentage ? Number(broker.percentage) / 100 : 0;

      const estimateShare = (role, amount) => {
        if (role === "buyer") return amount;
        if (role === "seller")
          return Number(amount) - Number(amount) * brokerShare;
        if (role === "broker") return Number(amount) * brokerShare;
        return amount;
      };

      return this.getTransactionConfig?.milestones?.map((item) => {
        return {
          ...item,
          currency: this.configCurrency,
          share: brokerShare,
          parties: [...parties].map((party) => ({
            ...party,
            amount: estimateShare(party.role, item.amount),
          })),
        };
      });
    },

    escrowCost() {
      return this.allMilestones?.reduce((sum, { amount }) => {
        sum += Number(amount);
        return sum;
      }, 0);
    },

    escrowCharge() {
      const charges = this.allEscrowCharges.map((charge) => {
        charge.min_value = charge.MinValue;
        if (charge.MaxValue == 0 || charge.max_value == 0)
          charge.max_value = Number.MAX_SAFE_INTEGER;
        return charge;
      });

      const amount = this.escrowCost;
      const currency = this.configCurrency?.short;
      const charge = this.estimateEscrowCharge(charges, amount, currency);

      return charge;
    },

    allEscrowCharges() {
      const all_charges = this.getTransactionCharges?.escrow
        ? [...this.getTransactionCharges?.escrow]
        : [];
      return all_charges;
    },

    allDisbursementCharges() {
      const all_charges = this.getTransactionCharges?.wallet_withdrawal
        ? [...this.getTransactionCharges?.wallet_withdrawal]
        : [];
      return all_charges;
    },

    disbursementCharge() {
      const charges = this.allDisbursementCharges.map((charge) => {
        charge.min_value = charge.MinValue;
        if (charge.MaxValue == 0 || charge.max_value == 0)
          charge.max_value = Number.MAX_SAFE_INTEGER;
        return charge;
      });

      const amount = this.escrowCost;
      const currency = this.configCurrency?.short;
      if (currency === "NGN")
        return {
          card_charge: 100,
          transfer_charge: 100,
          processing_fee: 100,
          fee_charge: 100,
        };
      if (currency === "USD")
        return {
          card_charge: 1,
          transfer_charge: 1,
          processing_fee: 1,
          fee_charge: 1,
        };
      const charge = this.estimateEscrowCharge(charges, amount, currency);

      return charge;
    },

    disbursementFee() {
      const fee = this.disbursementCharge?.fee_charge || 0;
      return `${this.currencySign}${this.$utils.formatCurrencyWithComma(fee)}`;
    },
  },

  methods: {
    ...mapActions({
      createEscrowTransaction: "transactions/createEscrowTransaction",
      getEscrowCharge: "transactions/getEscrowCharge",
      fetchCharges: "general/fetchCharges",
      makePayment: "transactions/makePayment",
      sendTransaction: "transactions/sendTransaction",
      registerBulkUsers: "auth/registerBulkUsers",
    }),

    async createParties() {
      try {
        const parties = this.parties
          ?.filter?.((party) => !party?.is_initiator)
          ?.map((party) => ({ email_address: party.email }));
        const payload = {
          bulk: parties,
        };

        const response = await this.registerBulkUsers(payload);

        if (![200, 201].includes(response?.code)) {
          this.pushToast("Failed to create invited parties account", "warning");
          return {};
        }

        const partyIDs = response?.data?.length
          ? response.data?.reduce((acc, party) => {
              acc[party.email_address] = party.account_id;
              return acc;
            }, {})
          : {};

        return partyIDs;
      } catch (err) {
        this.handleClick("start", "Start escrow", false);
        console.log("FAILED TO CREATE PARTIES", err);
        this.pushToast("Failed to create invited parties account", "error");
        return {};
      }
    },

    estimateEscrowCharge(charges, amount, currency) {
      const escrowCharge = charges.find((charge) => {
        return (
          charge.currency === currency &&
          amount >= charge.min_value &&
          amount <= charge.max_value
        );
      });

      let card_charge = null;
      let transfer_charge = null;
      let fee_charge = null;
      let processing_fee = null;

      if (!escrowCharge)
        return { card_charge, transfer_charge, processing_fee, fee_charge };

      const card_cap = escrowCharge?.value?.card_fee_capped_at;
      const card_fee = escrowCharge?.value?.card_fee;
      const is_card_capped = card_cap > 0;

      const is_card_percentage = escrowCharge?.value?.is_percentage_card_fee;

      const card_bank_cost = is_card_percentage
        ? (card_fee / 100) * amount
        : card_fee;

      card_charge = is_card_capped
        ? Math.min(card_cap, card_bank_cost)
        : card_bank_cost;

      const bank_cap = escrowCharge?.value?.bank_fee_capped_at;
      const bank_fee = escrowCharge?.value?.bank_fee;
      const is_bank_capped = bank_cap > 0;
      const is_bank_percentage = escrowCharge?.value?.is_percentage_bank_fee;
      const bank_cost = is_bank_percentage
        ? (bank_fee / 100) * amount
        : bank_fee;
      transfer_charge = is_bank_capped
        ? Math.min(bank_cap, bank_cost)
        : bank_cost;

      const fee_cap = escrowCharge?.value?.fee_capped_at;
      const fee = escrowCharge?.value?.fee;
      const is_fee_capped = fee_cap > 0;
      const is_fee_percentage = escrowCharge?.value?.is_percentage_fee;
      const fee_cost = is_fee_percentage ? (fee / 100) * amount : fee;
      fee_charge = is_fee_capped ? Math.min(fee_cap, fee_cost) : fee_cost;

      processing_fee = escrowCharge?.processingFee || 0;

      const total = fee_charge
        ? amount +
          fee_charge +
          (processing_fee * this.getTransactionMilestones?.length || 1)
        : null;

      return {
        card_charge,
        transfer_charge,
        fee_charge,
        processing_fee,
        amount,
        total,
      };
    },

    ...mapMutations({
      CLEAR_TRANSACTION_CONFIG: "transactions/CLEAR_TRANSACTION_CONFIG",
    }),

    async payForEscrow(transaction_id) {
      try {
        const response = await this.makePayment({ transaction_id });
        const message = response?.data?.message || response?.message;
        const type = [200, 201].includes(response?.code)
          ? "success"
          : "warning";

        this.pushToast(
          message === "insufficient balance"
            ? "Insufficient balance. Escrow saved as draft"
            : message,
          type
        );
        if (type == "success" || message === "insufficient balance") {
          setTimeout(() => {
            this.CLEAR_TRANSACTION_CONFIG();
            this.$router.push("/escrow/transactions");
          }, 1500);
        }
      } catch (err) {
        console.log("FAILED TO PAY FOR ESCROW", err);
        this.pushToast("Payment failed", "error");
      }
    },

    async startEscrow() {
      this.handleClick("start");
      const IDs = await this.createParties();

      const payload = {
        ...this.getTransactionConfig,
        parties: [...this.getTransactionConfig?.parties]?.map((party) => {
          if (party.percentage !== undefined)
            party.percentage = Number(party.percentage);
          if (!party.is_initiator) party.user_id = `${IDs[party.email]}`;
          if (party.is_initiator) {
            party.bank_account = {
              account_name: this.getUser?.business_name || "",
              account_number: `${this.getAccountId}`,
              bank_code: "VE000",
              bank_name: "Vesicash",
            };
          } else {
            party.bank_account = {
              account_name: "",
              account_number: `${IDs[party.email]}`,
              bank_code: "VE000",
              bank_name: "Vesicash",
            };
          }
          return party;
        }),
        files: [...this.getTransactionConfig?.files]?.map((file) => ({
          url: file.url,
        })),
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
        const response = await this.createEscrowTransaction(payload);
        this.handleClick("start", "Start escrow", false);
        const message = response?.message;
        const type = [200, 201].includes(response?.code)
          ? "success"
          : "warning";

        if (type == "success") {
          const send_response = await this.sendTransaction({
            id: response?.data?.transaction_id,
          });
          if (send_response?.code !== 200) {
            this.pushToast(
              send_response?.message || "Failed to send invites",
              "warning"
            );
            return;
          }
          if (this.isBuyer) {
            this.payForEscrow(response?.data?.transaction_id);
          } else {
            this.pushToast(message, type);
            setTimeout(() => {
              this.CLEAR_TRANSACTION_CONFIG();
              this.$router.push("/escrow/transactions");
            }, 1500);
          }
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
.party-card {
  background: getColor("green-10");
  padding: toRem(10) toRem(20);
  border: toRem(1) solid getColor("grey-100");
  border-radius: toRem(20);
  position: relative;
  display: grid;
  // gap: toRem(20) 0;
  margin: toRem(30) 0;

  .party-row {
    @include flex-row-nowrap("space-between", "center");
    padding: toRem(15) 0;
    border-bottom: toRem(0.3) solid getColor("grey-200");
    &:last-child {
      border-bottom: 0;
    }

    .party-meta {
      font-size: 0.9rem;
    }
  }
}

.sum-card {
  padding: toRem(8) toRem(16);
  border: toRem(1) solid getColor("grey-100");
  border-radius: toRem(20);
  position: relative;

  .card-row {
    @include flex-row-nowrap("space-between", "center");
    padding: toRem(15) 0;
    border-bottom: toRem(0.3) solid getColor("grey-200");
    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>
