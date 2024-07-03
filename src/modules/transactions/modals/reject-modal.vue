x
<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header"></template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body mgb-20">
        <!-- ICON WRAPPER -->
        <div class="user-icon-wrapper rounded-circle teal-50-bg mgt-10 mgb-24">
          <CrossIcon />
        </div>

        <!-- TITLE TEXT -->
        <div class="secondary-1-text grey-900 text-center mgb-8 w-100">
          {{ title }}
        </div>

        <label for="reject" class="form-label mgt-20 w-100"
          >Reason(optional)</label
        >
        <textarea
          name="reject"
          id="reject"
          cols="30"
          rows="3"
          class="form-control mgt-0"
          v-model="reason"
          :placeholder="placeholder"
        ></textarea>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          class="btn btn-alert btn-md wt-100"
          ref="rejectBtn"
          @click="$emit('rejected', reason)"
        >
          Reject
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import CrossIcon from "../../../shared/components/icon-comps/cross-icon.vue";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "RejectModal",

  components: {
    ModalCover,
    CrossIcon,
  },

  props: {
    title: {
      type: String,
      default: "Why do you want to reject this transaction?",
    },

    placeholder: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      reason: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @include flex-column("center", "center");

  .user-icon-wrapper {
    @include flex-column("center", "center");
    @include draw-shape(55);
    position: relative;

    svg {
      @include draw-shape(64);
    }
  }

  .description-text {
    @include font-height(14.75, 24);
    width: 90%;
  }
}
</style>
