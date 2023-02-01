<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-md' }"
    :show_close_btn="false"
    :trigger_self_close="false"
    :place_center="true"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title text-center mgt-5 mgb--10">
          Welcome onboard!
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body mgb-5">
        <p>
          We are here to ensure that payments for and by your business; local or
          international, are secure, seamless and risk-free . Enjoy instant
          access to foreign exchange, digital escrow, global remittance solution
          and a host of solutions to ease your payment friction points.
        </p>

        <p>
          We’ll guide you with a short walkthrough of your Dashboard so you know
          right where everything you need is.😊<br />
          Let’s get started!
        </p>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button class="btn btn-primary btn-md wt-100" @click="startWalkthrough">
          Let's get started
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapMutations } from "vuex";
import ModalCover from "@/shared/components/modal-cover";

export default {
  name: "startWalkthroughModal",

  components: {
    ModalCover,
  },

  methods: {
    ...mapMutations({ UPDATE_TOUR_FLOW: "general/UPDATE_TOUR_FLOW" }),

    // START TOUR WALKTHROUGH
    startWalkthrough() {
      setTimeout(() => {
        this.$emit("closeTriggered");
        this.UPDATE_TOUR_FLOW(1);
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-title {
  font-size: toRem(18.5);
}

.modal-cover-body {
  @include flex-row-center-wrap;

  p {
    @include generate-font-type("tertiary-1");
    color: getColor("grey-700");
    line-height: toRem(24);
    text-align: center;
    width: 95%;
  }
}
</style>