<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: modal_size }"
    :trigger_self_close="false"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">
          Add Beneficiary
          <span class="f-size-14 grey-700 fw-medium">{{
            $route.query.name ? `(${$route.query.name})` : ""
          }}</span>
        </div>

        <div class="mgt-18 mgb--16" v-if="show_page_switcher">
          <PageSwitcher
            :page_data="pages"
            :full_width="false"
            @swapItem="active_view = $event"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <component :is="active_view" @closeTriggerd="$emit('closeTriggered')" />
      </div>
    </template>
  </ModalCover>
</template>
  
<script>
import PageSwitcher from "@/shared/components/util-comps/page-switcher";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "newBeneficiaryModal",

  components: {
    ModalCover,
    PageSwitcher,
    SingleBeneficiary: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/beneficiary-modal/single-beneficiary"
      ),
    GroupBeneficiary: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/beneficiary-modal/group-beneficiary"
      ),
    UploadBeneficiary: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/beneficiary-modal/upload-beneficiary"
      ),
    ExistingBeneficiary: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/beneficiary-modal/existing-beneficiary"
      ),
  },

  props: {
    is_group: {
      type: Boolean,
      default: false,
    },

    show_page_switcher: {
      type: Boolean,
      default: true,
    },

    default_active_view: {
      type: String,
      default: "",
    },

    is_base_page: {
      type: Boolean,
      default: true,
    },

    modal_size: {
      type: String,
      default: "modal-sm",
    },
  },

  computed: {
    getActiveView() {},
  },

  created() {
    this.setupPageView();
  },

  data() {
    return {
      active_view: "",
      pages: [],

      base_pages: [
        {
          title: "Single account",
          value: "SingleBeneficiary",
          active: true,
        },
        {
          title: "Multiple accounts",
          value: "GroupBeneficiary",
          active: false,
        },
      ],

      group_pages: [
        {
          title: "Upload file",
          value: "UploadBeneficiary",
          active: true,
        },
        {
          title: "Existing beneficiary",
          value: "ExistingBeneficiary",
          active: false,
        },
        {
          title: "Manual Entry",
          value: "SingleBeneficiary",
          active: false,
        },
      ],
    };
  },
  methods: {
    setupPageView() {
      this.pages = this.is_base_page
        ? [...this.base_pages]
        : [...this.group_pages];

      this.active_view = this.default_active_view
        ? this.default_active_view
        : this.pages[0].value;
    },
  },
};
</script>
  