<template>
  <tr>
    <td class="body-data" :class="`${table_name}-1`">
      {{ data.account_name }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">{{ data.account_no }}</td>

    <td class="body-data" :class="`${table_name}-3`">{{ data.bank_name }}</td>

    <td class="body-data fw-medium" :class="`${table_name}-4`">
      {{ getFormattedAmount }}
    </td>

    <td class="body-data" :class="`${table_name}-5`">
      <div class="d-flex justify-content-start">
        <button
          class="btn btn-secondary btn-sm mgr-12"
          @click="toggleUpdateModal()"
        >
          Edit
        </button>
        <button class="btn btn-secondary btn-sm" @click="toggleDeleteModal()">
          Delete
        </button>
      </div>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_delete_modal">
        <DeleteAccountModal
          :account_data="data"
          @closeAndRelaodPage="closeDialogEmitDataFetch"
          @closeTriggered="toggleDeleteModal"
        />
      </transition>

      <transition name="fade" v-if="show_update_modal">
        <UpdateBeneficiaryModal
          :account_data="data"
          @closeAndRelaodPage="closeDialogEmitDataFetch"
          @closeTriggered="toggleUpdateModal"
        />
      </transition>
    </portal>
  </tr>
</template>
        
  <script>
export default {
  name: "BeneficiaryGroupTableRow",

  components: {
    DeleteAccountModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/delete-account-modal"
      ),
    UpdateBeneficiaryModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/update-beneficiary-modal"
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
    getFormattedAmount() {
      return `${this.$utils.formatCurrency({
        input: this.data.currency,
        output: "sign",
      })}
       ${this.$utils.formatCurrencyWithComma(this.data.amount, true)}`;
    },
  },

  data: () => ({
    show_delete_modal: false,
    show_update_modal: false,
  }),

  methods: {
    toggleDeleteModal() {
      this.show_delete_modal = !this.show_delete_modal;
    },

    toggleUpdateModal() {
      this.show_update_modal = !this.show_update_modal;
    },

    closeDialogEmitDataFetch() {
      this.show_delete_modal = false;
      this.show_update_modal = false;

      this.$emit("refetchData");
    },
  },
};
</script>
        
  <style></style>
        