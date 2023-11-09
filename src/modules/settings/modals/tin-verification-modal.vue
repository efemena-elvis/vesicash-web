<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Tax Identification</div>
        <div class="tertiary-2-text grey-600 mgt-4">
          Verify your company tax identification registration number
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <BasicInput
            label_title="Tax identification number"
            label_id="doc-number"
            :input_value="form.doc_number"
            is_required
            placeholder="Enter identification number"
            @getInputState="updateFormState($event, 'doc_number')"
            :error_handler="{
              type: 'required',
              message: 'Enter tax identification number',
            }"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          ref="save"
          class="btn btn-primary btn-md wt-100"
          :disabled="isDisabled"
          @click="save"
        >
          Submit
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "TinVerificationModal",

  components: {
    ModalCover,
  },

  computed: {
    isDisabled() {
      return this.form.doc_number ? false : true;
    },

    verfiyDocPayload() {
      return {
        type: this.form.type,
        id: this.form.doc_number,
      };
    },
  },

  data() {
    return {
      form: {
        type: "tin",
        doc_number: "",
      },

      validity: {
        doc_number: true,
      },
    };
  },

  methods: {
    ...mapActions({
      verfiyUserDocument: "settings/verfiyUserDocument",
    }),

    async save() {
      this.handleClick("save");

      try {
        const response = await this.verfiyUserDocument(this.verfiyDocPayload);

        this.handleClick("save", "Submit", false);

        if (response?.code === 200) {
          this.pushToast("Your TIN has been submitted", "success");

          this.$emit("saved", "Your TIN has been submitted successfully");

          setTimeout(() => this.$emit("closeTriggered"), 3000);
        } else {
          this.pushToast(response.message, "error");
        }
      } catch (err) {
        this.handleClick("save", "Submit", false);
        this.pushToast("Failed to submit TIN", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  min-height: 6vh !important;
  max-height: 65vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 2px;
  }
}
</style>
