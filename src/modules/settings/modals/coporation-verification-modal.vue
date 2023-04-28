<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    class="doc-verification-overlay"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Business Verification</div>
        <div class="tertiary-2-text grey-600">
          Upload your business registration document
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <BasicInput
            label_title="Document registration number"
            label_id="doc-number"
            :input_value="form.doc_number"
            is_required
            placeholder="Enter registration number"
            @getInputState="updateFormState($event, 'doc_number')"
            :error_handler="{
              type: 'required',
              message: 'Enter document verification number',
            }"
          />
        </div>

        <DocUploadCard
          @uploaded="uploaded_doc = $event"
          titleText="Select document(s) to upload"
          docID="verification_documents"
          @upload="handleAlert"
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
import ModalCover from "@/shared/components/modal-cover";
import DocUploadCard from "@/shared/components/form-comps/doc-upload-card";
import DropSelectInput from "@/shared/components/drop-select-input";
import BasicInput from "@/shared/components/form-comps/basic-input";

export default {
  name: "CoporationVerificationModal",

  components: {
    ModalCover,
    DropSelectInput,
    BasicInput,
    DocUploadCard,
  },

  mounted() {
    this.clearAttachedFile();
  },

  computed: {
    ...mapGetters({
      getFileData: "general/getFileData",
      getAllFilesData: "general/getAllFilesData",
    }),

    directorsRange() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({ name: i, id: i }));
    },

    isBusiness() {
      return this.getAccountType === "business" ? true : false;
    },

    getVerificationDoc() {
      const file_data = this.getAllFilesData.find(
        (doc) => doc.id === "verification_documents"
      );
      return file_data === undefined ? null : file_data;
    },

    VerificationDocExist() {
      return this.getVerificationDoc?.files?.length ? true : false;
    },

    getDirectorDoc() {
      const file_data = this.getAllFilesData.find(
        (doc) => doc.id === "director_documents"
      );
      return file_data === undefined ? null : file_data;
    },

    directorDocExist() {
      return this.getDirectorDoc?.files?.length ? true : false;
    },

    isDisabled() {
      //   if (this.isBusiness)
      // !this.form.doc_number ||
      //   !this.document ||
      //   !this.VerificationDocExist ||
      //   !this.directorDocExist;

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

  data() {
    return {
      director_count: 0,

      uploaded_doc: null,

      form: {
        doc_number: "",
      },

      validity: {
        doc_number: true,
      },
    };
  },

  methods: {
    ...mapActions({
      clearAttachedFile: "general/clearAttachedFile",
      verfiyUserDocument: "settings/verfiyUserDocument",
    }),

    handleAlert(message) {
      if (this.director_count < 1)
        this.pushToast("Select number of directors", "error");
      if (message) this.pushToast(message, "error");
    },

    async save() {
      this.handleClick("save");
      console.log("PAYLOAD", this.verfiyDocPayload);

      try {
        const response = await this.verfiyUserDocument(this.verfiyDocPayload);

        this.handleClick("save", "Submit", false);

        if (response.code === 200) {
          this.pushToast(response.message, "success");
          this.$emit("saved", "Your document has been uploaded successfully");
        } else {
          this.pushToast(response.message, "error");
        }
      } catch (err) {
        console.log("ERROR SAVING DOCUMENT", err);
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
