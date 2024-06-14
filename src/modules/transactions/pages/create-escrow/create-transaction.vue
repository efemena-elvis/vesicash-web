<template>
  <div class="pdb-40">
    <div class="selections mgy-30">
      <div class="selection-title h5-text">Create escrow as</div>
      <div class="selection-card" @click="user_type = 'seller'">
        <OptionCard
          :selected="user_type === 'seller'"
          title="Someone providing a service"
        />
      </div>
      <div class="selection-card" @click="user_type = 'buyer'">
        <OptionCard
          :selected="user_type === 'buyer'"
          title="Someone receiving a service"
        />
      </div>
      <div class="selection-card" @click="user_type = 'broker'">
        <OptionCard :selected="user_type === 'broker'" title="A broker" />
      </div>
    </div>
    <button
      class="btn btn-md btn-primary"
      :disabled="!user_type"
      @click="proceed"
    >
      Proceed
    </button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import OptionCard from "@/shared/components/card-comps/option-card";
export default {
  name: "CreateEscrowPage",

  components: {
    OptionCard,
  },

  data() {
    return {
      user_type: "",
    };
  },

  computed: {
    ...mapGetters({
      getTransactionConfig: "transactions/getTransactionConfig",
    }),

    otherParties() {
      const other_parties = this.getTransactionConfig?.parties?.find(
        (party) => !party?.is_initiator
      );

      if (other_parties) return [];

      if (["buyer", "seller"].includes(this.user_type))
        return [
          {
            user_id:
              this.user_type === "buyer"
                ? `seller-${this.$utils.getRandomString(10)}`
                : `buyer-${this.$utils.getRandomString(10)}`,
            email: "",
            first_name: "",
            last_name: "",
            phone: "",
            is_initiator: false,
            role: this.user_type === "buyer" ? "seller" : "buyer",
            role_description: "",
            bank_account: {
              bank_name: "",
              bank_code: "",
              account_number: "",
              account_name: "",
            },
          },
        ];
      else
        return [
          {
            user_id: `buyer-${this.$utils.getRandomString(10)}`,
            email: "",
            first_name: "",
            last_name: "",
            phone: "",
            is_initiator: false,
            role: "buyer",
            role_description: "",
            bank_account: {
              bank_name: "",
              bank_code: "",
              account_number: "",
              account_name: "",
            },
          },
          {
            user_id: `seller-${this.$utils.getRandomString(10)}`,
            email: "",
            first_name: "",
            last_name: "",
            phone: "",
            is_initiator: false,
            role: "seller",
            role_description: "",
            bank_account: {
              bank_name: "",
              bank_code: "",
              account_number: "",
              account_name: "",
            },
          },
        ];
    },
  },

  watch: {
    getTransactionConfig: {
      handler(config) {
        if (!config) return;
        const initiator = config.parties.find((party) => party.is_initiator);
        if (initiator?.role) this.user_type = initiator.role;
      },
      immediate: true,
    },

    user_type: {
      handler(type) {
        if (type) {
          // RESTART ON CHANGING USER TYPE
          this.RESET_CONFIG();
        }
      },
    },
  },

  methods: {
    ...mapMutations({
      UPDATE_TRANSACTION_CONFIG: "transactions/UPDATE_TRANSACTION_CONFIG",
      RESET_CONFIG: "transactions/CLEAR_TRANSACTION_CONFIG",
    }),

    proceed() {
      const saved_config = this.getTransactionConfig;
      const { email, fullname, phone } = this.getUser;
      const user_id = `${this.getAccountId}`;

      let initiator = {
        user_id,
        email,
        first_name: fullname?.split(" ")?.[0],
        last_name: fullname?.split(" ")?.[1],
        phone,
        is_initiator: true,
        role: this.user_type,
        role_description: this.user_type,
        bank_account: {
          bank_name: "",
          bank_code: "",
          account_number: "",
          account_name: "",
        },
      };

      if (initiator.role === "broker") initiator.percentage = "";

      const hasInitiator = saved_config?.parties?.some(
        (party) => party?.is_initiator
      );

      let updated_parties = [...saved_config?.parties, ...this.otherParties];

      if (hasInitiator) {
        updated_parties = updated_parties?.map((party) => {
          if (party.is_initiator) return initiator;
          return party;
        });
      } else updated_parties = [initiator, ...updated_parties];

      const updated_config = {
        ...saved_config,
        parties: updated_parties,
      };

      this.UPDATE_TRANSACTION_CONFIG(updated_config);
      this.$router?.push("/escrow/transaction-details");
    },
  },
};
</script>

<style lang="scss" scoped>
.selections {
  display: grid;
  gap: toRem(30);
  grid-template-columns: repeat(auto-fill, minmax(toRem(210), 1fr));
  max-width: toRem(936);
  background: getColor("teal-50");
  border: toRem(1) solid getColor("grey-100");
  border-radius: toRem(15);
  padding: toRem(30);

  .selection-title {
    grid-column: 1/-1;
  }

  .selection-card {
    width: 100%;
    aspect-ratio: 1;
    max-height: toRem(210);
  }
}
</style>
