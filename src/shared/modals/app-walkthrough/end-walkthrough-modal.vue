<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    :show_close_btn="false"
    :trigger_self_close="false"
    :place_center="true"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title text-center mgt-5 mgb--10">That’s it</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <p>Fund your account or create your first Escrow transaction</p>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button class="btn btn-primary btn-md mx-auto" @click="$emit('endTour')">Get started</button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapGetters } from "vuex";
import ModalCover from "@/shared/components/modal-cover";

export default {
  name: "endWalkthroughModal",

  components: {
    ModalCover,
  },

  computed: {
    ...mapGetters({}),
  },

  data: () => ({}),

  methods: {},
};
</script>

<style lang="scss" scoped>
.modal-cover-title {
  font-size: toRem(18.5);
}

.modal-cover-body {
  min-height: toRem(35);
  @include flex-row-center-wrap;

  p {
    @include generate-font-type("tertiary-1");
    color: getColor("grey-700");
    line-height: toRem(24);
    text-align: center;
    width: 98%;
  }
}
</style>