<template>
  <div class="txn-details">
    <div class="card">
      <BasicInput
        label_title="Transaction name"
        label_id="txn_name"
        :input_value="form.txn_name"
        input_type="text"
        is_required
        placeholder="Enter transaction name"
        @getInputState="updateFormState($event, 'txn_name')"
        :error_handler="{
          type: 'required',
          message: 'Enter transaction name',
        }"
      />
      <div>
        <div class="form-label">Select payment currency</div>

        <!-- SELECT INPUT FIELD -->
        <DropSelectInput
          placeholder="Currency"
          :options="currencies"
          :pre_select="configCurrency"
          @optionSelected="currency = $event"
        />
      </div>
    </div>

    <div class="card mgt-40">
      <div class="secondary-2-text dispute-title">
        How may any dispute be handled?
      </div>

      <RadioSelectCard
        label_id="vesicash_dispute"
        label_text="Vesicash handles dispute"
        card_name="dispute"
        :is_checked="dispute_handler == 'vesicash_dispute'"
        @checked="dispute_handler = 'vesicash_dispute'"
      />

      <RadioSelectCard
        label_id="arbitrator_dispute"
        label_text="Arbitrator handles dispute"
        card_name="dispute"
        :is_checked="dispute_handler == 'arbitrator_dispute'"
        @checked="dispute_handler = 'arbitrator_dispute'"
      />
    </div>

    <div class="grey-500 tertiary-2-text mgt-20 mgb-40">
      Note: Make sure your account is funded with the right amount for the
      escrow transaction before you click on Proceed. To fund, go to Dashboard
      on the side panel and click on Fund wallet.
    </div>
    <button
      class="btn btn-md btn-primary"
      :disabled="disabled"
      @click="proceed"
    >
      Proceed
    </button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import countries from "@/utilities/countries";
export default {
  name: "EscrowDetailsPage",

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

    configCurrency() {
      const config = this.getTransactionConfig;
      if (!config) return null;
      const currency = this.currencies?.find(
        (cc) => config.currency === cc.currency.short
      );
      return currency;
    },

    disabled() {
      return !this.form.txn_name || !this.currency || !this.dispute_handler;
    },
  },

  watch: {
    getTransactionConfig: {
      handler(config) {
        if (!config) return;
        this.form.txn_name = config?.title || "";
        this.dispute_handler = config?.dispute_handler;
        if (!this.currency) this.currency = this.configCurrency;
      },
      immediate: true,
    },
  },

  components: {
    RadioSelectCard: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/card-comps/radio-select-card"
      ),
  },

  data() {
    return {
      currency: null,
      dispute_handler: null,
      form: {
        txn_name: "",
      },
    };
  },

  methods: {
    ...mapMutations({
      UPDATE_TRANSACTION_CONFIG: "transactions/UPDATE_TRANSACTION_CONFIG",
    }),

    proceed() {
      const saved_config = this.getTransactionConfig;
      const {
        currency: { short },
      } = this.currency;

      const updated_config = {
        ...saved_config,
        title: this.form.txn_name,
        description: this.form.txn_name,
        currency: short,
        dispute_handler: this.dispute_handler,
      };

      this.UPDATE_TRANSACTION_CONFIG(updated_config);
      this.$router?.push("/escrow/disbursement-details");
    },
  },
};
</script>

<style lang="scss" scoped>
.txn-details {
  max-width: toRem(900);
  margin-top: toRem(40);
  padding-bottom: toRem(60);

  .card {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(toRem(352), 1fr));
    gap: toRem(30);
    border-radius: toRem(15);
    padding: toRem(20);
    border: toRem(1) solid getColor("grey-100");
  }
  .dispute-title {
    grid-column: 1/-1;
  }
}
</style>
