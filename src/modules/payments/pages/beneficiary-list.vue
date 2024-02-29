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
      <PageSwitcher
        :page_data="pages"
        :full_width="false"
        remove_margin
        @swapItem="switchPageView($event)"
      />

      <button class="btn btn-primary btn-md" @click="toggleBeneficiaryModal()">
        <div class="text">Add Beneficiary</div>
      </button>
    </div>

    <!-- BENEFICIARY LIST TABLE -->
    <component
      :is="
        active_view === 'single'
          ? 'BeneficiarySingleTable'
          : 'BeneficiaryGroupTable'
      "
    />

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_beneficiary_dialog">
        <NewBeneficiaryModal
          :show_page_switcher="false"
          :default_active_view="
            active_view === 'single' ? 'SingleBeneficiary' : 'GroupBeneficiary'
          "
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
  name: "BeneficiaryList",

  components: {
    PageBackBtn,
    PageSwitcher,
    BeneficiarySingleTable: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/components/beneficiary-single-table"
      ),
    BeneficiaryGroupTable: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/components/beneficiary-group-table"
      ),
    NewBeneficiaryModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/beneficiary-modal/new-beneficiary-modal"
      ),
  },

  watch: {
    $route: {
      handler(value) {
        if (value.query.page === "group") this.active_view = "group";
        else this.active_view = "single";

        if (value.query.refresh && this.show_beneficiary_dialog) {
          this.show_beneficiary_dialog = false;
        }

        this.pages.map((page) => (page.active = false));
        this.pages.find(
          (page) => page.value === this.active_view
        ).active = true;
      },
      immediate: true,
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

    switchPageView(page) {
      this.active_view = page;
      this.$router.replace({ query: { page } }).catch((error) => {
        if (error.name != "NavigationDuplicated") throw error;
      });
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