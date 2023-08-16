<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Select account currency</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <div class="form-label">Select currency</div>

          <!-- SELECT INPUT FIELD -->
          <DropSelectInput
            placeholder="Select wallet"
            :options="currency_options"
            @selectedOption="selectDropdownOption($event)"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          :disabled="selected_currency.short ? false : true"
          ref="save"
          class="btn btn-primary btn-md wt-100"
          @click="proceedToCreateAccount"
        >
          Proceed
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapGetters } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "SelectAccountCurrencyModal",

  components: {
    ModalCover,
  },

  computed: {
    ...mapGetters({
      getWalletSize: "general/getWalletSize",
    }),
  },

  data: () => ({
    currency_options: [],

    selected_currency: {
      slug: "", // naira
      short: "", // NGN
    },
  }),

  mounted() {
    this.loadWalletCurrencyOptions();
  },

  methods: {
    loadWalletCurrencyOptions() {
      this.getWalletSize
        .filter((wallet) => wallet.enabled && !wallet.short.includes("ESCROW"))
        .map((wallet_type) => {
          this.currency_options.push({
            id: wallet_type.id,
            name: `${wallet_type.long} wallet (${wallet_type.short})`,
            slug: wallet_type.long.toLowerCase(),
            short: wallet_type.short,
            country: wallet_type.code.toUpperCase(),
          });
        });
    },

    // ========================================
    // SELECT OPTION FROM OPTION LIST
    // ========================================
    selectDropdownOption(value) {
      this.selected_currency = this.currency_options.find(
        (option) => option.id === value
      );
    },

    proceedToCreateAccount() {
      this.$emit("selectCurrency", this.selected_currency);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  min-height: toRem(110);
  overflow: unset;
  height: auto;
}
</style>
