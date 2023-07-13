<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    class="doc-verification-overlay"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Other documents</div>
        <div class="tertiary-2-text grey-600">
          Choose any document type you wish to upload. Upload multiple documents
          to access more account features.
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <div class="form-label">Select document type</div>

          <!-- SELECT INPUT FIELD -->
          <DropSelectInput
            placeholder="Choose verificatiom file"
            :options="verification_docs"
            @optionSelected="document = $event"
          />
        </div>

        <div class="form-group">
          <BasicInput
            label_title="Document verification number"
            label_id="doc-number"
            :input_value="form.doc_number"
            is_required
            placeholder="Enter verification number"
            @getInputState="updateFormState($event, 'doc_number')"
            :error_handler="{
              type: 'required',
              message: 'Enter document verification number',
            }"
          />
        </div>

        <DocUploadCard
          @uploaded="uploaded_doc = $event"
          titleText="Select document to upload"
          docID="verification_documents"
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
  name: "VerificationDocModal",

  components: {
    ModalCover,
  },

  mounted() {
    this.clearAttachedFile();
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
        (doc) => doc.id === "verification_documents"
      );
      return file_data === undefined ? null : file_data;
    },

    VerificationDocExist() {
      return this.getVerificationDoc?.files?.length ? true : false;
    },

    isDisabled() {
      return (
        !this.form.doc_number || !this.document || !this.VerificationDocExist
      );
    },

    verfiyDocPayload() {
      return {
        account_id: this.getAccountId,
        type: this.document?.id,
        id: this.form.doc_number,
        meta: this.getVerificationDoc?.files[0]?.url,
      };
    },
  },

  data() {
    return {
      verification_docs: [
        {
          name: "Passport",
          id: "passport",
        },
        {
          name: "Driver License",
          id: "drivers_license",
        },
        {
          name: "National ID",
          id: "national_id",
        },
      ],

      document: null,
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
