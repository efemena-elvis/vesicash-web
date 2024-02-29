<template>
  <tr @click="toggleDeleteModal">
    <td class="body-data" :class="`${table_name}-1`">
      {{ data.account_name }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">{{ data.account_no }}</td>

    <td class="body-data" :class="`${table_name}-3`">{{ data.bank_name }}</td>

    <td class="body-data" :class="`${table_name}-4`">
      <button class="btn btn-secondary btn-sm">Delete</button>
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
    </portal>
  </tr>
</template>
    
    <script>
export default {
  name: "BeneficiarySingleTableRow",

  components: {
    DeleteAccountModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/delete-account-modal"
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

  computed: {},

  data: () => ({
    show_delete_modal: false,
  }),

  methods: {
    toggleDeleteModal() {
      this.show_delete_modal = !this.show_delete_modal;
    },

    closeDialogEmitDataFetch() {
      this.show_delete_modal = false;
      this.$emit("refetchData");
    },
  },
};
</script>
    
<style></style>
    