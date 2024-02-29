<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">
          Delete {{ is_group ? "group" : "account" }}
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <template v-if="is_group">
          <ModalListItem title="Group name" :value="account_data.name" />
          <ModalListItem
            title="Number of recipients"
            :value="account_data.number_of_recipients"
          />
        </template>

        <template v-else>
          <ModalListItem
            title="Account name"
            :value="account_data.account_name"
          />
          <ModalListItem
            title="Account number"
            :value="account_data.account_no"
          />
          <ModalListItem title="Bank name" :value="account_data.bank_name" />
        </template>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <div class="btn-wrapper mgt-17">
          <button
            ref="btnRef"
            class="btn btn-primary btn-md wt-100"
            @click="deleteAccount"
          >
            <span class="icon icon-trash mgr-11"></span>
            Delete {{ is_group ? "group" : "account" }}
          </button>
        </div>
      </div>
    </template>
  </ModalCover>
</template>
  
  <script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";
import ModalListItem from "@/modules/dashboard/components/modal-comps/modal-list-item";

export default {
  name: "DeleteAccountModal",

  props: {
    account_data: {
      type: Object,
      default: () => ({}),
    },

    is_group: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    ModalCover,
    ModalListItem,
  },

  computed: {
    deletePayload() {
      return {
        id: this.account_data.id,
      };
    },
  },

  methods: {
    ...mapActions({
      removeUserBank: "settings/removeUserBank",
      removeUserBankGroup: "settings/removeUserBankGroup",
    }),

    async deleteAccount() {
      const response = await this.handleDataRequest({
        action: this.is_group ? "removeUserBankGroup" : "removeUserBank",
        payload: this.deletePayload,
        btn_text: "Delete account",
        alert_handler: {
          success: `Beneficiary ${
            this.is_group ? "group" : "account"
          } deleted successfully`,
          error: "Unable to delete beneficiary account",
          request_error: "Unable to delete beneficiary account",
        },
      });

      if (response.code === 200) {
        setTimeout(() => this.$emit("closeAndRelaodPage"), 1000);
      }
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.btn-wrapper {
  @include flex-row-nowrap("flex-start", "center");
  gap: toRem(24);

  .btn {
    transition: background ease-in-out 0.3s !important;
  }

  @include breakpoint-custom-down(780) {
    @include flex-row-wrap("flex-start", "center");

    .btn-primary {
      order: 1;
    }

    .btn-secondary {
      order: 2;
    }
  }
}
</style>
  