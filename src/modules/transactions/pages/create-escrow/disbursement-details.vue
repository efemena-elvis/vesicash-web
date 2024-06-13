<template>
  <div class="pdb-40">
    <PartyCard
      v-if="initiator.role === 'broker'"
      :party_detail="initiator"
      party_type="broker"
      class="mgy-30"
      @updated="updateParties"
      party_disabled
    />

    <PartyCard
      v-for="(party, index) in parties"
      :party_detail="party"
      :key="party.user_id + index"
      :party_type="party.role"
      :allow_delete="party.role === 'broker'"
      class="mgy-30"
      @updated="updateParties"
      @delete="removeParty"
    />

    <MilestoneCard
      v-for="(milestone, index) in allMilestones"
      :key="index + milestone.title + milestone.id"
      :txn_milestone="milestone"
      @saved="updateMilestone($event, index)"
      @delete="deleteMilestone"
      :deletable="index !== 0"
      class="mgy-30"
    />

    <div class="button-row">
      <button
        class="btn btn-md btn-primary"
        :disabled="proceedDisabled"
        @click="proceed"
      >
        Proceed
      </button>
      <button class="btn btn-md btn-secondary" @click="addNewMilestone">
        + Add a milestone
      </button>
      <button
        class="btn btn-md btn-secondary"
        @click="addNewbroker"
        v-if="!hasBroker"
      >
        + Add {{ hasBroker ? "another" : "" }} broker
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import MilestoneCard from "../../components/card-comps/milestone-card.vue";
import PartyCard from "../../components/card-comps/party-card.vue";
import countries from "@/utilities/countries";
export default {
  name: "EscrowDisbursementDetailsPage",

  components: {
    MilestoneCard,
    PartyCard,
  },

  computed: {
    ...mapGetters({
      getTransactionConfig: "transactions/getTransactionConfig",
    }),

    proceedDisabled() {
      const validParties = this.parties.every((party) =>
        this.checkPartyValidity(party)
      );
      const validMilestone = this.allMilestones.every((item) => item.saved);
      return !validMilestone || !validParties;
    },

    parties() {
      return this.getTransactionConfig?.parties?.filter(
        (party) => !party.is_initiator
      );
    },

    initiator() {
      return this.getTransactionConfig?.parties?.find(
        (party) => party.is_initiator
      );
    },

    hasBroker() {
      return this.getTransactionConfig?.parties?.some(
        (party) => party.role === "broker"
      );
    },

    currencies() {
      return countries.map((country) => ({
        ...country,
        id: country.code,
        name: `${country.currency.short} (${country.currency.sign})`,
      }));
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
        if (role === "buyer") return 0;
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
  },

  methods: {
    ...mapMutations({
      UPDATE_TRANSACTION_CONFIG: "transactions/UPDATE_TRANSACTION_CONFIG",
    }),

    proceed() {
      const partyEmails = this.getTransactionConfig?.parties?.reduce(
        (email, party) => {
          if (email[party.email]) {
            email[party.email] = email[party.email] + 1;
          } else {
            email[party.email] = 1;
          }
          return email;
        },
        {}
      );

      let can_continue = true;

      Object.entries(partyEmails).some(([email, count]) => {
        if (count > 1) {
          this.pushToast(
            `Duplicate email - ${email} found. Party shuold have unique emails`
          );
          can_continue = false;
        }
        return count > 1;
      });

      can_continue && this.$router.push("/escrow/payment");
    },

    checkPartyValidity(party) {
      return party.email;
    },

    addNewbroker() {
      const broker = {
        user_id: `broker-${this.$utils.getRandomString(10)}`,
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        is_initiator: false,
        role: "broker",
        role_description: "",
        pecentage: "",
        bank_account: {
          bank_name: "",
          bank_code: "",
          account_number: "",
          account_name: "",
        },
      };

      const saved_config = this.getTransactionConfig;
      let updated_parties = [...saved_config.parties, broker];

      const updated_config = {
        ...saved_config,
        parties: updated_parties,
      };

      this.UPDATE_TRANSACTION_CONFIG(updated_config);
    },

    updateParties(party) {
      const saved_config = this.getTransactionConfig;
      let updated_parties = saved_config.parties;

      updated_parties = updated_parties.map((item) =>
        party.user_id === item.user_id ? party : item
      );

      const updated_config = {
        ...saved_config,
        parties: updated_parties,
      };

      this.UPDATE_TRANSACTION_CONFIG(updated_config);
    },

    removeParty(party) {
      const saved_config = this.getTransactionConfig;
      let updated_parties = saved_config.parties;

      updated_parties = updated_parties.filter(
        (item) => item.user_id !== party.user_id
      );

      const updated_config = {
        ...saved_config,
        parties: updated_parties,
      };

      this.UPDATE_TRANSACTION_CONFIG(updated_config);
    },

    updateMilestone(milestone, index) {
      const saved_config = this.getTransactionConfig;
      let updated_milestones = saved_config.milestones;
      updated_milestones = updated_milestones.map((item, i) => {
        return i == index ? milestone : item;
      });

      const updated_config = {
        ...saved_config,
        milestones: updated_milestones,
      };

      this.UPDATE_TRANSACTION_CONFIG(updated_config);
    },

    deleteMilestone(milestone) {
      const saved_config = this.getTransactionConfig;

      let updated_milestones = saved_config.milestones.filter((item, index) => {
        return milestone.id !== item.id || index == 0;
      });

      const updated_config = {
        ...saved_config,
        milestones: updated_milestones,
      };

      this.UPDATE_TRANSACTION_CONFIG(updated_config);
    },

    addNewMilestone() {
      const saved_config = this.getTransactionConfig;
      const new_milestone = {
        title: "",
        amount: "",
        description: "",
        inspection_period: "",
        grace_period: "",
        due_date: "",
        saved: false,
        id: `milestone-${this.$utils.getRandomString(10)}`,
      };
      let updated_milestones = [...saved_config.milestones, new_milestone];

      const updated_config = {
        ...saved_config,
        milestones: updated_milestones,
      };

      this.UPDATE_TRANSACTION_CONFIG(updated_config);
    },
  },
};
</script>

<style lang="scss" scoped>
.button-row {
  @include flex-row-wrap("flex-start", "center");
  gap: toRem(20);
  margin-top: toRem(30);
}
</style>
