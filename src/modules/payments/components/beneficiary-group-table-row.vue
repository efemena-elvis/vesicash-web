<template>
  <tr>
    <td class="body-data" :class="`${table_name}-1`">{{ data.name }}</td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ data.number_of_recipients }}
    </td>

    <td class="body-data" :class="`${table_name}-3`">{{ getCreatedDate }}</td>

    <td class="body-data" :class="`${table_name}-4`">
      <div class="d-flex justify-content-start">
        <button
          class="btn btn-secondary btn-sm mgr-12"
          @click="viewGroupBeneficiaries()"
        >
          View
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
          is_group
          @closeAndRelaodPage="closeDialogEmitDataFetch"
          @closeTriggered="toggleDeleteModal"
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
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/payments/modals/delete-account-modal"
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
    getCreatedDate() {
      let { w2, d3, m4, y1 } = this.$date
        .formatDate(this.data?.created_at)
        .getAll();

      return `${w2}, ${d3} ${m4} ${y1}`;
    },
  },

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

    viewGroupBeneficiaries() {
      this.$router.push({
        name: "GroupBeneficiary",
        query: { name: this.data.name, group_id: this.data.id },
      });
    },
  },
};
</script>
      
<style></style>
      