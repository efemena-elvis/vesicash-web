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
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "SelectAccountCurrencyModal",

  components: {
    ModalCover,
  },

  data: () => ({
    currency_options: [
      {
        id: 1,
        name: "Naira wallet (NGN)",
        slug: "naira",
        short: "NGN",
        min_amount: 1000,
      },
      {
        id: 2,
        name: "Dollar wallet (USD)",
        slug: "dollar",
        short: "USD",
        min_amount: 100,
      },
      // { id: 3, name: "GBP (£)", slug: "pound", short: "GPB" },
    ],

    selected_currency: {
      slug: "", // naira
      short: "", // NGN
    },
  }),

  methods: {
    // ========================================
    // SELECT OPTION FROM OPTION LIST
    // ========================================
    selectDropdownOption(value) {
      this.selected_currency = this.currency_options.find(
        (option) => option.id === value
      );
    },

    proceedToCreateAccount() {
      this.$emit("selectCurrency", this.selected_currency.short);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  min-height: toRem(110);
  height: auto;
}
</style>
