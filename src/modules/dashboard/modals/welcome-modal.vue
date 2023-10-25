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
      <div class="modal-cover-header p-0 teal-900-bg rounded-top-15">
        <img :src="loadImage('dashboard.png', 'dashboard')" alt="" />
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body mgb-5">
        <div class="modal-cover-title text-center mgt-2 mgb-5">
          Welcome onboard!
        </div>

        <p>
          Enjoy instant access to both local and international markets via our
          Merchant of Records service. Let's get you onboarded.
        </p>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer mgb-5">
        <button class="btn btn-primary btn-md wt-100" @click="startOnboarding">
          Let's get started
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapMutations } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "welcomeModal",

  components: {
    ModalCover,
  },

  methods: {
    ...mapMutations({ UPDATE_TOUR_FLOW: "general/UPDATE_TOUR_FLOW" }),

    // START ONBOARDING
    startOnboarding() {
      setTimeout(() => this.$emit("closeDialog"), 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-header {
  position: relative;
  height: toRem(260);

  @include breakpoint-down(sm) {
    height: toRem(240);
  }

  @include breakpoint-down(xs) {
    height: toRem(220);
  }

  @include breakpoint-custom-down(380) {
    height: toRem(200);
  }

  img {
    @include center-placement("x-axis");
    width: 70%;
    height: auto;
    bottom: 0;

    @include breakpoint-down(sm) {
      width: 75%;
    }

    @include breakpoint-down(xs) {
      width: toRem(320);
    }

    @include breakpoint-custom-down(380) {
      width: toRem(300);
    }
  }
}

.modal-cover-title {
  font-size: toRem(18.5);
}

.modal-cover-body {
  @include flex-row-wrap("center", "center");

  @include breakpoint-down(xs) {
    margin-bottom: toRem(-18) !important;
  }

  p {
    @include generate-font-type("tertiary-1");
    color: getColor("grey-700");
    line-height: toRem(24);
    text-align: center;
    width: 95%;
  }
}
</style>
