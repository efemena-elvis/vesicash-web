<template>
  <ModalCover
    :show_close_btn="false"
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    :trigger_self_close="false"
    :place_center="true"
  >
    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="success-icon-wrapper">
          <CheckIcon />
        </div>

        <div class="h4-text grey-900 text-center mgb-8">Congratulations</div>
        <div class="tertiary-1-text grey-900 text-center mgb-16">
          You have successfully completed your onboarding, proceed to your
          dashboard to enjoy the experience.
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer footer-wrapper">
        <button @click="goToDashboard" class="btn btn-primary btn-md wt-100">
          Dashboard
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "congratModal",

  components: {
    ModalCover,
    CheckIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/check-icon"
      ),
  },

  data: () => ({
    confetti_colors: [
      "#65CD82",
      "#3AB75D",
      "#043B56",
      "#0E89C6",
      "#2C9A4B",
      "#B3E4FB",
      "#011A27",
      "#89D5FB",
      "#8DDCA2",
    ],
  }),

  mounted() {
    this.startConfetti();
    setTimeout(() => this.endConfetti(), 2000);
  },

  methods: {
    startConfetti() {
      this.$confetti.start({
        particles: [
          {
            type: "heart",
          },
        ],
        defaultColors: this.confetti_colors,
      });
    },

    endConfetti() {
      this.$confetti.stop();
    },

    goToDashboard() {
      location.href = "/dashboard";
    },
  },
};
</script>

<style lang="scss" scoped>
.success-icon-wrapper {
  @include flex-column("center", "center");
  background: getColor("teal-800");
  margin: 0 auto toRem(24) auto;
  @include draw-shape(120);
  border-radius: 50%;
}
</style>
