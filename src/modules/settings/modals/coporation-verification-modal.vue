<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    class="doc-verification-overlay"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Company Verification</div>
        <div class="tertiary-2-text grey-600">
          Upload your company registration document
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <BasicInput
            label_title="Company registration number"
            label_id="doc-number"
            :input_value="form.doc_number"
            is_required
            placeholder="Enter registration number"
            @getInputState="updateFormState($event, 'doc_number')"
            :error_handler="{
              type: 'required',
              message: 'Enter company registration number',
            }"
          />
        </div>

        <ContractUploadCard
          titleText="Select company registration document"
          @fileUploaded="uploaded_doc = $event"
          @clearTransactionFile="uploaded_doc = null"
        />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          ref="save"
          class="btn btn-primary btn-md wt-100 mgt-17"
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
import { mapActions, mapGetters } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "CoporationVerificationModal",

  components: {
    ModalCover,
  },

  computed: {
    ...mapGetters({
      getFileData: "general/getFileData",
      getAllFilesData: "general/getAllFilesData",
    }),

    isBusiness() {
      return this.getAccountType === "business" ? true : false;
    },

    getVerificationDoc() {
      const file_data = this.getAllFilesData.find(
        (doc) => doc.id === "cac_document"
      );
      return file_data === undefined ? null : file_data;
    },

    VerificationDocExist() {
      return this.getVerificationDoc?.files?.length ? true : false;
    },

    isDisabled() {
      return !this.form.doc_number || !this.VerificationDocExist;
    },

    verfiyDocPayload() {
      return {
        account_id: this.getAccountId,
        type: "cac",
        id: this.form.doc_number,
        meta: this.getVerificationDoc?.files[0]?.url,
      };
    },
  },

  watch: {
    uploaded_doc: {
      handler(value) {
        console.log("UPLOAD", value);
      },
    },
  },

  data() {
    return {
      uploaded_doc: null,

      form: {
        doc_number: "",
      },

      validity: {
        doc_number: true,
      },
    };
  },

  mounted() {
    this.clearAttachedFile();
  },

  methods: {
    ...mapActions({
      clearAttachedFile: "general/clearAttachedFile",
      verfiyUserDocument: "settings/verfiyUserDocument",
    }),

    async save() {
      this.handleClick("save");

      try {
        const response = await this.verfiyUserDocument(this.verfiyDocPayload);

        this.handleClick("save", "Submit", false);

        if (response?.code === 200) {
          this.pushToast(response.message, "success");
          this.$emit("saved", "Your document has been uploaded successfully");
        } else {
          this.pushToast(response.message, "error");
        }
      } catch (err) {
        this.handleClick("save", "Submit", false);
        this.pushToast("Failed to verify document", "error");
      }
    },
  },
};
</script>

<style lang="scss">
.modal-overlay.doc-verification-overlay {
  .modal-outer-container {
    top: 1.5rem;
  }
  .modal-cover-body {
    max-height: 65vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 2px;
    }
  }
}
</style>
