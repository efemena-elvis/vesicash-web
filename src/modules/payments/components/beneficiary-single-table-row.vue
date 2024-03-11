<template>
  <tr @click="toggleDeleteModal">
    <!-- <td class="body-data" :class="`${table_name}-1`">
      <input type="checkbox" class="sm-size" v-model="item_checked" />
    </td> -->

    <td class="body-data" :class="`${table_name}-2`">
      {{ data.account_name }}
    </td>

    <td class="body-data" :class="`${table_name}-3`">{{ data.account_no }}</td>

    <td class="body-data" :class="`${table_name}-4`">{{ data.bank_name }}</td>

    <td class="body-data delete-item" :class="`${table_name}-5`">
      <button class="btn btn-secondary btn-sm delete-item">Delete</button>
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
import { mapActions } from "vuex";

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
    item_checked: false,
  }),

  methods: {
    ...mapActions({
      updateTempAccount: "payments/updateTempAccount",
      clearOutTempAccount: "payments/clearOutTempAccount",
    }),

    toggleDeleteModal() {
      this.show_delete_modal = !this.show_delete_modal;
    },

    closeDialogEmitDataFetch() {
      this.show_delete_modal = false;
      this.$emit("refetchData");
    },

    // tableRowClicked($event) {
    //   const itemClass = Array.from($event.target.classList);

    //   if (itemClass.includes("delete-item")) this.toggleDeleteModal();
    //   else {
    //     this.item_checked = !this.item_checked;
    //     this.updateTempAccount(this.data);
    //   }
    // },
  },
};
</script>
    
<style></style>
    