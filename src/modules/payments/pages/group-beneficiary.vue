<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mgb-40">
      <PageBackBtn :history_mode="true" btn_text="Back" classStyle="mgb-0" />

      <!-- <button
        class="btn btn-primary btn-md"
        @click="$router.push('/payments/send-money')"
      >
        <div class="text">Send Money</div>
      </button> -->
    </div>

    <!-- TOP ROW -->
    <div class="top-row mgb-40">
      <div class="group-name h4-text">
        {{ $route.query.name || "Group name" }}
      </div>

      <button class="btn btn-primary btn-md" @click="toggleBeneficiaryModal()">
        <div class="text">Add Beneficiary</div>
      </button>
    </div>

    <!-- GROUP BENEFICIARY TABLE -->
    <GroupTable @addGroupBeneficiary="toggleBeneficiaryModal()" />

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_beneficiary_dialog">
        <NewBeneficiaryModal
          is_group
          :is_base_page="false"
          modal_size="modal-mid"
          @closeTriggered="toggleBeneficiaryModal()"
        />
      </transition>
    </portal>
  </div>
</template>
    
<script>
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";

export default {
  name: "GroupBeneficiary",

  components: {
    PageBackBtn,
    PageSwitcher,
    GroupTable: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/components/group-table"
      ),
    NewBeneficiaryModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/beneficiary-modal/new-beneficiary-modal"
      ),
  },

  computed: {
    getGroupName() {
      this.$route.query?.name ?? "Group name";
    },
  },

  data() {
    return {
      show_beneficiary_dialog: false,
      active_view: "single",

      pages: [
        {
          title: "Single Beneficiaries",
          value: "single",
          active: true,
        },
        {
          title: "Grouped Beneficiaries",
          value: "group",
          active: false,
        },
      ],
    };
  },

  methods: {
    toggleBeneficiaryModal() {
      this.show_beneficiary_dialog = !this.show_beneficiary_dialog;
    },
  },
};
</script>
    
<style scoped lang="scss">
.top-row {
  @include flex-row-wrap("space-between", "center");
  column-gap: toRem(12);
  row-gap: toRem(12);
}
</style>