<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <!-- MERCHANT ICON -->
        <div class="merchant-icon">
          <img v-lazy="loadImage('merchant.png')" alt="merchant-icon" />
        </div>

        <div class="modal-cover-title">Welcome to MOR</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body"></div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button class="btn btn-primary btn-md wt-100">Save changes</button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "MerchantWelcomeModal",

  components: {
    ModalCover,
  },

  data() {
    return {};
  },

  methods: {},
};
</script>

<style></style>
