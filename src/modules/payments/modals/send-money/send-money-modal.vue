<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    :trigger_self_close="false"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">{{ getModalTitle }}</div>

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
        <component
          :is="active_view"
          @closeTriggered="$emit('closeTriggered')"
        />
      </div>
    </template>
  </ModalCover>
</template>
    
<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";

export default {
  name: "SendMoneyModal",

  components: {
    ModalCover,
    PageSwitcher,
    SendSingleAccount: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/send-money/send-single-account"
      ),
    SendMultipleAccount: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/send-money/send-multiple-account"
      ),
    SendGroupAccount: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/send-money/send-group-account"
      ),
    SendUploadAccount: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/send-money/send-upload-account"
      ),
  },

  props: {
    show_page_switcher: {
      type: Boolean,
      default: true,
    },

    default_active_view: {
      type: String,
      default: "",
    },
  },

  computed: {
    getModalTitle() {
      if (this.active_view === "SendSingleAccount") return "Add Account";
      else if (this.active_view === "SendMultipleAccount")
        return "Select Beneficiary";
      else if (this.active_view === "SendGroupAccount") return "Select Group";
      else if (this.active_view === "SendUploadAccount")
        return "Upload Beneficiary";
      else return "Add Account";
    },
  },

  data() {
    return {
      active_view: this.default_active_view,

      pages: [
        {
          title: "Existing beneficiary",
          value: "SendMultipleAccount",
          active: true,
        },
        {
          title: "Group Beneficiary",
          value: "SendGroupAccount",
          active: false,
        },
      ],
    };
  },
};
</script>