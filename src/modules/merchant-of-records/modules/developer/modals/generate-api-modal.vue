<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Generate API keys</div>
        <div class="modal-cover-meta">
          Generate api keys for your environment
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <!-- SELECT ENVIRONMENT -->
        <div class="form-group">
          <div class="form-label">Select enviroment</div>
          <DropSelectInput
            placeholder="Select environment"
            @selectedOption="selectUserOption($event)"
            :options="environment_options"
          />
        </div>

        <!-- SELECT ENVIRONMENT KEY TYPES -->
        <div class="form-group">
          <div class="form-label">Generate key types</div>

          <!-- PUBLIC KEYS -->
          <label class="key-row mgb-16" for="publicKey">
            <input type="checkbox" id="publicKey" />
            <div class="key-text">Public keys</div>
          </label>

          <!-- PRIVATE KEYS -->
          <label class="key-row" for="privateKey">
            <input type="checkbox" id="privateKey" />
            <div class="key-text">Private keys</div>
          </label>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button class="btn btn-primary btn-md wt-100">Generate Keys</button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "GenerateAPIModal",

  components: {
    ModalCover,
  },

  data() {
    return {
      environment_options: [
        {
          id: 1,
          name: "Live environment",
          slug: "live",
        },
        {
          id: 2,
          name: "Test environment",
          slug: "test",
        },
      ],
    };
  },

  methods: {
    selectUserOption(selection) {
      console.log(selection);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  .key-row {
    @include flex-row-nowrap("flex-start", "center");
    border: toRem(1) solid getColor("grey-100");
    padding: toRem(8) toRem(16);
    border-radius: toRem(8);
    cursor: pointer;

    input {
      margin-right: toRem(8);
    }

    .key-text {
      @include generate-font-type("tertiary-2");
      color: getColor("grey-900");
    }
  }
}
</style>
